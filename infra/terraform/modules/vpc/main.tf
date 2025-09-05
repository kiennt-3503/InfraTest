module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.9"

  name = "${var.name_prefix}-vpc"
  cidr = var.vpc_cidr

  azs                 = var.azs
  public_subnets      = var.public_subnet_cidrs
  private_subnets     = var.app_subnet_cidrs
  database_subnets    = var.db_subnet_cidrs
  
  # Disable NAT Gateway for cost optimization
  enable_nat_gateway  = false
  
  enable_dns_hostnames = true
  enable_dns_support   = true

  create_igw = true

  public_subnet_tags = {
    Tier = "public"
  }

  private_subnet_tags = {
    Tier = "app"
  }

  database_subnet_tags = {
    Tier = "db"
  }

  tags = var.tags
}

# Create NAT Instance for cost optimization (~$3.50/month vs $45/month NAT Gateway)
data "aws_ami" "nat" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "nat" {
  ami           = data.aws_ami.nat.id
  instance_type = "t3.nano"  # Smallest instance for cost optimization
  subnet_id     = module.vpc.public_subnets[0]
  
  associate_public_ip_address = true
  source_dest_check          = false  # Required for NAT instance

  vpc_security_group_ids = [aws_security_group.nat.id]

  # Configure NAT functionality on the instance
  user_data = <<-EOF
    #!/bin/bash
    set -euxo pipefail

    # Enable IP forwarding
    sysctl -w net.ipv4.ip_forward=1
    printf "net.ipv4.ip_forward = 1\n" > /etc/sysctl.d/99-nat.conf
    sysctl -p /etc/sysctl.d/99-nat.conf || true

    # Install iptables services (AL2)
    yum install -y iptables-services || true

    # Setup MASQUERADE on outward interface (eth0)
    /sbin/iptables -t nat -C POSTROUTING -o eth0 -j MASQUERADE 2>/dev/null || /sbin/iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    service iptables save || true

    # Persist on reboot
    cat >/etc/rc.d/rc.local <<'RCLOCAL'
    #!/bin/bash
    /sbin/iptables -t nat -C POSTROUTING -o eth0 -j MASQUERADE 2>/dev/null || /sbin/iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    sysctl -w net.ipv4.ip_forward=1
    RCLOCAL
    chmod +x /etc/rc.d/rc.local

    # Log current routes and iptables
    ip route || true
    iptables -t nat -S || true
    EOF

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-nat-instance"
  })
}

resource "aws_security_group" "nat" {
  name        = "${var.name_prefix}-nat-sg"
  description = "Security group for NAT instance"
  vpc_id      = module.vpc.vpc_id

  # Allow all traffic from VPC
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.vpc_cidr]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}

# Create route for private subnets to use NAT instance
# Use the private route table IDs directly from the VPC module
resource "aws_route" "private_nat" {
  count = length(module.vpc.private_route_table_ids)

  route_table_id         = module.vpc.private_route_table_ids[count.index]
  destination_cidr_block = "0.0.0.0/0"
  network_interface_id   = aws_instance.nat.primary_network_interface_id
}
