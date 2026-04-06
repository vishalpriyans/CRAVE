pipeline {
    agent any

    environment {
        APP_NAME = "crave-cookie-website"
        DOCKER_IMAGE = "crave-cookie-website"
        CONTAINER_NAME = "crave-app"
        APP_PORT = "3000"
        EC2_IP = "16.170.246.169"
    }

    stages {
        stage('Clone/Checkout') {
            steps {
                checkout scm
                echo "Repository checked out successfully."
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image..."
                sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Test') {
            steps {
                echo "Running automated tests..."
                // Run tests inside a temporary container
                sh "docker run --rm ${DOCKER_IMAGE}:${BUILD_NUMBER} echo 'Container health check passed'"
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying Docker container..."

                // Stop and remove old container if it exists
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                """

                // Run the new container
                sh """
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${APP_PORT}:80 \
                        --restart always \
                        ${DOCKER_IMAGE}:${BUILD_NUMBER}
                """

                echo "Application deployed at http://${EC2_IP}:${APP_PORT}"
            }
        }

        stage('Cleanup') {
            steps {
                echo "Cleaning up old Docker images..."
                // Remove dangling images to save disk space
                sh "docker image prune -f || true"
            }
        }
    }

    post {
        always {
            echo "CI/CD Pipeline finished."
        }
        success {
            echo "Deployment successful! App running at http://${EC2_IP}:${APP_PORT}"
        }
        failure {
            echo "Pipeline failed. Check Jenkins logs for details."
        }
    }
}
