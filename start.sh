#!/bin/bash

if [ ! -d "node_modules" ]; then
    echo "First run - installing dependencies..."
    if ! npm install --silent; then
        echo "Failed to install dependencies."
        exit 1
    fi
fi

npm run dev
