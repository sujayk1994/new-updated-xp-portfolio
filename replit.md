# Windows XP Portfolio Simulator

A browser-based Windows XP simulator featuring "Stube" - a custom YouTube-like video portfolio interface, built with SvelteKit and TailwindCSS.

## Quick Start

### Single Command (Recommended)
```bash
./init.sh
```
This comprehensive script will:
1. Check environment configuration
2. Install npm dependencies
3. Download media files (if Git LFS placeholders exist)
4. Set up database tables
5. Create admin user (if ADMIN_PASSWORD is set)
6. Start the development server

### Alternative Commands
```bash
# Install dependencies only
./setup.sh

# Quick start (auto-installs if needed)
./start.sh

# Direct npm commands
npm run dev     # Start development server
npm run build   # Build for production
npm run prod    # Build and run production server
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Auto-set by Replit |
| `ADMIN_PASSWORD` | Password for admin account | For admin features |
| `ADMIN_USERNAME` | Admin username (default: "admin") | Optional |
| `JWT_SECRET` | Secret for JWT tokens | Optional (uses default) |

## Shell Scripts

| Script | Description |
|--------|-------------|
| `./init.sh` | Complete one-command initialization and run |
| `./setup.sh` | Install dependencies and setup database |
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

## Magazine Portfolio

The desktop includes a Magazine Portfolio showcase - an awwwards.com inspired carousel gallery with a FlowPaper-style flipbook viewer.

### Features:
- **Carousel Gallery**: Browse magazines in a sleek dark-themed interface with left/right navigation
- **Flipbook Viewer**: Click any magazine to open it with realistic page-turning CSS animations
- **Admin Management**: When logged in as admin, add/edit/delete magazines with cover images and PDF files

### For Admins:
1. Log in as admin (navigate to `/admin-login`)
2. Open the Magazine Portfolio from the desktop
3. Click "Add Magazine" to upload new magazines (title, cover image, PDF file)
4. Manage existing magazines with edit/delete options

## Stube Video Portfolio

Internet Explorer features "Stube" - a custom YouTube-style video portfolio interface where visitors can browse and watch your videos. The interface uses your About Me profile photo for all avatars and applies Arial font styling throughout.

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
