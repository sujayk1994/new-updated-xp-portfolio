#!/bin/bash

set -e

echo "========================================"
echo "  Windows XP Portfolio - Deploy"
echo "========================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}No .env file found. Creating from template...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}Please edit .env with your configuration before deploying.${NC}"
        echo ""
    fi
fi

show_help() {
    echo "Usage: ./deploy.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  build      Build production assets only"
    echo "  docker     Build and run with Docker Compose"
    echo "  start      Start existing Docker containers"
    echo "  stop       Stop Docker containers"
    echo "  restart    Restart Docker containers"
    echo "  logs       View Docker container logs"
    echo "  clean      Stop and remove containers, volumes"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh docker    # Full Docker deployment"
    echo "  ./deploy.sh build     # Build for manual deployment"
    echo ""
}

build_production() {
    echo "Building production assets..."
    
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    npm run build
    
    echo -e "${GREEN}Build complete!${NC}"
    echo ""
    echo "Production files are in ./build"
    echo "Run with: NODE_ENV=production node build/index.js"
}

docker_deploy() {
    echo "Starting Docker Compose deployment..."
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}Docker Compose is not available. Please install it first.${NC}"
        exit 1
    fi
    
    echo "Building Docker images..."
    docker-compose build
    
    echo "Starting database..."
    docker-compose up -d db
    
    echo ""
    echo "Waiting for database to be ready..."
    sleep 5
    
    echo "Running database setup..."
    docker-compose --profile setup run --rm setup
    
    echo "Starting application..."
    docker-compose up -d app
    
    echo ""
    echo -e "${GREEN}Deployment complete!${NC}"
    echo ""
    echo "Application running at: http://localhost:5000"
    echo ""
    echo "Useful commands:"
    echo "  docker-compose logs -f    # View logs"
    echo "  docker-compose stop       # Stop services"
    echo "  docker-compose down       # Stop and remove containers"
}

docker_start() {
    echo "Starting Docker containers..."
    docker-compose up -d
    echo -e "${GREEN}Services started!${NC}"
    echo "Application at: http://localhost:5000"
}

docker_stop() {
    echo "Stopping Docker containers..."
    docker-compose stop
    echo -e "${GREEN}Services stopped.${NC}"
}

docker_restart() {
    echo "Restarting Docker containers..."
    docker-compose restart
    echo -e "${GREEN}Services restarted!${NC}"
}

docker_logs() {
    docker-compose logs -f
}

docker_clean() {
    echo -e "${YELLOW}This will stop and remove all containers and volumes.${NC}"
    read -p "Are you sure? (y/N) " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        docker-compose down -v
        echo -e "${GREEN}Cleanup complete.${NC}"
    else
        echo "Cancelled."
    fi
}

case "${1:-help}" in
    build)
        build_production
        ;;
    docker)
        docker_deploy
        ;;
    start)
        docker_start
        ;;
    stop)
        docker_stop
        ;;
    restart)
        docker_restart
        ;;
    logs)
        docker_logs
        ;;
    clean)
        docker_clean
        ;;
    help|*)
        show_help
        ;;
esac
