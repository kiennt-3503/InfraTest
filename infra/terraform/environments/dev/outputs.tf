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

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = module.alb.alb_dns_name
}

output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = module.ecr.repository_url
}

output "rds_address" {
  description = "RDS instance address"
  value       = module.rds.rds_address
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = module.ecs_service.service_name
}
output "redis_endpoint" {
  description = "Redis primary endpoint"
  value       = module.redis.redis_endpoint
}
output "redis_url" {
  description = "Redis connection URL"
  value       = module.redis.redis_url
}

output "nat_instance_public_ip" {
  description = "NAT instance public IP"
  value       = module.vpc.nat_instance_public_ip
}

output "nat_instance_id" {
  description = "NAT instance ID for Session Manager"
  value       = module.vpc.nat_instance_id
}

output "adminer_url" {
  description = "Adminer web interface URL"
  value       = module.vpc.adminer_url
  sensitive   = false
}

output "session_manager_connect_command" {
  description = "Command to connect to NAT instance via Session Manager"
  value       = "${module.vpc.session_manager_connect_command} --region ${var.region}"
  sensitive   = false
}

output "adminer_port_forward_command" {
  description = "Command to port forward Adminer through Session Manager"
  value       = "${module.vpc.adminer_port_forward_command} --region ${var.region}"
  sensitive   = false
}

output "database_connection_info" {
  description = "Database connection information for Adminer"
  value = {
    host     = module.rds.rds_address
    port     = 5432
    database = var.db_name
    username = var.db_username
  }
  sensitive = false
}
