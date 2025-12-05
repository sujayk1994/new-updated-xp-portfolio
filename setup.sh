#!/bin/bash

echo "Setting up Windows XP Portfolio..."

npm install

if [ $? -eq 0 ]; then
    if [ -n "$DATABASE_URL" ]; then
        echo "Setting up database..."
        node scripts/setup-db.js
    fi
    echo ""
    echo "Setup complete! Run ./init.sh to start."
else
    echo "Setup failed."
    exit 1
fi
