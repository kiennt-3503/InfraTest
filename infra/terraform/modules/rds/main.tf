resource "aws_db_subnet_group" "this" {
  name       = "${var.name_prefix}-db-subnets"
  subnet_ids = var.database_subnet_ids
  tags       = var.tags
}

resource "aws_db_parameter_group" "this" {
  name   = "${var.name_prefix}-pg"
  family = "postgres15"

  tags = var.tags
}

resource "aws_db_instance" "this" {
  identifier              = "${var.name_prefix}-db"
  engine                  = "postgres"
  engine_version          = var.db_engine_version
  instance_class          = var.db_instance_class
  db_name                 = var.db_name
  username                = var.db_username
  password                = var.db_password
  db_subnet_group_name    = aws_db_subnet_group.this.name
  vpc_security_group_ids  = [var.rds_security_group_id]
  allocated_storage       = 20
  max_allocated_storage   = 100
  storage_encrypted       = true
  skip_final_snapshot     = true
  publicly_accessible     = false
  backup_retention_period = 7
  deletion_protection     = false
  apply_immediately       = true
  multi_az                = false

  tags = var.tags
} 