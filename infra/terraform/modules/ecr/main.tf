resource "aws_ecr_repository" "rails" {
  name                 = "${var.name_prefix}-rails"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = var.tags
}

resource "aws_ecr_lifecycle_policy" "rails" {
  repository = aws_ecr_repository.rails.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1,
        description  = "Keep last 20 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 20
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
} 