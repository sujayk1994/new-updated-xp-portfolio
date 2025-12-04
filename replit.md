# Windows XP Simulator

A browser-based Windows XP simulator built with SvelteKit and TailwindCSS.

## Quick Start

### Single Command (Recommended)
```bash
./init.sh
```
This will install dependencies (if needed) and start the development server.

### Alternative Commands
```bash
# Install dependencies only
npm run setup

# Install and start in one command
npm run start

# Start development server (after dependencies are installed)
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 5000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run start` | Install dependencies and start dev server |
| `npm run setup` | Install dependencies |
| `npm run prod` | Build and run production server |

## Shell Scripts

| Script | Description |
|--------|-------------|
| `./init.sh` | One-command setup and run |
| `./setup.sh` | Install dependencies only |
| `./start.sh` | Start dev server (auto-installs if needed) |

## Project Structure

- `src/` - Source code
  - `routes/` - SvelteKit routes and pages
  - `lib/` - Shared components and utilities
- `static/` - Static assets (images, fonts, audio, video)
- `build/` - Production build output

## Technology Stack

- **Framework**: SvelteKit
- **Styling**: TailwindCSS
- **Build Tool**: Vite

## Deployment

The app is configured for autoscale deployment:
- Build command: `npm run build`
- Run command: `node build/index.js`

## Development Notes

- The dev server runs on port 5000
- Host is set to 0.0.0.0 for Replit compatibility
