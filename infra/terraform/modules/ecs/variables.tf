variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "ecs_instance_type" {
  description = "EC2 instance type for ECS capacity"
  type        = string
  default     = "t3.small"
}

variable "desired_capacity" {
  description = "Desired ECS capacity (EC2)"
  type        = number
  default     = 2
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for ECS instances"
  type        = list(string)
}

variable "ecs_security_group_id" {
  description = "Security group ID for ECS instances"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
} 