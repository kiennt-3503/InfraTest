variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "database_subnet_ids" {
  description = "Database subnet IDs for Redis"
  type        = list(string)
}

variable "redis_security_group_id" {
  description = "Security group ID for Redis"
  type        = string
}

variable "redis_node_type" {
  description = "Redis node type"
  type        = string
  default     = "cache.t4g.micro"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
