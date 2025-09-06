locals {
  name_prefix = var.project
  tags = {
    Project     = var.project
    Environment = "dev"
    Managed     = "terraform"
  }
}

# Fetch all SSM parameters
data "aws_ssm_parameter" "db_password" {
  name            = var.db_password_ssm_name
  with_decryption = true
}

data "aws_ssm_parameter" "rails_env" {
  name            = "/mapapp/dev/rails_env"
  with_decryption = true
}

data "aws_ssm_parameter" "secret_key_base" {
  name            = "/mapapp/dev/secret_key_base"
  with_decryption = true
}

data "aws_ssm_parameter" "active_record_encryption_primary_key" {
  name            = "/mapapp/dev/active_record_encryption_primary_key"
  with_decryption = true
}

data "aws_ssm_parameter" "active_record_encryption_deterministic_key" {
  name            = "/mapapp/dev/active_record_encryption_deterministic_key"
  with_decryption = true
}

data "aws_ssm_parameter" "active_record_encryption_key_derivation_salt" {
  name            = "/mapapp/dev/active_record_encryption_key_derivation_salt"
  with_decryption = true
}

data "aws_ssm_parameter" "allowed_email_domain" {
  name            = "/mapapp/dev/allowed_email_domain"
  with_decryption = true
}

data "aws_ssm_parameter" "bugsnag_api_key" {
  name            = "/mapapp/dev/bugsnag_api_key"
  with_decryption = true
}

data "aws_ssm_parameter" "firebase_project_id" {
  name            = "/mapapp/dev/firebase_project_id"
  with_decryption = true
}

data "aws_ssm_parameter" "google_certs_url" {
  name            = "/mapapp/dev/google_certs_url"
  with_decryption = true
}

data "aws_ssm_parameter" "issuer_base_url" {
  name            = "/mapapp/dev/issuer_base_url"
  with_decryption = true
}

data "aws_ssm_parameter" "release_stage" {
  name            = "/mapapp/dev/release_stage"
  with_decryption = true
}

data "aws_ssm_parameter" "slack_bot_token" {
  name            = "/mapapp/dev/slack_bot_token"
  with_decryption = true
}

data "aws_ssm_parameter" "slack_channel_id" {
  name            = "/mapapp/dev/slack_channel_id"
  with_decryption = true
}

data "aws_ssm_parameter" "swagger_username" {
  name            = "/mapapp/dev/swagger_username"
  with_decryption = true
}

data "aws_ssm_parameter" "swagger_password" {
  name            = "/mapapp/dev/swagger_password"
  with_decryption = true
}

data "aws_ssm_parameter" "vapid_public_key" {
  name            = "/mapapp/dev/vapid_public_key"
  with_decryption = true
}

data "aws_ssm_parameter" "vapid_private_key" {
  name            = "/mapapp/dev/vapid_private_key"
  with_decryption = true
}

# VPC Module
module "vpc" {
  source = "../../modules/vpc"

  name_prefix         = local.name_prefix
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  app_subnet_cidrs    = var.app_subnet_cidrs
  db_subnet_cidrs     = var.db_subnet_cidrs
  azs                 = var.azs
  tags                = local.tags
}

# Security Module
module "security" {
  source = "../../modules/security"

  name_prefix           = local.name_prefix
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

  name_prefix           = local.name_prefix
  ecs_instance_type     = var.ecs_instance_type
  desired_capacity      = var.desired_capacity
  private_subnet_ids    = module.vpc.private_subnets
  ecs_security_group_id = module.security.ecs_security_group_id
  tags                  = local.tags
}

# ALB Module
module "alb" {
  source = "../../modules/alb"

  name_prefix           = local.name_prefix
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnets
  alb_security_group_id = module.security.alb_security_group_id
  tags                  = local.tags
}

# RDS Module
module "rds" {
  source = "../../modules/rds"

  name_prefix           = local.name_prefix
  database_subnet_ids   = module.vpc.database_subnets
  rds_security_group_id = module.security.rds_security_group_id
  db_engine_version     = var.db_engine_version
  db_instance_class     = var.db_instance_class
  db_name               = var.db_name
  db_username           = var.db_username
  db_password           = data.aws_ssm_parameter.db_password.value
  tags                  = local.tags
}

# Redis Module
module "redis" {
  source = "../../modules/redis"

  name_prefix             = local.name_prefix
  database_subnet_ids     = module.vpc.database_subnets
  redis_security_group_id = module.security.redis_security_group_id
  redis_node_type         = var.redis_node_type
  tags                    = local.tags
}

# ECS Service Module
module "ecs_service" {
  source = "../../modules/ecs-service"

  name_prefix           = local.name_prefix
  region                = var.region
  ecs_cluster_id        = module.ecs.cluster_id
  private_subnet_ids    = module.vpc.private_subnets
  ecs_security_group_id = module.security.ecs_security_group_id
  target_group_arn      = module.alb.target_group_arn
  alb_listener_arn      = module.alb.listener_arn
  ecr_repository_url    = module.ecr.repository_url
  rds_address           = module.rds.rds_address
  db_username           = var.db_username
  db_password           = data.aws_ssm_parameter.db_password.value
  redis_url             = module.redis.redis_url
  tags                  = local.tags
  image_tag             = var.image_tag

  # APP ENV - Pass all environment-specific variables
  rails_env                                    = data.aws_ssm_parameter.rails_env.value
  secret_key_base                              = data.aws_ssm_parameter.secret_key_base.value
  active_record_encryption_primary_key         = data.aws_ssm_parameter.active_record_encryption_primary_key.value
  active_record_encryption_deterministic_key   = data.aws_ssm_parameter.active_record_encryption_deterministic_key.value
  active_record_encryption_key_derivation_salt = data.aws_ssm_parameter.active_record_encryption_key_derivation_salt.value
  allowed_email_domain                         = data.aws_ssm_parameter.allowed_email_domain.value
  bugsnag_api_key                              = data.aws_ssm_parameter.bugsnag_api_key.value
  cors_origins                                 = "*"
  firebase_project_id                          = data.aws_ssm_parameter.firebase_project_id.value
  google_certs_url                             = data.aws_ssm_parameter.google_certs_url.value
  issuer_base_url                              = data.aws_ssm_parameter.issuer_base_url.value
  release_stage                                = data.aws_ssm_parameter.release_stage.value
  slack_bot_token                              = data.aws_ssm_parameter.slack_bot_token.value
  slack_channel_id                             = data.aws_ssm_parameter.slack_channel_id.value
  swagger_username                             = data.aws_ssm_parameter.swagger_username.value
  swagger_password                             = data.aws_ssm_parameter.swagger_password.value
  vapid_public_key                             = data.aws_ssm_parameter.vapid_public_key.value
  vapid_private_key                            = data.aws_ssm_parameter.vapid_private_key.value
}

# Tạo ECS Service Linked Role
#resource "aws_iam_service_linked_role" "ecs" {
#  aws_service_name = "ecs.amazonaws.com"
#  description      = "Service linked role for ECS"
#} 
