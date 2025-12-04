All done! I've created the following scripts and configurations for you:

Shell Scripts (run in terminal):

./init.sh - Single command to install dependencies and start the app
./setup.sh - Install dependencies only
./start.sh - Start the app (auto-installs dependencies if needed)
NPM Scripts:

npm run start - Install dependencies and start the dev server in one command
npm run dev - Start the development server
npm run setup - Install dependencies
npm run build - Build for production
npm run prod - Build and run production server
Next time you want to run the app, simply use one of these:

# Option 1: Shell script (recommended)
./init.sh
# Option 2: NPM command
npm run start