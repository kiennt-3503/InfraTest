#!/bin/bash

# NAT Instance Connection Helper Script
# Usage: ./connect-nat.sh [adminer|session]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Change to terraform directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/environments/dev"

echo -e "${BLUE}🔧 Connecting to NAT Instance...${NC}"

# Check if terraform directory exists
if [ ! -d "$TERRAFORM_DIR" ]; then
    echo -e "${RED}❌ Error: Terraform directory not found at $TERRAFORM_DIR${NC}"
    exit 1
fi

cd "$TERRAFORM_DIR"

# Check if terraform is initialized
if [ ! -d ".terraform" ]; then
    echo -e "${RED}❌ Error: Terraform not initialized. Run 'terraform init' first.${NC}"
    exit 1
fi

# Get instance ID and region
echo -e "${YELLOW}📡 Getting NAT instance information...${NC}"
INSTANCE_ID=$(terraform output -raw nat_instance_id 2>/dev/null)
REGION=$(terraform output -raw region 2>/dev/null || echo "ap-northeast-1")

if [ -z "$INSTANCE_ID" ]; then
    echo -e "${RED}❌ Error: Could not get NAT instance ID. Make sure infrastructure is deployed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found NAT Instance: ${INSTANCE_ID}${NC}"
echo -e "${GREEN}✅ Region: ${REGION}${NC}"

# Check Session Manager plugin
if ! command -v session-manager-plugin &> /dev/null; then
    echo -e "${RED}❌ Error: AWS Session Manager plugin not found.${NC}"
    echo -e "${YELLOW}📋 Install instructions:${NC}"
    echo "macOS: curl https://s3.amazonaws.com/session-manager-downloads/plugin/latest/mac/sessionmanager-bundle.zip -o sessionmanager-bundle.zip && unzip sessionmanager-bundle.zip && sudo ./sessionmanager-bundle/install -i /usr/local/sessionmanagerplugin -b /usr/local/bin/session-manager-plugin"
    echo "Linux: curl https://s3.amazonaws.com/session-manager-downloads/plugin/latest/linux_64bit/session-manager-plugin.rpm -o session-manager-plugin.rpm && sudo yum install -y session-manager-plugin.rpm"
    exit 1
fi

# Determine connection type
CONNECTION_TYPE=${1:-session}

case "$CONNECTION_TYPE" in
    "adminer")
        echo -e "${BLUE}🌐 Starting Adminer port forwarding...${NC}"
        echo -e "${YELLOW}📋 After connection, access Adminer at: http://localhost:8080${NC}"
        echo -e "${YELLOW}📋 Database connection info:${NC}"
        terraform output database_connection_info
        echo -e "${YELLOW}📋 Press Ctrl+C to stop port forwarding${NC}"
        echo ""
        
        aws ssm start-session \
            --target "$INSTANCE_ID" \
            --document-name AWS-StartPortForwardingSession \
            --parameters '{"portNumber":["8080"],"localPortNumber":["8080"]}' \
            --region "$REGION"
        ;;
    "session"|*)
        echo -e "${BLUE}💻 Starting SSH session via Session Manager...${NC}"
        echo -e "${YELLOW}📋 Commands you might find useful:${NC}"
        echo "  - Check Docker status: sudo docker ps"
        echo "  - Check Adminer: sudo docker logs adminer"
        echo "  - Check NAT status: cat /proc/sys/net/ipv4/ip_forward"
        echo "  - Check iptables: sudo iptables -t nat -L"
        echo "  - View setup logs: sudo tail -f /var/log/setup.log"
        echo ""
        
        aws ssm start-session \
            --target "$INSTANCE_ID" \
            --region "$REGION"
        ;;
esac
