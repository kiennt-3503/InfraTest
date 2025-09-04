terraform {
  required_version = ">= 1.2"
}

# AWS Provider version
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.92"
    }
  }
} 