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
| `./push.sh` | Push changes to GitHub |

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

## Admin System

The portfolio includes an admin authentication system that allows the owner to make permanent changes visible to all visitors.

### How it works:
- **Visitors**: Can interact with the XP interface, but their changes (files, folders) are stored locally and reset when they leave
- **Admin**: When logged in, any files or folders created are saved permanently to the database and visible to all visitors

### Admin Login:
1. Navigate to `/admin-login` in your browser (the admin login is hidden from visitors)
2. First time: Create your admin account (username + password, min 6 characters)
3. After that: Log in with your credentials
4. When logged in, a yellow "ADMIN MODE" banner appears at the top of the desktop

### Admin Features:
- Create folders that persist permanently
- Upload files that are stored on the server
- Delete admin-created content
- All admin content is loaded automatically for all visitors
- **About Me page**: Edit your personal profile (name, title, bio, contact info, skills, social links)
- **Video Manager**: Add and manage your portfolio videos for the YouTube-like interface in Internet Explorer

## YouTube-like Video Portfolio

Internet Explorer now features a YouTube-style interface where visitors can browse and watch your video portfolio.

### For Site Owners (Admin):
1. Log in as admin (navigate to `/admin-login`)
2. Open the "Video Manager" from the desktop (or look in Program Files)
3. Add videos by providing:
   - **Title**: Your video's title
   - **YouTube URL**: Link to your YouTube video (e.g., `https://youtube.com/watch?v=VIDEO_ID`)
   - **Channel Name**: Your channel or brand name
   - **Duration**: Video length (e.g., "3:45")
   - **Views Text**: Custom views text (e.g., "1.2K views")
   - **Description**: Optional video description
   - **Display Order**: Controls video order (lower numbers appear first)
   - **Visibility**: Toggle to show/hide videos from visitors

### For Visitors:
- Open Internet Explorer from the desktop
- Videos are displayed in a YouTube-like grid layout
- Search videos using the search bar
- Click any video to watch it with a full player interface
- See recommended videos in the sidebar
- Navigate using back/forward buttons and the address bar

### Technical Details:
- Videos are stored in the PostgreSQL database (`admin_videos` table)
- YouTube URLs are automatically parsed to extract video IDs
- Thumbnails are auto-generated from YouTube
- Uses embedded YouTube player for video playback
- Admin authentication uses JWT tokens stored in HTTP-only cookies
- Files are stored in `static/uploads/admin/`
- File metadata is stored in PostgreSQL database
- Admin files are merged with base hard drive data on page load

## Development Notes

- The dev server runs on port 5000
- Host is set to 0.0.0.0 for Replit compatibility
- PostgreSQL database is used for admin file persistence
- Admin API endpoints are in `src/routes/api/admin/`
