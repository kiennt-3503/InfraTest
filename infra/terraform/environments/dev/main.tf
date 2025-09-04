locals {
  name_prefix = var.project
  tags = {
    Project = var.project
    Environment = "dev"
    Managed = "terraform"
  }
}

# VPC Module
module "vpc" {
  source = "../../modules/vpc"

  name_prefix           = local.name_prefix
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  app_subnet_cidrs     = var.app_subnet_cidrs
  db_subnet_cidrs      = var.db_subnet_cidrs
  azs                  = var.azs
  tags                 = local.tags
}

# Security Module
module "security" {
  source = "../../modules/security"

  name_prefix            = local.name_prefix
  vpc_id                = module.vpc.vpc_id
  allowed_ingress_cidrs = var.allowed_ingress_cidrs
  tags                  = local.tags
}

# ECR Module
module "ecr" {
  source = "../../modules/ecr"

  name_prefix = local.name_prefix
  tags        = local.tags
}

# ECS Module
module "ecs" {
  source = "../../modules/ecs"

  name_prefix              = local.name_prefix
  ecs_instance_type        = var.ecs_instance_type
  desired_capacity         = var.desired_capacity
  private_subnet_ids       = module.vpc.private_subnets
  ecs_security_group_id    = module.security.ecs_security_group_id
  tags                     = local.tags
}

# ALB Module
module "alb" {
  source = "../../modules/alb"

  name_prefix            = local.name_prefix
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnets
  alb_security_group_id = module.security.alb_security_group_id
  tags                  = local.tags
}

# RDS Module
module "rds" {
  source = "../../modules/rds"

  name_prefix            = local.name_prefix
  database_subnet_ids    = module.vpc.database_subnets
  rds_security_group_id  = module.security.rds_security_group_id
  db_engine_version      = var.db_engine_version
  db_instance_class      = var.db_instance_class
  db_username            = var.db_username
  db_password            = var.db_password
  tags                   = local.tags
}

# ECS Service Module
module "ecs_service" {
  source = "../../modules/ecs-service"

  name_prefix           = local.name_prefix
  region               = var.region
  ecs_cluster_id       = module.ecs.cluster_id
  private_subnet_ids   = module.vpc.private_subnets
  ecs_security_group_id = module.security.ecs_security_group_id
  target_group_arn     = module.alb.target_group_arn
  alb_listener_arn     = module.alb.listener_arn
  ecr_repository_url   = module.ecr.repository_url
  rds_address          = module.rds.rds_address
  db_username          = var.db_username
  db_password          = var.db_password
  tags                 = local.tags
} 

# Tạo ECS Service Linked Role
resource "aws_iam_service_linked_role" "ecs" {
  aws_service_name = "ecs.amazonaws.com"
  description      = "Service linked role for ECS"
} 