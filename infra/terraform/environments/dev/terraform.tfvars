# Cấu hình cơ bản
project = "mapapp"
region  = "ap-northeast-1"

# VPC và Subnets
vpc_cidr            = "10.0.0.0/24"                      # 256 IPs - đủ cho tất cả tiers
public_subnet_cidrs = ["10.0.0.0/26", "10.0.0.64/26"]    # 64 IPs mỗi subnet
app_subnet_cidrs    = ["10.0.0.128/27", "10.0.0.160/27"] # 64 IPs mỗi subnet  
db_subnet_cidrs     = ["10.0.0.192/27", "10.0.0.224/27"] # Dùng chung với app
azs                 = ["ap-northeast-1a", "ap-northeast-1c"]

# ECS Configuration
ecs_instance_type = "t3.small"
desired_capacity  = 1 // Số lượng EC2 instances trong ECS Cluster

# RDS Configuration
db_engine_version = "15.13"
db_instance_class = "db.t4g.micro"
db_username       = "mapapp"
# db_password được lấy từ SSM Parameter Store: /mapapp/dev/db_password

# Security
allowed_ingress_cidrs = ["0.0.0.0/0"] # Thay đổi thành IP office khi done

# Adminer Security - IMPORTANT: Thay đổi thành IP của bạn
adminer_allowed_cidrs = ["0.0.0.0/0"]  # CHỈ CHO PHÉP IP CỦA BẠN: ["YOUR_IP/32"]