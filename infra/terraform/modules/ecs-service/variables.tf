variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "ecs_cluster_id" {
  description = "ECS cluster ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
}

variable "ecs_security_group_id" {
  description = "ECS security group ID"
  type        = string
}

variable "target_group_arn" {
  description = "ALB target group ARN"
  type        = string
}

variable "alb_listener_arn" {
  description = "ALB listener ARN"
  type        = string
}

variable "ecr_repository_url" {
  description = "ECR repository URL"
  type        = string
}

variable "rds_address" {
  description = "RDS instance address"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
} 
variable "redis_url" {
  description = "Redis connection URL"
  type        = string
}

variable "rails_env" {
  description = "Rails environment (e.g., development, production)"
  type        = string
  default     = "production"
}

# APP ENV - Remove all default values
variable "active_record_encryption_primary_key" {
  description = "Active Record Encryption primary key"
  type        = string
}

variable "active_record_encryption_deterministic_key" {
  description = "Active Record Encryption deterministic key"
  type        = string
}

variable "active_record_encryption_key_derivation_salt" {
  description = "Active Record Encryption key derivation salt"
  type        = string
}

variable "allowed_email_domain" {
  description = "List of allowed email domains for user sign-up"
  type        = string
}

variable "bugsnag_api_key" {
  description = "Bugsnag API key"
  type        = string
  sensitive   = true
}

variable "cors_origins" {
  description = "CORS allowed origins"
  type        = string
}

variable "firebase_project_id" {
  description = "Firebase project ID"
  type        = string
}

variable "google_certs_url" {
  description = "Google certs URL"
  type        = string
}

variable "issuer_base_url" {
  description = "Issuer base URL"
  type        = string
}

variable "release_stage" {
  description = "Release stage (e.g., development, production)"
  type        = string
}

variable "secret_key_base" {
  description = "Secret key base for Rails"
  type        = string
  sensitive   = true
}

variable "slack_bot_token" {
  description = "Slack bot token"
  type        = string
  sensitive   = true
}

variable "slack_channel_id" {
  description = "Slack channel ID"
  type        = string
}

variable "swagger_username" {
  description = "Swagger UI basic auth username"
  type        = string
}

variable "swagger_password" {
  description = "Swagger UI basic auth password"
  type        = string
  sensitive   = true
}

variable "vapid_public_key" {
  description = "VAPID public key for Web Push"
  type        = string
}

variable "vapid_private_key" {
  description = "VAPID private key for Web Push"
  type        = string
  sensitive   = true
}
