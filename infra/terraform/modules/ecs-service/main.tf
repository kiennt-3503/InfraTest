resource "aws_iam_role" "ecs_task_execution" {
  name               = "${var.name_prefix}-ecs-task-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

data "aws_iam_policy_document" "ecs_tasks_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_exec_attach" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_task_definition" "rails" {
  family                   = "${var.name_prefix}-rails"
  network_mode             = "awsvpc"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "rails"
      image     = "${var.ecr_repository_url}:latest"
      essential = true
      portMappings = [
        { containerPort = 3000, hostPort = 3000, protocol = "tcp" }
      ]
      environment = [
        # Core Rails Environment
        { name = "RAILS_ENV", value = var.rails_env },
        { name = "SECRET_KEY_BASE", value = var.secret_key_base },
        { name = "RELEASE_STAGE", value = var.release_stage },
        
        # Database Configuration
        { name = "DATABASE_HOST", value = var.rds_address },
        { name = "DATABASE_USERNAME", value = var.db_username },
        { name = "DATABASE_PASSWORD", value = var.db_password },
        
        # Redis Configuration
        { name = "REDIS_URL", value = var.redis_url },
        
        # Active Record Encryption
        { name = "ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY", value = var.active_record_encryption_primary_key },
        { name = "ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY", value = var.active_record_encryption_deterministic_key },
        { name = "ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT", value = var.active_record_encryption_key_derivation_salt },
        
        # Application Configuration
        { name = "ALLOWED_EMAIL_DOMAIN", value = var.allowed_email_domain },
        { name = "CORS_ORIGINS", value = var.cors_origins },
        
        # External Services
        { name = "BUGSNAG_API_KEY", value = var.bugsnag_api_key },
        { name = "FIREBASE_PROJECT_ID", value = var.firebase_project_id },
        { name = "GOOGLE_CERTS_URL", value = var.google_certs_url },
        { name = "ISSUER_BASE_URL", value = var.issuer_base_url },
        
        # Slack Integration
        { name = "SLACK_BOT_TOKEN", value = var.slack_bot_token },
        { name = "SLACK_CHANNEL_ID", value = var.slack_channel_id },
        
        # API Documentation
        { name = "SWAGGER_USERNAME", value = var.swagger_username },
        { name = "SWAGGER_PASSWORD", value = var.swagger_password },
        
        # Web Push Notifications
        { name = "VAPID_PUBLIC_KEY", value = var.vapid_public_key },
        { name = "VAPID_PRIVATE_KEY", value = var.vapid_private_key },
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/${var.name_prefix}-rails"
          awslogs-region        = var.region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

resource "aws_cloudwatch_log_group" "rails" {
  name              = "/ecs/${var.name_prefix}-rails"
  retention_in_days = 14
}

resource "aws_ecs_service" "rails" {
  name            = "${var.name_prefix}-rails"
  cluster         = var.ecs_cluster_id
  task_definition = aws_ecs_task_definition.rails.arn
  desired_count   = 2
  launch_type     = "EC2"

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "rails"
    container_port   = 3000
  }

  ordered_placement_strategy {
    type  = "spread"
    field = "attribute:ecs.availability-zone"
  }

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [var.ecs_security_group_id]
  }

  depends_on = [var.alb_listener_arn]
} 