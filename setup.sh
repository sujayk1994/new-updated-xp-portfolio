#!/bin/bash

echo "Setting up Windows XP Portfolio..."

if ! npm install; then
    echo "Failed to install dependencies."
    exit 1
fi

if [ -n "$DATABASE_URL" ]; then
    echo "Setting up database..."
    if ! node scripts/setup-db.js; then
        echo "Warning: Database setup had issues."
    fi
fi

echo ""
echo "Setup complete! Run ./init.sh to start."
