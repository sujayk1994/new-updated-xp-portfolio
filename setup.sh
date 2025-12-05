#!/bin/bash

echo "========================================"
echo "  Windows XP Portfolio Setup"
echo "========================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}Dependencies installed successfully!${NC}"
    echo ""
    
    if [ -n "$DATABASE_URL" ]; then
        echo "Setting up database..."
        node scripts/setup-db.js
        echo ""
    else
        echo -e "${YELLOW}No DATABASE_URL found. Skipping database setup.${NC}"
        echo ""
    fi
    
    echo "========================================"
    echo -e "${GREEN}  Setup completed successfully!${NC}"
    echo "========================================"
    echo ""
    echo "To start the app, run one of these:"
    echo "  ./init.sh    - Full initialization + start"
    echo "  ./start.sh   - Quick start"
    echo "  npm run dev  - Direct npm start"
    echo ""
else
    echo ""
    echo -e "${RED}Setup failed. Please check the errors above.${NC}"
    exit 1
fi
