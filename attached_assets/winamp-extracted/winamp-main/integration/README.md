# Winamp Integration for Windows XP Portfolio

## Quick Install (3 Steps)

### Step 1: Install webamp dependency
```bash
npm install webamp
```

### Step 2: Copy files to your SvelteKit project
Copy these folders/files to your project:
- `lib/components/WinampPlayer.svelte` -> `src/lib/components/`
- `lib/stores/winampStore.js` -> `src/lib/stores/`
- `lib/utils/fileAssociations.js` -> `src/lib/utils/`

### Step 3: Add to your layout
In your `+layout.svelte`, add:
```svelte
<script>
  import WinampWindow from '$lib/components/WinampPlayer.svelte';
  import { winampStore } from '$lib/stores/winampStore';
</script>

<!-- Add at the end of your layout, after <slot /> -->
{#if $winampStore.isOpen}
  <WinampWindow />
{/if}
```

## Usage

### Open Winamp when double-clicking audio files
In your file/folder component where you handle double-clicks:
```svelte
<script>
  import { openAudioFile, isAudioFile } from '$lib/utils/fileAssociations';
  
  function handleDoubleClick(file) {
    if (isAudioFile(file.name)) {
      openAudioFile(file);
    }
  }
</script>
```

### Open Winamp from taskbar or start menu
```svelte
<script>
  import { winampStore } from '$lib/stores/winampStore';
</script>

<button on:click={() => winampStore.open()}>
  Open Winamp
</button>
```

### Control playback programmatically
```javascript
import { winampStore } from '$lib/stores/winampStore';

winampStore.play();
winampStore.pause();
winampStore.stop();
winampStore.nextTrack();
winampStore.previousTrack();
winampStore.setVolume(75);
winampStore.addTrack({ url: '...', metaData: { artist: '...', title: '...' } });
```

## That's it! Your Winamp integration is complete.
