#!/bin/bash

# Docker Installation Script for Ubuntu
echo "Starting Docker installation..."

# Add Docker's official GPG key:
echo "Step 1: Updating package index and installing prerequisites..."
sudo apt update
sudo apt install -y ca-certificates curl

echo "Step 2: Setting up Docker's GPG key..."
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo "Step 3: Adding Docker repository..."
echo "Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc" | sudo tee /etc/apt/sources.list.d/docker.sources > /dev/null

echo "Step 4: Updating package index with Docker repository..."
sudo apt update

echo "Step 5: Installing Docker packages..."
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "Step 6: Starting and enabling Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

echo "Step 7: Verifying Docker installation..."
sudo systemctl status docker --no-pager

echo "Step 8: Running hello-world container to test installation..."
sudo docker run hello-world

echo "Docker installation completed successfully!"
echo "You can now use Docker commands. To run Docker without sudo, add your user to the docker group:"
echo "  sudo usermod -aG docker \$USER"
echo "Then log out and log back in for the changes to take effect."
