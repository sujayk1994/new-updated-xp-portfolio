# Quick Copy-Paste Integration Guide

## Step 1: Install dependency
```bash
npm install webamp
```

## Step 2: Copy the integration folder structure
Copy the `lib` folder contents to your SvelteKit project's `src/lib/` folder:

```
your-sveltekit-project/
└── src/
    └── lib/
        ├── components/
        │   ├── WinampPlayer.svelte      ← copy this
        │   ├── WinampTaskbarButton.svelte ← copy this
        │   ├── WinampDesktopIcon.svelte  ← copy this (optional)
        │   └── WinampStartMenuItem.svelte ← copy this (optional)
        ├── stores/
        │   └── winampStore.js           ← copy this
        └── utils/
            └── fileAssociations.js      ← copy this
```

## Step 3: Add Winamp to your layout

In your `src/routes/+layout.svelte`, add these lines:

```svelte
<script>
  // Add these imports at the top
  import { browser } from '$app/environment';
  import { winampStore } from '$lib/stores/winampStore';
  
  // Dynamically import WinampPlayer (client-side only)
  let WinampPlayer;
  import('$lib/components/WinampPlayer.svelte').then(m => {
    WinampPlayer = m.default;
  });
</script>

<!-- Your existing layout content -->
<slot />

<!-- Add this at the END of your layout, after everything else -->
{#if browser && $winampStore.isOpen && WinampPlayer}
  <svelte:component this={WinampPlayer} />
{/if}
```

## Step 4: Make audio files open Winamp on double-click

In any component where you display files (like a folder window), add this:

```svelte
<script>
  import { handleFileDoubleClick, isAudioFile } from '$lib/utils/fileAssociations';
  
  // Your files array
  let files = [
    { name: 'song.mp3', url: 'https://example.com/song.mp3' },
    { name: 'music.wav', url: 'https://example.com/music.wav' }
  ];
  
  function onDoubleClick(file) {
    // This automatically opens Winamp for audio files
    const handled = handleFileDoubleClick(file, { url: file.url });
    
    if (!handled) {
      // Handle other file types here
      console.log('Opening:', file.name);
    }
  }
</script>

{#each files as file}
  <div on:dblclick={() => onDoubleClick(file)}>
    {file.name}
  </div>
{/each}
```

## Step 5: Add Winamp button to taskbar (optional)

```svelte
<script>
  import WinampTaskbarButton from '$lib/components/WinampTaskbarButton.svelte';
</script>

<div class="taskbar">
  <!-- other taskbar items -->
  <WinampTaskbarButton />
</div>
```

## Step 6: Add Winamp icon to desktop (optional)

```svelte
<script>
  import WinampDesktopIcon from '$lib/components/WinampDesktopIcon.svelte';
</script>

<WinampDesktopIcon x={20} y={200} />
```

## That's it! Your Winamp is now integrated.

### Supported Audio Formats
- .mp3, .wav, .ogg, .flac, .aac, .m4a, .wma, .opus, .webm

### Programmatic Controls
```javascript
import { winampStore } from '$lib/stores/winampStore';

winampStore.open();      // Open Winamp
winampStore.close();     // Close Winamp
winampStore.play();      // Play current track
winampStore.pause();     // Pause playback
winampStore.stop();      // Stop playback
winampStore.nextTrack(); // Next track
winampStore.previousTrack(); // Previous track
winampStore.setVolume(75);   // Set volume (0-100)
winampStore.addTrack({
  url: 'https://example.com/song.mp3',
  metaData: { artist: 'Artist', title: 'Song' }
});
```
