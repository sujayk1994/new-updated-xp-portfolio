#!/bin/bash

echo "========================================"
echo "  Starting Windows XP Portfolio"
echo "========================================"
echo ""

if [ ! -d "node_modules" ]; then
    echo "Dependencies not found. Running setup first..."
    ./setup.sh
    if [ $? -ne 0 ]; then
        echo "Setup failed. Cannot start."
        exit 1
    fi
    echo ""
fi

echo "Starting development server on port 5000..."
echo ""
npm run dev
