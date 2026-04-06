# AWS EC2 & Jenkins CI/CD Setup Guide

This guide covers everything you need to know about managing your Jenkins server on AWS EC2, including what to do when you stop and restart your instance.

## ⚠️ Important Note: AWS EC2 Dynamic IPs
When you **STOP** and **START** an AWS EC2 instance, its Public IP Address changes (unless you are using an Elastic IP). 
Your current IP is `16.170.246.169`, but this will change upon restart.

---

## 1️⃣ Connecting via SSH to your Server
Whenever you need to log in to the server or run commands manually, use the following:

```powershell
# Open Windows Terminal / PowerShell and run:
ssh -i "C:\Users\Vishal priyan s\Desktop\full\SSH-KEY.pem" ubuntu@<NEW_EC2_PUBLIC_IP>
```
*(Replace `<NEW_EC2_PUBLIC_IP>` with the current IP from your AWS Console).*

---

## 2️⃣ What to do after Restarting the EC2 Instance

Because the Public IP changes when you restart the instance, you must update the IP in three places:

### A. Your SSH Command
Use the new IP to SSH into your server (as shown above).

### B. Jenkins Web UI Access
You will now access Jenkins at:
`http://<NEW_EC2_PUBLIC_IP>:8080`

### C. GitHub Webhooks (Crucial for CI/CD)
Since GitHub needs to know where to send push notifications to trigger your pipeline, you MUST update the webhook URL.
1. Go to your GitHub Repository -> **Settings** -> **Webhooks**.
2. Click **Edit** next to the existing webhook.
3. Update the Payload URL to: `http://<NEW_EC2_PUBLIC_IP>:8080/github-webhook/`
4. Save the webhook.

---

## 3️⃣ Starting & Stopping Jenkins Service

Jenkins is configured to start automatically when the server boots up. However, if it crashes or you need to restart it manually, use these commands via SSH:

```bash
# Check Jenkins status
sudo systemctl status jenkins

# Start Jenkins
sudo systemctl start jenkins

# Restart Jenkins
sudo systemctl restart jenkins

# Stop Jenkins
sudo systemctl stop jenkins
```

---

## 4️⃣ Running the Application (Crave Cookie Website)

Your application is deployed to `/home/ubuntu/crave-app` by the Jenkins pipeline.

If you are running a Node.js/React/Vite app and need a process manager so it stays alive after SSH disconnects, install **PM2**:
```bash
# Install PM2 (if not installed)
sudo npm install -g pm2

# Navigate to app directory
cd /home/ubuntu/crave-app

# Build the project (if needed)
npm install
npm run build

# Start the app with PM2
pm2 start npm --name "crave-app" -- run dev

# To ensure PM2 starts on reboot:
pm2 startup systemd
pm2 save
```

If it's a Vita app without a backend server, you might want to serve the `dist` folder:
```bash
sudo npm install -g serve
pm2 start serve --name "crave-app" -- -s dist -l 3000
```

---

## 5️⃣ Common Troubleshooting Commands

**Jenkins Initial Admin Password:**
If you ever need the initial setup password for Jenkins again:
```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

**Check Application Port (e.g., Port 3000):**
```bash
sudo ss -tlpn | grep 3000
```

**Check Firewall (UFW) Status:**
Jenkins uses port 8080. If it's blocked, allow it:
```bash
sudo ufw allow 8080/tcp
sudo ufw status
```

**Jenkins Logs:**
If Jenkins fails to start, check the logs:
```bash
sudo journalctl -u jenkins -n 50 --no-pager
```
---
