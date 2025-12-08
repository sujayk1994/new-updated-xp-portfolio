# Windows XP Portfolio Simulator

A browser-based Windows XP simulator featuring "Stube" - a custom YouTube-like video portfolio interface, built with SvelteKit and TailwindCSS.

![License MIT](https://badgen.net/badge/license/MIT/green)
[![css tailwind](https://badgen.net/badge/css/tailwind/blue)](https://github.com/tailwindlabs/tailwindcss)
[![js framework svelte](https://badgen.net/badge/built/svelte/orange)](https://github.com/sveltejs/svelte)

## Features

- Fully interactive Windows XP desktop experience
- **Stube Video Portfolio** - YouTube-style video showcase in Internet Explorer
- **Magazine Portfolio** - Flipbook-style magazine viewer
- **Admin Dashboard** - Manage content, videos, and boot screen settings
- **Boot Screen Customization** - Custom boot animations (admin only)
- **About Me** - Editable personal profile page
- Persistent admin content stored in PostgreSQL

## Quick Start

### Option 1: One-Command Setup (Recommended)

```bash
./init.sh
```

This will:
1. Install npm dependencies
2. Download media files (if needed)
3. Set up database tables
4. Create admin user (if ADMIN_PASSWORD is set)
5. Start the development server

### Option 2: Docker Compose (Production)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env

# Build and run
docker-compose up -d
```

### Option 3: Docker Only

```bash
# Build the image
docker build -t winxp-portfolio .

# Run with environment variables
docker run -d \
  -p 5000:5000 \
  -e DATABASE_URL="your-postgres-url" \
  -e ADMIN_PASSWORD="your-admin-password" \
  winxp-portfolio
```

### Option 4: Manual Setup

```bash
# Install dependencies
npm install

# Set up database
node scripts/setup-db.js

# Development
npm run dev

# Production
npm run build
npm run prod
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `ADMIN_PASSWORD` | Password for admin account | Recommended | - |
| `ADMIN_USERNAME` | Admin username | No | `admin` |
| `JWT_SECRET` | Secret for JWT tokens | No | Auto-generated |
| `PORT` | Server port | No | `5000` |
| `NODE_ENV` | Environment mode | No | `development` |

## Deployment Options

### Replit (Recommended for quick deploy)

1. Fork this project on Replit
2. Set environment variables in Secrets tab
3. Click "Run" or use `./init.sh`
4. Click "Deploy" for production

### Docker Compose (Self-hosted)

```bash
# Production deployment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

### Manual Server Deployment

```bash
# Build for production
npm run build

# Start production server
NODE_ENV=production node build/index.js
```

### Cloud Platforms

**Railway/Render/Fly.io:**
1. Connect your repository
2. Set environment variables
3. Deploy automatically on push

## Admin System

### First-Time Setup

1. Navigate to `/admin-login`
2. Create your admin account (username + password, min 6 characters)
3. Log in to access admin features

### Admin Features

- **File Manager** - Create persistent folders and upload files
- **Video Manager** - Add YouTube videos to Stube portfolio
- **About Me Editor** - Edit your personal profile
- **Boot Screen Settings** - Customize the Windows XP boot screen (Start Menu > Admin Tools)
- **Magazine Manager** - Add flipbook magazines to the portfolio

## Project Structure

```
├── src/
│   ├── routes/           # SvelteKit pages and API endpoints
│   │   ├── api/admin/    # Admin API endpoints
│   │   └── xp/           # Windows XP interface components
│   └── lib/              # Shared components and utilities
├── static/               # Static assets (images, fonts, audio, video)
├── scripts/              # Setup and utility scripts
├── build/                # Production build output
├── Dockerfile            # Docker container configuration
├── docker-compose.yml    # Docker orchestration
└── init.sh               # One-command initialization
```

## Database Schema

The application uses PostgreSQL with the following tables:

- `admin_users` - Admin authentication
- `admin_files` - Persistent file storage metadata
- `admin_videos` - Stube video portfolio entries
- `about_me_content` - Personal profile data
- `boot_screen_settings` - Boot screen customization

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run prod

# Run database setup
node scripts/setup-db.js
```

## Shell Scripts

| Script | Description |
|--------|-------------|
| `./init.sh` | Complete initialization and run |
| `./setup.sh` | Install dependencies and setup database |
| `./start.sh` | Quick start (auto-installs if needed) |
| `./deploy.sh` | Build and prepare for deployment |
| `./build.sh` | Build Docker image |

## Technology Stack

- **Framework:** SvelteKit
- **Styling:** TailwindCSS
- **Database:** PostgreSQL
- **Authentication:** JWT tokens (HTTP-only cookies)
- **Build Tool:** Vite
- **Container:** Docker

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running and accessible
- Check firewall/network settings

### Admin Login Not Working
- Clear browser cookies and try again
- Verify `ADMIN_PASSWORD` is set correctly
- Check server logs for authentication errors

### Boot Screen Not Loading
- Settings load from database with automatic fallback
- Check browser console for API errors
- Verify database connection

## Credits

Based on the original [win32.run](https://win32.run) project. Microsoft and Windows XP trademarks belong to Microsoft Corporation. This project is purely for nostalgia purposes.

## License

MIT License - See LICENSE file for details.
