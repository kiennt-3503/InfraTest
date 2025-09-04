# MAPAPP Infrastructure - Terraform Modular Structure

This directory contains the modular Terraform configuration for the MAPAPP infrastructure.

## Directory Structure

```
terraform/
├── environments/          # Environment-specific configurations
│   └── dev/              # Development environment
│       ├── main.tf       # Main configuration
│       ├── variables.tf  # Variable definitions
│       ├── terraform.tfvars  # Variable values
│       ├── backend.tf    # Backend configuration
│       └── outputs.tf    # Output values
├── modules/              # Reusable Terraform modules
│   ├── vpc/             # VPC and networking
│   ├── security/        # Security groups
│   ├── ecr/             # ECR repositories
│   ├── ecs/             # ECS cluster and capacity
│   ├── ecs-service/     # ECS service and task definition
│   ├── alb/             # Application Load Balancer
│   └── rds/             # RDS database
├── shared/              # Shared configurations
│   ├── providers.tf     # Provider configurations
│   └── versions.tf      # Version constraints
└── scripts/             # Deployment scripts
    ├── deploy.sh        # Deploy script
    └── destroy.sh       # Destroy script
```

## Modules

### VPC Module (`modules/vpc/`)
- Creates VPC with public, private, and database subnets
- Configures NAT Gateway and Internet Gateway
- Sets up route tables and DNS settings

### Security Module (`modules/security/`)
- Creates security groups for ALB, ECS, and RDS
- Configures ingress and egress rules
- Manages network access controls

### ECR Module (`modules/ecr/`)
- Creates ECR repository for Rails application
- Configures image scanning and lifecycle policies
- Sets up encryption and access controls

### ECS Module (`modules/ecs/`)
- Creates ECS cluster
- Sets up Auto Scaling Group with EC2 instances
- Configures IAM roles and launch templates

### ECS Service Module (`modules/ecs-service/`)
- Creates ECS task definition and service
- Configures container definitions and environment variables
- Sets up CloudWatch logging

### ALB Module (`modules/alb/`)
- Creates Application Load Balancer
- Configures target groups and listeners
- Sets up health checks

### RDS Module (`modules/rds/`)
- Creates RDS PostgreSQL instance
- Configures subnet groups and parameter groups
- Sets up backup and encryption

## Environments

### Development (`environments/dev/`)
- Single AZ deployment for cost optimization
- Smaller instance types
- Open security groups for development

## Usage

### Prerequisites

1. Install Terraform (>= 1.2)
2. Configure AWS credentials
3. Set up S3 backend bucket and DynamoDB table for state locking

### Deployment

1. **Initialize Terraform:**
   ```bash
   cd terraform
   ./scripts/deploy.sh dev init
   ```

2. **Plan changes:**
   ```bash
   ./scripts/deploy.sh dev plan
   ```

3. **Apply changes:**
   ```bash
   export TF_VAR_db_password="your-secure-password"
   ./scripts/deploy.sh dev apply
   ```

4. **Destroy infrastructure:**
   ```bash
   export TF_VAR_db_password="your-secure-password"
   ./scripts/destroy.sh dev
   ```

### Environment Variables

Required environment variables:
- `TF_VAR_db_password`: Database password (required for apply/destroy)

### Backend Configuration

The infrastructure uses S3 backend for state storage:
- Bucket: `mapapp-terraform-state`
- Key: `environments/{environment}/terraform.tfstate`
- Region: `ap-northeast-1`
- State locking: DynamoDB table `mapapp-terraform-locks`

## Security Considerations

1. **Database Password**: Always use environment variables for sensitive data
2. **Security Groups**: Review and restrict CIDR blocks for production
3. **Encryption**: All resources use encryption at rest
4. **Access Control**: Use IAM roles and policies for least privilege access

## Cost Optimization

1. **Development Environment**: Uses single AZ and smaller instances
2. **Auto Scaling**: Configured to scale based on demand
3. **RDS**: Uses t4g.micro instance class for development
4. **Storage**: Uses gp3 storage for better performance/cost ratio

## Monitoring and Logging

1. **CloudWatch**: ECS services send logs to CloudWatch
2. **Container Insights**: Enabled on ECS cluster
3. **ALB Access Logs**: Can be enabled for request monitoring
4. **RDS Monitoring**: Enhanced monitoring available

## Troubleshooting

### Common Issues

1. **State Lock**: If Terraform fails, check DynamoDB for state locks
2. **Permission Errors**: Ensure AWS credentials have required permissions
3. **Network Issues**: Verify VPC and security group configurations
4. **Database Connection**: Check RDS security group and subnet configurations

### Useful Commands

```bash
# Check Terraform state
terraform state list

# Import existing resources
terraform import module.vpc.module.vpc.aws_vpc.this vpc-id

# Refresh state
terraform refresh

# Validate configuration
terraform validate
```

## Future Enhancements

1. **Multi-Environment**: Add staging and production environments
2. **CI/CD Integration**: Add GitHub Actions or AWS CodePipeline
3. **Monitoring**: Add CloudWatch dashboards and alarms
4. **Backup Strategy**: Implement automated backup and recovery
5. **Security**: Add WAF and additional security layers 