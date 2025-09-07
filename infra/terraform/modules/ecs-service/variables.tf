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
  description = "Target group ARN"
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

variable "image_tag" {
  description = "Docker image tag"
  type        = string
  default     = "latest"
}

variable "rds_address" {
  description = "RDS instance address"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "redis_url" {
  description = "Redis connection URL"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

# APP ENV Variables
variable "rails_env" {
  description = "Rails environment"
  type        = string
}

variable "secret_key_base" {
  description = "Rails secret key base"
  type        = string
  sensitive   = true
}

variable "active_record_encryption_primary_key" {
  description = "Active Record encryption primary key"
  type        = string
  sensitive   = true
}

variable "active_record_encryption_deterministic_key" {
  description = "Active Record encryption deterministic key"
  type        = string
  sensitive   = true
}

variable "active_record_encryption_key_derivation_salt" {
  description = "Active Record encryption key derivation salt"
  type        = string
  sensitive   = true
}

variable "allowed_email_domain" {
  description = "Allowed email domain"
  type        = string
}

variable "cors_origins" {
  description = "CORS origins"
  type        = string
}

variable "bugsnag_api_key" {
  description = "Bugsnag API key"
  type        = string
  sensitive   = true
}

variable "firebase_project_id" {
  description = "Firebase project ID"
  type        = string
}

variable "google_certs_url" {
  description = "Google certificates URL"
  type        = string
}

variable "issuer_base_url" {
  description = "Issuer base URL"
  type        = string
}

variable "release_stage" {
  description = "Release stage"
  type        = string
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
  description = "Swagger username"
  type        = string
}

variable "swagger_password" {
  description = "Swagger password"
  type        = string
  sensitive   = true
}

variable "vapid_public_key" {
  description = "VAPID public key"
  type        = string
}

variable "vapid_private_key" {
  description = "VAPID private key"
  type        = string
  sensitive   = true
}
