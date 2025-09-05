# Backend configuration
terraform {
  backend "s3" {
    bucket = "mapapp-terraform-state"
    key    = "environments/dev/terraform.tfstate"
    region = "ap-northeast-1"

    # State locking
    dynamodb_table = "mapapp-terraform-locks"
    encrypt        = true
  }
} 