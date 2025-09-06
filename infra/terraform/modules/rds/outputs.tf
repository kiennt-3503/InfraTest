output "rds_address" {
  description = "RDS instance address"
  value       = aws_db_instance.this.address
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.this.endpoint
}

output "rds_port" {
  description = "RDS instance port"
  value       = aws_db_instance.this.port
}

output "rds_identifier" {
  description = "RDS instance identifier"
  value       = aws_db_instance.this.identifier
}