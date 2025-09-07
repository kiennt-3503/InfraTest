variable "project" {
  description = "Project name"
  type        = string
  default     = "mapapp"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "app_subnet_cidrs" {
  description = "Application subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}

variable "db_subnet_cidrs" {
  description = "Database subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.100.0/24", "10.0.200.0/24"]
}

variable "azs" {
  description = "Availability zones"
  type        = list(string)
  default     = ["ap-northeast-1a", "ap-northeast-1c"]
}

variable "allowed_ingress_cidrs" {
  description = "Allowed ingress CIDR blocks"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "ecs_instance_type" {
  description = "ECS instance type"
  type        = string
  default     = "t3.medium"
}

variable "desired_capacity" {
  description = "Desired capacity for ECS cluster"
  type        = number
  default     = 2
}

variable "db_engine_version" {
  description = "RDS engine version"
  type        = string
  default     = "15.4"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t4g.micro"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "mapapp_dev"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
}

variable "db_password_ssm_name" {
  description = "SSM parameter name for database password"
  type        = string
  default     = "/mapapp/dev/db_password"
}

variable "redis_node_type" {
  description = "Redis node type"
  type        = string
  default     = "cache.t4g.micro"
}

variable "image_tag" {
  description = "Docker image tag"
  type        = string
  default     = "latest"
}

variable "adminer_allowed_cidrs" {
  description = "CIDR blocks allowed to access Adminer web interface"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
