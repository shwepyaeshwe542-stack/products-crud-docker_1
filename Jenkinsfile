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
                sh 'cp .env.example .env'
                // Use single quotes for sed command to prevent Jenkins Groovy interpolation
                sh "sed -i 's/your_password_here/postgres123/g' .env"
            }
        }
        
        stage('Stop Old Containers') {
            steps {
                echo '🛑 Stopping and aggressively removing old containers to prevent conflicts...'
                sh "docker compose -f ${DOCKER_COMPOSE_FILE} down || true"
                
                // --- FIX: AGGRESSIVELY REMOVE ALL POTENTIAL CONFLICTING CONTAINERS ---
                // This ensures removal of containers created by the current Docker Compose project 
                // AND containers created with simple names (e.g., from old 'docker run' commands or older compose setups).
                sh '''
                    docker rm -f \
                    ${COMPOSE_PROJECT_NAME}_db \
                    ${COMPOSE_PROJECT_NAME}_backend \
                    ${COMPOSE_PROJECT_NAME}_frontend \
                    products_db \
                    products_backend \
                    products_frontend \
                    || true
                '''
                
                // Clean up network residue
                sh "docker network rm ${COMPOSE_PROJECT_NAME}_default || true"
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
                sh 'chmod +x health-check.sh'
                sh './health-check.sh'
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
            sh "docker compose -f ${DOCKER_COMPOSE_FILE} logs --tail=50 || true"
        }
        always {
            echo '🧹 Cleaning up old Docker build cache...'
            // Clean up unused images/data to save space
            sh "docker system prune -f || true"
        }
    }
}