# MAPAPP Infrastructure Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                AWS Cloud                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
            │   Internet   │ │   VPC       │ │   RDS       │
            │   Gateway    │ │   (Private) │ │   (Private) │
            └───────┬──────┘ └──────┬──────┘ └──────┬──────┘
                    │               │               │
            ┌───────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
            │   Public     │ │   Private   │ │   Database  │
            │   Subnets    │ │   Subnets   │ │   Subnets   │
            │   (ALB)      │ │   (ECS)     │ │   (RDS)     │
            └───────┬──────┘ └─────────────┘ └─────────────┘
                    │               │
            ┌───────▼──────┐ ┌──────▼──────┐
            │ Application  │ │ ECS Cluster │
            │ Load Balancer│ │ + Services  │
            │ (ALB)        │ │ (Rails App) │
            └───────┬──────┘ └─────────────┘
                    │
            ┌───────▼──────┐ ┌──────▼──────┐
            │ Security     │ │ ECR         │
            │ Groups       │ │ Repository  │
            │ (ALB/ECS/RDS)│ │ (Docker)    │
            └──────────────┘ └─────────────┘
```

## Detailed Component Architecture

### 1. Networking Layer (VPC Module) - Single AZ
```
┌─────────────────────────────────────────────────────────────────┐
│                           VPC (10.0.0.0/26)                    │
│                           Single AZ: ap-northeast-1a            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │   Public Zone   │    │  Private Zone   │    │ Database    │  │
│  │                 │    │                 │    │   Zone      │  │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────┐ │  │
│  │ │ Subnet      │ │    │ │ Subnet      │ │    │ │ Subnet  │ │  │
│  │ │ 10.0.0.0/27 │ │    │ │10.0.0.32/28│ │    │ │10.0.0.48│ │  │
│  │ │ (ALB)       │ │    │ │ (ECS)       │ │    │ │ /28     │ │  │
│  │ └─────────────┘ │    │ └─────────────┘ │    │ │ (RDS)   │ │  │
│  └─────────────────┘    └─────────────────┘    │ └─────────┘ │  │
│           │                       │            └─────────────┘  │
│           │                       │                    │        │
│  ┌───────▼──────┐        ┌───────▼──────┐      ┌──────▼──────┐  │
│  │ Internet     │        │ No NAT       │      │ Route Table │  │
│  │ Gateway      │        │ Gateway      │      │ (Private)   │  │
│  │ (Public)     │        │ (Cost Opt.)  │      │ (No Internet)│  │
│  └──────────────┘        └──────────────┘      └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Security Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                        Security Groups                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │   ALB SG        │    │   ECS SG        │    │   RDS SG    │  │
│  │                 │    │                 │    │             │  │
│  │ Inbound:        │    │ Inbound:        │    │ Inbound:    │  │
│  │ - HTTP (80)     │    │ - Port 3000     │    │ - PostgreSQL│  │
│  │   from 0.0.0.0/0│    │   from ALB SG   │    │   (5432)    │  │
│  │                 │    │                 │    │   from ECS  │  │
│  │ Outbound:       │    │ Outbound:       │    │   SG        │  │
│  │ - All (0.0.0.0/0)│   │ - All (0.0.0.0/0)│   │             │  │
│  └─────────────────┘    └─────────────────┘    │ Outbound:   │  │
│           │                       │            │ - All       │  │
│           └───────────────────────┼────────────┘             │  │
│                                   │                          │  │
└───────────────────────────────────────────────────────────────┘
```

### 3. Application Layer
```
┌─────────────────────────────────────────────────────────────────┐
│                    Application Load Balancer                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    ALB (Public)                            │ │
│  │                                                             │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │ │
│  │  │ Listener    │    │ Target      │    │ Health      │     │ │
│  │  │ Port 80     │───▶│ Group       │───▶│ Check       │     │ │
│  │  │ HTTP        │    │ Port 3000   │    │ / (200-399) │     │ │
│  │  └─────────────┘    └─────────────┘    └─────────────┘     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    ECS Cluster                             │ │
│  │                                                             │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │ │
│  │  │ Auto Scaling│    │ ECS Service │    │ Task        │     │ │
│  │  │ Group       │───▶│ (Rails)     │───▶│ Definition  │     │ │
│  │  │ (EC2)       │    │ Desired: 2  │    │ (Docker)    │     │ │
│  │  └─────────────┘    └─────────────┘    └─────────────┘     │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Container & Database Layer
```
┌─────────────────────────────────────────────────────────────────┐
│                    Container Architecture                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    ECR Repository                          │ │
│  │                                                             │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │ │
│  │  │ Image       │    │ Lifecycle   │    │ Encryption  │     │ │
│  │  │ Scanning    │    │ Policy      │    │ (AES256)    │     │ │
│  │  │ (On Push)   │    │ (Keep 20)   │    │             │     │ │
│  │  └─────────────┘    └─────────────┘    └─────────────┘     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    ECS Task Definition                     │ │
│  │                                                             │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │ │
│  │  │ Container   │    │ Environment │    │ Logging     │     │ │
│  │  │ Port 3000   │    │ Variables   │    │ (CloudWatch)│     │ │
│  │  │ Rails App   │    │ (DB Config) │    │             │     │ │
│  │  └─────────────┘    └─────────────┘    └─────────────┘     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    RDS PostgreSQL                          │ │
│  │                                                             │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │ │
│  │  │ Instance    │    │ Backup      │    │ Encryption  │     │ │
│  │  │ t4g.micro   │    │ Retention   │    │ (At Rest)   │     │ │
│  │  │ PostgreSQL  │    │ 7 Days      │    │             │     │ │
│  │  │ 15.5        │    │             │    │             │     │ │
│  │  └─────────────┘    └─────────────┘    └─────────────┘     │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
Internet User
     │
     ▼
┌─────────────┐
│   DNS       │
│ Resolution  │
└─────┬───────┘
      │
      ▼
┌─────────────┐    HTTP Request    ┌─────────────┐
│   ALB       │◄───────────────────│   Client    │
│ (Port 80)   │                    │ (Browser)   │
└─────┬───────┘                    └─────────────┘
      │
      ▼ (Load Balancing)
┌─────────────┐
│ ECS Service │
│ (Rails App) │
│ Port 3000   │
└─────┬───────┘
      │
      ▼ (Database Query)
┌─────────────┐
│ PostgreSQL  │
│ Database    │
│ Port 5432   │
└─────────────┘
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Security Flow                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Internet ──▶ ALB SG ──▶ ECS SG ──▶ RDS SG                    │
│     │           │         │         │                          │
│     │           │         │         │                          │
│     ▼           ▼         ▼         ▼                          │
│  ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐                     │
│  │HTTP │    │Port │    │Port │    │Port │                     │
│  │ 80  │    │ 80  │    │3000 │    │5432 │                     │
│  └─────┘    └─────┘    └─────┘    └─────┘                     │
│     │           │         │         │                          │
│     │           │         │         │                          │
│     └───────────┼─────────┼─────────┘                          │
│                 │         │                                    │
│                 ▼         ▼                                    │
│              ┌─────────────┐                                   │
│              │  Private    │                                   │
│              │  Network    │                                   │
│              └─────────────┘                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Cost Optimization Features

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cost Optimization                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ Single AZ   │    │ Small       │    │ No NAT      │         │
│  │ Deployment  │    │ Instances   │    │ Gateway     │         │
│  │ (Dev)       │    │ t3.small    │    │ (Save $45/m)│         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ RDS         │    │ ECR         │    │ Storage     │         │
│  │ t4g.micro   │    │ Lifecycle   │    │ Encryption  │         │
│  │ (Burstable) │    │ (Keep 20)   │    │ (Efficient) │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Monitoring & Logging

```
┌─────────────────────────────────────────────────────────────────┐
│                    Monitoring & Logging                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ CloudWatch  │    │ Container   │    │ ECS         │         │
│  │ Logs        │    │ Insights    │    │ Service     │         │
│  │ (ECS App)   │    │ (Cluster)   │    │ Logs        │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ ALB         │    │ RDS         │    │ Auto Scaling│         │
│  │ Access Logs │    │ Monitoring  │    │ Metrics     │         │
│  │ (Optional)  │    │ (Enhanced)  │    │ (CPU/Memory)│         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Deployment Flow                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ Terraform   │    │ AWS         │    │ Application │         │
│  │ Modules     │───▶│ Resources   │───▶│ Deployment  │         │
│  │ (Infra)     │    │ (VPC/ECS)   │    │ (Docker)    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ ECR         │    │ ECS         │    │ Load        │         │
│  │ Push Image  │───▶│ Deploy      │───▶│ Balancer    │         │
│  │ (Docker)    │    │ Service     │    │ (ALB)       │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Environment Separation

```
┌─────────────────────────────────────────────────────────────────┐
│                    Environment Structure                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ Development │    │ Staging     │    │ Production  │         │
│  │ Environment │    │ Environment │    │ Environment │         │
│  │ (Current)   │    │ (Future)    │    │ (Future)    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  • Single AZ      • Multi AZ       • Multi AZ                  │
│  • Small Instances• Medium Inst.   • Large Instances           │
│  • No NAT Gateway • NAT Gateway    • NAT Gateway               │
│  • Local Backend  • S3 Backend     • S3 Backend                │
│  • Cost: ~$40/mo  • Cost: ~$80/mo  • Cost: ~$150/mo            │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

### ✅ **High Availability**
- Auto Scaling Group for ECS instances
- Load balancer with health checks
- Single AZ for development (cost optimization)

### ✅ **Security**
- Private subnets for application and database
- Security groups with least privilege access
- Encryption at rest for RDS and ECR
- VPC isolation

### ✅ **Scalability**
- Auto scaling based on demand
- Load balancer for traffic distribution
- Modular Terraform configuration

### ✅ **Monitoring**
- CloudWatch logging for ECS services
- Container insights enabled
- Health checks and metrics

### ✅ **Cost Optimization**
- Single AZ deployment (saves ~$15/month)
- No NAT Gateway (saves ~$45/month)
- Burstable instance types (t3/t4g)
- ECR lifecycle policies
- Efficient storage configuration

## Current Configuration Details

### **VPC Configuration**
```
VPC CIDR: 10.0.0.0/26 (64 IPs)
Region: ap-northeast-1
AZ: ap-northeast-1a (single AZ)
```

### **Subnet Configuration**
```
Public Subnet: 10.0.0.0/27 (32 IPs) - ALB
Private Subnet: 10.0.0.32/28 (16 IPs) - ECS
Database Subnet: 10.0.0.48/28 (16 IPs) - RDS
```

### **Instance Types**
```
ECS Instance: t3.small
RDS Instance: db.t4g.micro
```

### **Estimated Monthly Cost**
```
ECS Instance: $15.00
RDS PostgreSQL: $8.00
ALB: $16.00
Other services: $0.60
Total: ~$39.60/month
```

## Future Scaling Path

### **Development → Staging**
- Add second AZ
- Enable NAT Gateway
- Upgrade instance types
- Estimated cost: ~$80/month

### **Staging → Production**
- Multi-AZ deployment
- Larger instance types
- Enhanced monitoring
- Estimated cost: ~$150/month

---

*This architecture provides a cost-optimized foundation for the MAPAPP application in development environment, with clear scaling paths for future environments.* 