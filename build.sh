#!/bin/bash

set -e

echo "========================================"
echo "  Windows XP Portfolio - Build"
echo "========================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

show_help() {
    echo "Usage: ./build.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  app        Build the SvelteKit application"
    echo "  docker     Build Docker image only"
    echo "  all        Build app and Docker image"
    echo "  help       Show this help message"
    echo ""
}

build_app() {
    echo "Building SvelteKit application..."
    
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    npm run build
    
    echo -e "${GREEN}Application build complete!${NC}"
    echo "Output: ./build"
}

build_docker() {
    echo "Building Docker image..."
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Docker is not installed.${NC}"
        exit 1
    fi
    
    docker build -t winxp-portfolio:latest .
    
    echo -e "${GREEN}Docker image built: winxp-portfolio:latest${NC}"
    echo ""
    echo "Run with:"
    echo "  docker run -d -p 5000:5000 \\"
    echo "    -e DATABASE_URL=\"your-postgres-url\" \\"
    echo "    -e ADMIN_PASSWORD=\"your-password\" \\"
    echo "    winxp-portfolio:latest"
}

case "${1:-help}" in
    app)
        build_app
        ;;
    docker)
        build_docker
        ;;
    all)
        build_app
        build_docker
        ;;
    help|*)
        show_help
        ;;
esac
