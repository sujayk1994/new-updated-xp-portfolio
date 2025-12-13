#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "========================================"
echo "  Setting up Windows XP Portfolio"
echo "========================================"
echo ""

echo -e "${BLUE}Required Environment Variables:${NC}"
echo "  DATABASE_URL     - PostgreSQL connection string"
echo "  JWT_SECRET       - Secret for JWT tokens (generate with: openssl rand -hex 32)"
echo ""
echo -e "${BLUE}Optional Environment Variables:${NC}"
echo "  ADMIN_PASSWORD   - Password for admin account"
echo "  ADMIN_USERNAME   - Admin username (default: admin)"
echo "  RESEND_API_KEY   - Resend.com API key for contact form emails"
echo "  RESEND_FROM_EMAIL - Verified sender email (e.g., contact@yourdomain.com)"
echo ""

echo "Installing dependencies..."
if ! npm install; then
    echo -e "${RED}Failed to install dependencies.${NC}"
    exit 1
fi
echo -e "${GREEN}Dependencies installed.${NC}"

if [ -n "$DATABASE_URL" ]; then
    echo ""
    echo "Setting up database..."
    if node scripts/setup-db.js; then
        echo -e "${GREEN}Database setup complete.${NC}"
    else
        echo -e "${YELLOW}Warning: Database setup had issues.${NC}"
    fi
else
    echo ""
    echo -e "${YELLOW}DATABASE_URL not set. Skipping database setup.${NC}"
    echo "Set DATABASE_URL and run: node scripts/setup-db.js"
fi

echo ""
echo -e "${GREEN}Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Set required environment variables (see above)"
echo "  2. Run ./init.sh to start the development server"
echo "  3. Or run: npm run build && node build/index.js for production"
