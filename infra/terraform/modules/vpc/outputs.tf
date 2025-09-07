output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnets" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnets
}

output "private_subnets" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnets
}

output "database_subnets" {
  description = "Database subnet IDs"
  value       = module.vpc.database_subnets
}

output "vpc_cidr_block" {
  description = "VPC CIDR block"
  value       = module.vpc.vpc_cidr_block
}

output "nat_instance_public_ip" {
  description = "Public IP address of the NAT instance"
  value       = aws_instance.nat.public_ip
}

output "nat_instance_id" {
  description = "Instance ID of the NAT instance for Session Manager"
  value       = aws_instance.nat.id
}

output "adminer_url" {
  description = "Adminer web interface URL"
  value       = "http://${aws_instance.nat.public_ip}:8080"
}

output "session_manager_connect_command" {
  description = "AWS CLI command to connect via Session Manager"
  value       = "aws ssm start-session --target ${aws_instance.nat.id}"
}

output "adminer_port_forward_command" {
  description = "AWS CLI command to port forward Adminer through Session Manager"
  value       = "aws ssm start-session --target ${aws_instance.nat.id} --document-name AWS-StartPortForwardingSession --parameters '{\"portNumber\":[\"8080\"],\"localPortNumber\":[\"8080\"]}'"
} 