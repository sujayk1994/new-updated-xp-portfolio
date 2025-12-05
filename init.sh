#!/bin/bash

echo "========================================"
echo "  Windows XP Portfolio Simulator"
echo "  with Stube Video Interface"
echo "========================================"
echo ""
echo "One-Command Initialize & Run Script"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

download_lfs_files() {
    REPO="sujayk1994/new-updated-xp-portfolio"
    BRANCH="main"
    BASE_URL="https://media.githubusercontent.com/media/${REPO}/${BRANCH}"
    
    LFS_FILES=$(find static -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.gif" -o -name "*.mp3" -o -name "*.mp4" -o -name "*.pdf" -o -name "*.zip" -o -name "*.wasm" \) -size -200c 2>/dev/null)
    
    if [ -n "$LFS_FILES" ]; then
        echo -e "${YELLOW}Downloading media files from repository...${NC}"
        count=0
        total=$(echo "$LFS_FILES" | wc -l)
        
        while IFS= read -r file; do
            if [ -n "$file" ]; then
                url="${BASE_URL}/${file}"
                curl -sL "$url" -o "$file" &
                count=$((count + 1))
                
                if (( count % 10 == 0 )); then
                    wait
                    echo "  Downloaded $count/$total files..."
                fi
            fi
        done <<< "$LFS_FILES"
        
        wait
        echo -e "${GREEN}  Downloaded all $total media files.${NC}"
        echo ""
    fi
}

setup_database() {
    echo "----------------------------------------"
    echo "Database Setup"
    echo "----------------------------------------"
    
    if [ -n "$DATABASE_URL" ]; then
        echo -e "${GREEN}DATABASE_URL found. Setting up database...${NC}"
        node scripts/setup-db.js
        if [ $? -ne 0 ]; then
            echo -e "${YELLOW}Warning: Database setup encountered issues.${NC}"
            echo "The app will still run but some features may be limited."
        fi
    else
        echo -e "${YELLOW}No DATABASE_URL found.${NC}"
        echo "To enable admin features, set DATABASE_URL environment variable."
        echo "The app will run with limited functionality."
    fi
    echo ""
}

check_environment() {
    echo "----------------------------------------"
    echo "Environment Check"
    echo "----------------------------------------"
    
    if [ -n "$DATABASE_URL" ]; then
        echo -e "  Database:       ${GREEN}Configured${NC}"
    else
        echo -e "  Database:       ${YELLOW}Not configured${NC}"
    fi
    
    if [ -n "$ADMIN_PASSWORD" ]; then
        echo -e "  Admin User:     ${GREEN}Will be created${NC}"
    else
        echo -e "  Admin User:     ${YELLOW}Not configured (set ADMIN_PASSWORD)${NC}"
    fi
    
    if [ -n "$JWT_SECRET" ]; then
        echo -e "  JWT Secret:     ${GREEN}Configured${NC}"
    else
        echo -e "  JWT Secret:     ${YELLOW}Using default (set JWT_SECRET for production)${NC}"
    fi
    
    echo ""
}

install_dependencies() {
    echo "----------------------------------------"
    echo "Installing Dependencies"
    echo "----------------------------------------"
    
    if [ ! -d "node_modules" ]; then
        echo "Installing npm packages..."
        npm install
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to install dependencies.${NC}"
            exit 1
        fi
        echo -e "${GREEN}Dependencies installed successfully.${NC}"
    else
        echo "Dependencies already installed. Checking for updates..."
        npm install --prefer-offline
    fi
    echo ""
}

check_lfs_files() {
    lfs_count=$(find static -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.gif" -o -name "*.mp3" -o -name "*.mp4" -o -name "*.pdf" -o -name "*.zip" -o -name "*.wasm" \) -size -200c 2>/dev/null | wc -l)
    if [ "$lfs_count" -gt 0 ]; then
        echo "----------------------------------------"
        echo "Media Files"
        echo "----------------------------------------"
        echo "Found $lfs_count Git LFS placeholder files that need downloading..."
        download_lfs_files
    fi
}

start_server() {
    echo "========================================"
    echo -e "${GREEN}Starting Development Server${NC}"
    echo "========================================"
    echo ""
    echo "Server will be available at: http://localhost:5000"
    echo ""
    echo "Features:"
    echo "  - Windows XP Desktop Simulator"
    echo "  - Stube Video Portfolio (in Internet Explorer)"
    echo "  - About Me Profile"
    echo "  - Admin Panel (if database configured)"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "----------------------------------------"
    echo ""
    
    npm run dev
}

check_environment
install_dependencies
check_lfs_files
setup_database
start_server
