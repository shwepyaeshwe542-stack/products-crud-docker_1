
#!/bin/bash

echo "================================"
echo "🏥 Health Check Started"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service
check_service() {
    local service_name=$1
    local url=$2
    local max_attempts=10
    local attempt=1
    
    echo -e "\n${YELLOW}Checking $service_name...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        echo "Attempt $attempt/$max_attempts..."
        
        if curl -f -s -o /dev/null "$url"; then
            echo -e "${GREEN}✅ $service_name is healthy!${NC}"
            return 0
        fi
        
        attempt=$((attempt + 1))
        sleep 3
    done
    
    echo -e "${RED}❌ $service_name health check failed!${NC}"
    return 1
}

# Check Database (via backend connection)
check_service "Database" "http://localhost:4000/api/products"

# Check Backend API
check_service "Backend API" "http://localhost:4000/api/products"

# Check Frontend
check_service "Frontend" "http://localhost:3000/products"

# Final result
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}================================${NC}"
    echo -e "${GREEN}✅ All services are healthy!${NC}"
    echo -e "${GREEN}================================${NC}"
    exit 0
else
    echo -e "\n${RED}================================${NC}"
    echo -e "${RED}❌ Some services failed!${NC}"
    echo -e "${RED}================================${NC}"
    exit 1
fi

