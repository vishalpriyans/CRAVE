#!/bin/bash
set -e

VM_IP="16.170.163.247"
SSH_USER="ubuntu"
SSH_KEY="SSH-KEY.pem"

echo "Deploying Jenkins to VM at $VM_IP on port 8081..."

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo "Error: SSH key file $SSH_KEY not found!"
    exit 1
fi

# Set proper permissions for SSH key
chmod 400 "$SSH_KEY"

# Test SSH connection
echo "Testing SSH connection to $VM_IP..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@$VM_IP" "echo 'SSH connection successful'"

# Copy installation script to VM
echo "Copying Jenkins installation script to VM..."
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no install_jenkins.sh "$SSH_USER@$VM_IP:/tmp/"

# Copy docker-compose file to VM
echo "Copying docker-compose.yml to VM..."
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no docker-compose.yml "$SSH_USER@$VM_IP:/tmp/"

# Install Docker and Docker Compose on VM
echo "Installing Docker and Docker Compose on VM..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@$VM_IP" << 'EOF'
    # Update system
    sudo apt-get update
    
    # Install Docker
    sudo apt-get install -y docker.io docker-compose
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    echo "Docker installation completed"
EOF

# Run Jenkins installation script on VM
echo "Running Jenkins installation on VM..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@$VM_IP" "chmod +x /tmp/install_jenkins.sh && /tmp/install_jenkins.sh"

# Start Jenkins using Docker Compose
echo "Starting Jenkins with Docker Compose..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@$VM_IP" << EOF
    cd /tmp
    docker-compose up -d jenkins
    
    echo "Waiting for Jenkins to start..."
    sleep 30
    
    echo "Checking Jenkins status..."
    docker-compose ps jenkins
    
    echo "Getting Jenkins initial password..."
    docker exec \$(docker ps -q --filter "name=jenkins") cat /var/jenkins_home/secrets/initialAdminPassword || echo "Jenkins container not ready yet, check manually"
EOF

echo "==================================="
echo "Jenkins deployment completed!"
echo "Access Jenkins at: http://$VM_IP:8081"
echo "==================================="
