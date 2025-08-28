#!/bin/bash

# CaseClerk AI - Production Deployment Script
set -e

echo "🚀 Starting CaseClerk AI deployment..."

# Configuration
PROJECT_NAME="caseclerk-ai"
DEPLOY_USER="deploy"
DEPLOY_HOST="caseclerk.ai"
DEPLOY_PATH="/var/www/caseclerk-ai"
BACKUP_PATH="/var/backups/caseclerk-ai"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if required commands exist
    command -v docker >/dev/null 2>&1 || { log_error "Docker is required but not installed."; exit 1; }
    command -v docker-compose >/dev/null 2>&1 || { log_error "Docker Compose is required but not installed."; exit 1; }
    command -v pm2 >/dev/null 2>&1 || { log_error "PM2 is required but not installed."; exit 1; }
    
    # Check environment variables
    if [ -z "$JWT_SECRET" ]; then
        log_error "JWT_SECRET environment variable is required"
        exit 1
    fi
    
    if [ -z "$BASE44_API_KEY" ]; then
        log_error "BASE44_API_KEY environment variable is required"
        exit 1
    fi
    
    log_info "Prerequisites check passed ✓"
}

# Create backup
create_backup() {
    log_info "Creating backup..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_DIR="$BACKUP_PATH/$TIMESTAMP"
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup current deployment
    if [ -d "$DEPLOY_PATH" ]; then
        cp -r "$DEPLOY_PATH" "$BACKUP_DIR/app"
        log_info "Application backup created: $BACKUP_DIR/app"
    fi
    
    # Backup database (if using local database)
    if [ "$USE_LOCAL_DB" = "true" ]; then
        docker exec caseclerk-postgres pg_dump -U caseclerk caseclerk_ai > "$BACKUP_DIR/database.sql"
        log_info "Database backup created: $BACKUP_DIR/database.sql"
    fi
    
    # Keep only last 5 backups
    cd "$BACKUP_PATH"
    ls -t | tail -n +6 | xargs -r rm -rf
    
    log_info "Backup completed ✓"
}

# Build application
build_application() {
    log_info "Building application..."
    
    # Install dependencies
    npm run install:all
    
    # Build frontend
    log_info "Building frontend..."
    cd frontend
    npm run build
    cd ..
    
    # Build backend
    log_info "Building backend..."
    cd backend
    npm run build
    cd ..
    
    # Build electron (optional)
    if [ "$BUILD_ELECTRON" = "true" ]; then
        log_info "Building electron app..."
        cd electron
        npm run build
        cd ..
    fi
    
    log_info "Build completed ✓"
}

# Deploy with Docker
deploy_docker() {
    log_info "Deploying with Docker..."
    
    # Stop existing containers
    docker-compose down
    
    # Build and start new containers
    docker-compose build --no-cache
    docker-compose up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to start..."
    sleep 30
    
    # Health check
    if curl -f http://localhost/health > /dev/null 2>&1; then
        log_info "Health check passed ✓"
    else
        log_error "Health check failed"
        exit 1
    fi
    
    log_info "Docker deployment completed ✓"
}

# Deploy with PM2
deploy_pm2() {
    log_info "Deploying with PM2..."
    
    # Stop existing processes
    pm2 stop all || true
    pm2 delete all || true
    
    # Start new processes
    pm2 start deployment/pm2.config.js --env production
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
    log_info "PM2 deployment completed ✓"
}

# Setup SSL certificates
setup_ssl() {
    log_info "Setting up SSL certificates..."
    
    if [ "$USE_LETSENCRYPT" = "true" ]; then
        # Use Let's Encrypt
        certbot --nginx -d caseclerk.ai -d www.caseclerk.ai --non-interactive --agree-tos --email admin@caseclerk.ai
    else
        # Use provided certificates
        if [ -f "deployment/ssl/caseclerk.ai.crt" ] && [ -f "deployment/ssl/caseclerk.ai.key" ]; then
            log_info "Using provided SSL certificates"
        else
            log_warn "No SSL certificates found. HTTPS will not be available."
        fi
    fi
    
    log_info "SSL setup completed ✓"
}

# Post-deployment tasks
post_deployment() {
    log_info "Running post-deployment tasks..."
    
    # Clear caches
    if command -v redis-cli >/dev/null 2>&1; then
        redis-cli FLUSHALL
        log_info "Redis cache cleared"
    fi
    
    # Restart nginx
    if command -v nginx >/dev/null 2>&1; then
        nginx -t && nginx -s reload
        log_info "Nginx reloaded"
    fi
    
    # Send deployment notification (optional)
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"🚀 CaseClerk AI deployed successfully to production"}' \
            "$SLACK_WEBHOOK"
    fi
    
    log_info "Post-deployment tasks completed ✓"
}

# Main deployment flow
main() {
    log_info "Starting deployment process..."
    
    check_prerequisites
    create_backup
    build_application
    
    # Choose deployment method
    if [ "$DEPLOY_METHOD" = "docker" ]; then
        deploy_docker
    else
        deploy_pm2
    fi
    
    setup_ssl
    post_deployment
    
    log_info "🎉 Deployment completed successfully!"
    log_info "Application is now available at: https://caseclerk.ai"
}

# Handle script arguments
case "${1:-}" in
    "docker")
        export DEPLOY_METHOD="docker"
        ;;
    "pm2")
        export DEPLOY_METHOD="pm2"
        ;;
    "")
        export DEPLOY_METHOD="pm2"  # Default
        ;;
    *)
        echo "Usage: $0 [docker|pm2]"
        exit 1
        ;;
esac

# Run main function
main