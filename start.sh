#!/bin/bash

if [ ! -d "node_modules" ]; then
    echo "First run - installing dependencies..."
    npm install --silent
fi

npm run dev
