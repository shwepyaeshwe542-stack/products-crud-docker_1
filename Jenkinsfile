pipeline {
    agent any
    
    environment {
        // Keeps the project name consistent across runs
        COMPOSE_PROJECT_NAME = 'products-crud'
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code from repository...'
                checkout scm
            }
        }

        stage('Prepare Environment') {
            steps {
                echo '📝 Creating .env file from .env.example and setting password...'
                sh '''
                    # 1. Copy the example file to the active .env file
                    cp .env.example .env
                    
                    # 2. IMPORTANT: Use sed to replace the placeholder password with the actual password expected by docker-compose.yml
                    # We use 'postgres123' here based on your previous input.
                    sed -i 's/your_password_here/postgres123/g' .env 
                '''
            }
        }
        
        stage('Stop Old Containers') {
            steps {
                echo '🛑 Stopping and aggressively removing old containers to prevent conflicts...'
                sh '''
                    # 1. Stop and remove services defined in docker-compose.yml
                    docker compose -f ${DOCKER_COMPOSE_FILE} down || true
                    
                    # 2. Forcefully remove old containers and network remnants by their derived names (critical fix)
                    # The '|| true' ensures the pipeline doesn't fail if the containers don't exist yet.
                    docker rm -f ${COMPOSE_PROJECT_NAME}_db || true
                    docker rm -f ${COMPOSE_PROJECT_NAME}_backend || true
                    docker rm -f ${COMPOSE_PROJECT_NAME}_frontend || true
                    docker network rm ${COMPOSE_PROJECT_NAME}_default || true
                '''
            }
        }
        
        stage('Build') {
            steps {
                echo '🔨 Building Docker images (using latest code and Dockerfile fixes)...'
                // --no-cache ensures we rebuild with the latest code/Dockerfile fixes
                sh "docker compose -f ${DOCKER_COMPOSE_FILE} build --no-cache"
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 Deploying with Docker Compose...'
                sh "docker compose -f ${DOCKER_COMPOSE_FILE} up -d"
            }
        }
        
        stage('Wait for Services') {
            steps {
                echo '⏳ Waiting 30 seconds for services to be ready (database, migration, and seeding require time)...'
                sleep 30 
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Running health checks...'
                sh '''
                    chmod +x health-check.sh
                    ./health-check.sh
                '''
            }
        }
        
        stage('Show Container Status') {
            steps {
                echo '📊 Container status:'
                sh "docker compose -f ${DOCKER_COMPOSE_FILE} ps"
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Review logs below.'
            sh "docker compose -f ${DOCKER_COMPOSE_FILE} logs --tail=50"
        }
        always {
            echo '🧹 Cleaning up old Docker build cache...'
            // Clean up unused images/data to save space
            sh "docker system prune -f || true"
        }
    }
}