# Winamp Clone - Classic Player

## Overview
A standalone classic Winamp-style music player built with Vite + Svelte using the webamp library. This project recreates the authentic Windows XP Winamp experience and is designed for easy integration into other SvelteKit applications.

## Current State
- Fully functional Winamp player with classic skin
- Main player, equalizer, and playlist windows
- Sample playlist with multiple tracks
- Draggable windows
- Volume, play/pause, stop, next/previous controls
- Complete integration package for SvelteKit

## Project Structure
```
/
├── index.html              # Main HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── svelte.config.js        # Svelte configuration
├── src/
│   ├── main.js             # App entry point
│   ├── App.svelte          # Main app component
│   └── lib/
│       └── WebampPlayer.svelte  # Webamp player component
├── integration/            # COPY THESE TO YOUR SVELTEKIT APP
│   ├── COPY_PASTE_GUIDE.md # Quick integration guide
│   ├── README.md           # Detailed instructions
│   ├── lib/
│   │   ├── components/
│   │   │   ├── WinampPlayer.svelte      # Main player
│   │   │   ├── WinampTaskbarButton.svelte
│   │   │   ├── WinampDesktopIcon.svelte
│   │   │   └── WinampStartMenuItem.svelte
│   │   ├── stores/
│   │   │   └── winampStore.js    # Global state management
│   │   └── utils/
│   │       └── fileAssociations.js  # Audio file detection
│   ├── examples/
│   │   ├── FileIconExample.svelte   # How to handle file clicks
│   │   └── LayoutExample.svelte     # How to add to layout
│   └── public/icons/
│       ├── winamp.svg      # Winamp icon
│       └── audio.svg       # Audio file icon
└── INTEGRATION_GUIDE.md    # Original guide
```

## Key Dependencies
- webamp: ^2.2.0 - The Winamp 2 reimplementation library
- vite: ^5.4.2 - Build tool
- svelte: ^4.2.18 - Component framework

## Running the Project
```bash
npm run dev    # Development server on port 5000
npm run build  # Production build
```

## Integration Notes
See `integration/COPY_PASTE_GUIDE.md` for quick step-by-step instructions on integrating this player into your SvelteKit Windows XP themed portfolio. The integration includes:
- Automatic audio file detection
- Opens Winamp on double-click of any audio file
- Taskbar button support
- Desktop icon support
- Programmatic controls (play, pause, next, etc.)
