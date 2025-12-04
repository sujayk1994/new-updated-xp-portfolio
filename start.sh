#!/bin/bash

echo "Starting Windows XP Simulator..."
echo ""

if [ ! -d "node_modules" ]; then
    echo "Dependencies not found. Running setup first..."
    ./setup.sh
    echo ""
fi

npm run dev
