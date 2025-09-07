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

# Create IAM role for Session Manager
resource "aws_iam_role" "nat_ssm_role" {
  name = "${var.name_prefix}-nat-ssm-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

# Attach SSM managed policy
resource "aws_iam_role_policy_attachment" "nat_ssm_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
  role       = aws_iam_role.nat_ssm_role.name
}

# Create instance profile
resource "aws_iam_instance_profile" "nat_ssm_profile" {
  name = "${var.name_prefix}-nat-ssm-profile"
  role = aws_iam_role.nat_ssm_role.name

  tags = var.tags
}

# Create NAT Instance for cost optimization
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
  instance_type = "t3.nano"
  subnet_id     = module.vpc.public_subnets[0]
  
  associate_public_ip_address = true
  source_dest_check          = false

  # Add IAM instance profile for Session Manager
  iam_instance_profile = aws_iam_instance_profile.nat_ssm_profile.name

  vpc_security_group_ids = [aws_security_group.nat.id]

  # Configure NAT functionality and install Adminer with Session Manager
  user_data = <<-EOF
    #!/bin/bash
    set -euxo pipefail

    # Update system
    yum update -y

    # Install and start SSM agent (usually pre-installed on Amazon Linux 2)
    yum install -y amazon-ssm-agent
    systemctl start amazon-ssm-agent
    systemctl enable amazon-ssm-agent

    # Enable IP forwarding for NAT functionality
    sysctl -w net.ipv4.ip_forward=1
    printf "net.ipv4.ip_forward = 1\n" > /etc/sysctl.d/99-nat.conf
    sysctl -p /etc/sysctl.d/99-nat.conf || true

    # Install iptables services (AL2)
    yum install -y iptables-services || true

    # Setup MASQUERADE on outward interface (eth0)
    /sbin/iptables -t nat -C POSTROUTING -o eth0 -j MASQUERADE 2>/dev/null || /sbin/iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    service iptables save || true

    # Install Docker
    yum install -y docker
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ec2-user || true

    # Pull and run Adminer container directly (no docker-compose needed)
    docker pull adminer:latest
    
    # Stop and remove any existing adminer container
    docker stop adminer 2>/dev/null || true
    docker rm adminer 2>/dev/null || true
    
    # Run Adminer container
    docker run -d \
      --name adminer \
      --restart unless-stopped \
      -p 8080:8080 \
      -e ADMINER_DESIGN=pepa-linha \
      adminer:latest

    # Create startup script for persistence
    cat >/etc/rc.d/rc.local <<'RCLOCAL'
    #!/bin/bash
    # NAT functionality
    /sbin/iptables -t nat -C POSTROUTING -o eth0 -j MASQUERADE 2>/dev/null || /sbin/iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    sysctl -w net.ipv4.ip_forward=1

    # Start services
    systemctl start amazon-ssm-agent
    systemctl start docker
    
    # Start Adminer container
    docker stop adminer 2>/dev/null || true
    docker rm adminer 2>/dev/null || true
    docker run -d \
      --name adminer \
      --restart unless-stopped \
      -p 8080:8080 \
      -e ADMINER_DESIGN=pepa-linha \
      adminer:latest
    RCLOCAL
    chmod +x /etc/rc.d/rc.local

    # Log status for troubleshooting
    echo "=== NAT Instance Setup Complete ===" >> /var/log/setup.log
    ip route >> /var/log/setup.log 2>&1
    iptables -t nat -S >> /var/log/setup.log 2>&1
    systemctl status amazon-ssm-agent >> /var/log/setup.log 2>&1
    docker ps >> /var/log/setup.log 2>&1
    EOF

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-nat-instance"
  })
}

resource "aws_security_group" "nat" {
  name        = "${var.name_prefix}-nat-sg"
  description = "Security group for NAT instance"
  vpc_id      = module.vpc.vpc_id

  # Allow all traffic from VPC (for NAT functionality)
  ingress {
    description = "All traffic from VPC"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.vpc_cidr]
  }

  # Allow Adminer web interface from specific IPs only
  ingress {
    description = "Adminer web interface"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = var.adminer_allowed_cidrs
  }

  # REMOVED SSH port 22 - using Session Manager instead for security

  # Allow all outbound traffic (needed for NAT, SSM, and updates)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-nat-sg"
  })
}

# Create route for private subnets to use NAT instance
# Use the private route table IDs directly from the VPC module
resource "aws_route" "private_nat" {
  count = length(module.vpc.private_route_table_ids)

  route_table_id         = module.vpc.private_route_table_ids[count.index]
  destination_cidr_block = "0.0.0.0/0"
  network_interface_id   = aws_instance.nat.primary_network_interface_id
}
