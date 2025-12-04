#!/bin/bash

echo "================================"
echo "  Windows XP Simulator Setup"
echo "================================"
echo ""

echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "================================"
    echo "  Setup completed successfully!"
    echo "================================"
    echo ""
    echo "To start the app, run:"
    echo "  npm run dev"
    echo ""
    echo "Or use the start script:"
    echo "  ./start.sh"
    echo ""
else
    echo ""
    echo "Setup failed. Please check the errors above."
    exit 1
fi
