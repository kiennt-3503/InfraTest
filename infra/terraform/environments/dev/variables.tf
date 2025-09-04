variable "project" {
  description = "Project name prefix"
  type        = string
  default     = "mapapp"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
  default     = "10.0.0.0/26"
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs"
  type        = list(string)
  default     = ["10.0.0.0/27", "10.0.0.16/27"]
}

variable "app_subnet_cidrs" {
  description = "Application (ECS) subnet CIDRs"
  type        = list(string)
  default     = ["10.0.0.32/28", "10.0.0.40/28"]
}

variable "db_subnet_cidrs" {
  description = "Database subnet CIDRs"
  type        = list(string)
  default     = ["10.0.0.48/28", "10.0.0.56/28"]
}

variable "azs" {
  description = "Availability Zones to use"
  type        = list(string)
  default     = ["ap-northeast-1a", "ap-northeast-1c"]
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

variable "db_engine_version" {
  description = "RDS PostgreSQL engine version"
  type        = string
  default     = "15.5"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t4g.micro"
}

variable "db_username" {
  description = "RDS master username"
  type        = string
  default     = "mapapp"
}

variable "db_password" {
  description = "RDS master password"
  type        = string
  sensitive   = true
}

variable "allowed_ingress_cidrs" {
  description = "CIDR blocks allowed to access ALB (e.g., office IP)"
  type        = list(string)
  default     = ["0.0.0.0/0"]
} 