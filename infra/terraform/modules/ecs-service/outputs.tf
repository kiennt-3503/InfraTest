output "service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.rails.name
}

output "service_arn" {
  description = "ECS service ARN"
  value       = aws_ecs_service.rails.id
}

output "task_definition_arn" {
  description = "ECS task definition ARN"
  value       = aws_ecs_task_definition.rails.arn
}

output "log_group_name" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.rails.name
} 