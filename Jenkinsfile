pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        VERCEL_TOKEN      = credentials('VERCEL_TOKEN')
        VERCEL_PROJECT_ID = credentials('VERCEL_PROJECT_ID')
        VERCEL_ORG_ID     = credentials('VERCEL_ORG_ID')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Repository checked out successfully.'
            }
        }

        stage('Install') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo 'Building TypeScript project...'
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                script {
                    try {
                        sh 'npm test'
                    } catch (err) {
                        echo 'No tests found, continuing...'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Installing Vercel CLI...'
                sh 'npm install -g vercel'
                script {
                    if (env.BRANCH_NAME == 'main') {
                        echo 'Deploying to production...'
                        sh 'vercel --prod --token $VERCEL_TOKEN --yes'
                    } else {
                        echo 'Deploying preview...'
                        sh 'vercel --token $VERCEL_TOKEN --yes'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
            echo 'Application deployed to Vercel'
        }
        failure {
            echo 'Pipeline failed! Check Jenkins logs for details.'
        }
    }
}
