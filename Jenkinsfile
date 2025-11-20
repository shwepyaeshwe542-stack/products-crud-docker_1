pipeline {
    agent any
    
    environment {
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
        
        stage('Environment Check') {
            steps {
                echo '🔍 Checking environment...'
                sh '''
                    echo "Docker version:"
                    docker --version
                    echo "Docker Compose version:"
                    docker compose version
                    echo "Current directory:"
                    pwd
                    echo "Files in directory:"
                    ls -la
                '''
            }
        }
        
        stage('Stop Old Containers') {
            steps {
                echo '🛑 Stopping old containers and cleaning up...'
                sh '''
                    # Stop all compose projects and remove volumes
                    docker compose -f ${DOCKER_COMPOSE_FILE} down -v || true
                    
                    # Force remove any containers with these names
                    docker rm -f products_db products_backend products_frontend || true
                    
                    # Remove any orphaned containers
                    docker container prune -f || true
                    
                    # Remove unused networks
                    docker network prune -f || true
                    
                    # Remove dangling volumes
                    docker volume prune -f || true
                '''
            }
        }
        
        stage('Build') {
            steps {
                echo '🔨 Building Docker images...'
                sh '''
                    docker compose -f ${DOCKER_COMPOSE_FILE} build --no-cache
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 Deploying with Docker Compose...'
                sh '''
                    docker compose -f ${DOCKER_COMPOSE_FILE} up -d
                '''
            }
        }
        
        stage('Wait for Services') {
            steps {
                echo '⏳ Waiting for services to be ready...'
                sh '''
                    echo "Waiting 30 seconds for services to start..."
                    sleep 30
                '''
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
                sh '''
                    docker compose -f ${DOCKER_COMPOSE_FILE} ps
                    docker compose -f ${DOCKER_COMPOSE_FILE} logs backend --tail=20
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo '🌐 Application URLs:'
            echo '   Frontend: http://localhost:3000/products'
            echo '   Backend API: http://localhost:4000/api/products'
        }
        failure {
            echo '❌ Pipeline failed!'
            sh '''
                echo "Container logs:"
                docker compose -f ${DOCKER_COMPOSE_FILE} logs --tail=50
            '''
        }
        always {
            echo '🧹 Cleaning up dangling images...'
            sh '''
                docker image prune -f || true
            '''
        }
    }
}