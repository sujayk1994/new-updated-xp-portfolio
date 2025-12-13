# Deployment Guide

Complete guide for deploying the Windows XP Portfolio Simulator.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Docker Deployment](#docker-deployment)
3. [Manual Deployment](#manual-deployment)
4. [Cloud Platforms](#cloud-platforms)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup](#database-setup)
7. [Troubleshooting](#troubleshooting)

## Quick Start

### One-Click Docker Deployment

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd winxp-portfolio

# 2. Create environment file
cp .env.example .env

# 3. Edit configuration
nano .env

# 4. Deploy
./deploy.sh docker
```

Your application will be running at `http://localhost:5000`

## Docker Deployment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Using docker-compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop, remove containers and volumes (deletes data)
docker-compose down -v
```

### Using deploy.sh Script

```bash
# Full deployment
./deploy.sh docker

# Start existing containers
./deploy.sh start

# Stop containers
./deploy.sh stop

# Restart containers
./deploy.sh restart

# View logs
./deploy.sh logs

# Clean up (removes containers and data)
./deploy.sh clean
```

### Using Docker Only (No Compose)

```bash
# Build image
docker build -t winxp-portfolio .

# Run with external PostgreSQL
docker run -d \
  --name winxp-portfolio \
  -p 5000:5000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/dbname" \
  -e ADMIN_PASSWORD="your-secure-password" \
  -e JWT_SECRET="your-jwt-secret" \
  winxp-portfolio
```

## Manual Deployment

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
export DATABASE_URL="postgresql://user:pass@localhost:5432/winxp"
export ADMIN_PASSWORD="your-secure-password"
export JWT_SECRET="your-jwt-secret"
export NODE_ENV="production"

# 3. Setup database
node scripts/setup-db.js

# 4. Build application
npm run build

# 5. Start production server
node build/index.js
```

### Using PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start build/index.js --name winxp-portfolio

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### Using systemd (Linux)

Create `/etc/systemd/system/winxp-portfolio.service`:

```ini
[Unit]
Description=Windows XP Portfolio Simulator
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/winxp-portfolio
Environment=NODE_ENV=production
Environment=DATABASE_URL=postgresql://user:pass@localhost:5432/winxp
Environment=ADMIN_PASSWORD=your-secure-password
ExecStart=/usr/bin/node build/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable winxp-portfolio
sudo systemctl start winxp-portfolio
```

## Cloud Platforms

### Railway

1. Connect your GitHub repository
2. Add environment variables:
   - `DATABASE_URL` (use Railway PostgreSQL addon)
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
3. Railway auto-detects Node.js and deploys

### Render

1. Create a new Web Service
2. Connect your repository
3. Set build command: `npm install && npm run build`
4. Set start command: `node build/index.js`
5. Add environment variables
6. Add PostgreSQL database addon

### Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Deploy
fly deploy

# Set secrets
fly secrets set DATABASE_URL="your-url"
fly secrets set ADMIN_PASSWORD="your-password"
```

### DigitalOcean App Platform

1. Create new app from GitHub
2. Configure as Web Service
3. Set build command: `npm run build`
4. Set run command: `node build/index.js`
5. Add PostgreSQL database
6. Set environment variables

## Environment Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

### Recommended Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ADMIN_PASSWORD` | Initial admin password | - |
| `ADMIN_USERNAME` | Admin username | `admin` |
| `JWT_SECRET` | JWT signing secret | Auto-generated |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |

### Email Configuration (Contact Form)

| Variable | Description | Required |
|----------|-------------|----------|
| `RESEND_API_KEY` | Resend.com API key | For email notifications |
| `RESEND_FROM_EMAIL` | Verified sender email | For email notifications |

**Important**: Resend requires a **custom domain** to send emails to others. Free email addresses (Gmail, etc.) can only send to your own verified email.

#### Setting up Resend:

1. Go to [resend.com](https://resend.com) and create an account
2. Add and verify your custom domain (e.g., `yourdomain.com`)
3. Create an API key
4. Set environment variables:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=contact@yourdomain.com
   ```

## Database Setup

### Automatic Setup

The database tables are created automatically when you run:

```bash
node scripts/setup-db.js
```

Or through Docker Compose:

```bash
docker-compose run --rm setup
```

### Manual Setup

```sql
-- Connect to PostgreSQL and run:

CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_files (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    basename VARCHAR(255) NOT NULL,
    ext VARCHAR(50) DEFAULT '',
    parent VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    storage_type VARCHAR(50) DEFAULT 'admin',
    url TEXT,
    size INTEGER DEFAULT 0,
    children TEXT DEFAULT '[]',
    date_created BIGINT NOT NULL,
    date_modified BIGINT NOT NULL,
    sort_option INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    starting_point BOOLEAN DEFAULT FALSE,
    executable BOOLEAN DEFAULT FALSE,
    file_data BYTEA,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    youtube_id VARCHAR(50) NOT NULL,
    channel VARCHAR(255) DEFAULT 'Portfolio Channel',
    description TEXT,
    duration VARCHAR(20) DEFAULT '0:00',
    views VARCHAR(50) DEFAULT '0 views',
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_me_content (
    id SERIAL PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS boot_screen_settings (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) DEFAULT 'default',
    custom_gif TEXT,
    show_logo BOOLEAN DEFAULT TRUE,
    show_progress BOOLEAN DEFAULT TRUE,
    show_copyright BOOLEAN DEFAULT TRUE,
    background_color VARCHAR(20) DEFAULT '#000000',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs app

# Verify database is healthy
docker-compose ps
```

### Database connection failed

- Verify `DATABASE_URL` format
- Check database is accessible
- Ensure credentials are correct

### Admin login not working

- Check `ADMIN_PASSWORD` is set
- Run database setup: `node scripts/setup-db.js`
- Clear browser cookies

### Port already in use

```bash
# Find process using port
lsof -i :5000

# Or change port in .env
PORT=3000
```

### Build fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear build cache
rm -rf .svelte-kit build
npm run build
```
