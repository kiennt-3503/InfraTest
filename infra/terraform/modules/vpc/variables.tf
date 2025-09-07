variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs"
  type        = list(string)
}

variable "app_subnet_cidrs" {
  description = "Application (ECS) subnet CIDRs"
  type        = list(string)
}

variable "db_subnet_cidrs" {
  description = "Database subnet CIDRs"
  type        = list(string)
}

variable "azs" {
  description = "Availability Zones to use"
  type        = list(string)
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

variable "adminer_allowed_cidrs" {
  description = "CIDR blocks allowed to access Adminer web interface"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # Change this to your office IP for security
}
