#!/bin/bash
set -e

echo "Updating system and installing gnupg, curl, openjdk-21-jre..."
sudo apt-get update
sudo apt-get install -y curl gnupg openjdk-21-jre fontconfig

echo "Setting up Jenkins GPG key (Binary format)..."
# Remove any existing keys to be safe
sudo rm -f /usr/share/keyrings/jenkins.gpg
sudo rm -f /etc/apt/sources.list.d/jenkins.list

# Download armored key and convert to binary GPG
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | gpg --dearmor | sudo tee /usr/share/keyrings/jenkins.gpg > /dev/null

echo "Adding Jenkins repository..."
echo "deb [signed-by=/usr/share/keyrings/jenkins.gpg] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

echo "Final apt update..."
sudo apt-get update

echo "Installing Jenkins..."
sudo apt-get install -y jenkins

echo "Configuring Jenkins to run on port 8081..."
sudo sed -i 's/HTTP_PORT=8080/HTTP_PORT=8081/g' /etc/default/jenkins

echo "Start/Enable Jenkins..."
sudo systemctl enable jenkins
sudo systemctl start jenkins

echo "Firewall port 8081..."
sudo ufw allow 8081/tcp || true

echo "==================================="
echo "Jenkins installed successfully."
echo "Initial Password:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword || echo "Check manually in a minute."
echo "==================================="
