#!/bin/bash

echo "================================"
echo "  Windows XP Simulator"
echo "  One-Command Initialize & Run"
echo "================================"
echo ""

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "Failed to install dependencies."
        exit 1
    fi
    echo ""
fi

echo "Starting development server on port 5000..."
echo ""
npm run dev
