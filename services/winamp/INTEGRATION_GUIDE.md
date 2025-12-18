# Integration Guide: Adding Winamp to Your SvelteKit XP Portfolio

## Step 1: Install Dependencies

In your SvelteKit project, install webamp:

```bash
npm install webamp
```

## Step 2: Copy the WebampPlayer Component

Copy `src/lib/WebampPlayer.svelte` to your SvelteKit project's `src/lib/components/` folder.

## Step 3: Create a Winamp Route (Optional)

Create a dedicated page at `src/routes/winamp/+page.svelte`:

```svelte
<script>
  import { onMount } from 'svelte';
  let WebampPlayer;
  
  onMount(async () => {
    const module = await import('$lib/components/WebampPlayer.svelte');
    WebampPlayer = module.default;
  });
</script>

{#if WebampPlayer}
  <svelte:component this={WebampPlayer} />
{:else}
  <p>Loading Winamp...</p>
{/if}
```

## Step 4: Make Player Persistent Across Routes

For a persistent player that stays while navigating, add to `src/routes/+layout.svelte`:

```svelte
<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let WebampPlayer;
  let showPlayer = false;
  
  onMount(async () => {
    if (browser) {
      const module = await import('$lib/components/WebampPlayer.svelte');
      WebampPlayer = module.default;
    }
  });
  
  function togglePlayer() {
    showPlayer = !showPlayer;
  }
</script>

<slot />

{#if showPlayer && WebampPlayer}
  <svelte:component this={WebampPlayer} />
{/if}

<button class="winamp-toggle" on:click={togglePlayer}>
  {showPlayer ? 'Hide' : 'Show'} Winamp
</button>
```

## Step 5: Add XP-Style Taskbar Button

Create a taskbar button to show/hide Winamp:

```svelte
<button class="xp-taskbar-button" on:click={togglePlayer}>
  <img src="/icons/winamp.png" alt="Winamp" />
  <span>Winamp</span>
</button>

<style>
  .xp-taskbar-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background: linear-gradient(180deg, #3c7fb1 0%, #1c5a8c 100%);
    border: 1px solid #0a4272;
    color: white;
    font-size: 11px;
    cursor: pointer;
  }
  
  .xp-taskbar-button:hover {
    background: linear-gradient(180deg, #4c8fc1 0%, #2c6a9c 100%);
  }
  
  .xp-taskbar-button img {
    width: 16px;
    height: 16px;
  }
</style>
```

## Step 6: Control Webamp Programmatically

The WebampPlayer component exports control functions:

```svelte
<script>
  let playerRef;
</script>

<WebampPlayer bind:this={playerRef} />

<button on:click={() => playerRef.play()}>Play</button>
<button on:click={() => playerRef.pause()}>Pause</button>
<button on:click={() => playerRef.stop()}>Stop</button>
<button on:click={() => playerRef.nextTrack()}>Next</button>
<button on:click={() => playerRef.previousTrack()}>Previous</button>
<button on:click={() => playerRef.setVolume(50)}>Set Volume 50%</button>
```

## Step 7: Customize Initial Tracks

Modify the `initialTracks` array in WebampPlayer.svelte:

```javascript
const initialTracks = [
  {
    metaData: {
      artist: "Your Artist",
      title: "Your Track"
    },
    url: "https://your-audio-url.mp3",
    duration: 180
  }
];
```

## Step 8: Add Custom Skins

Add more skins to the `availableSkins` array:

```javascript
availableSkins: [
  { url: "https://path/to/skin.wsz", name: "Custom Skin" }
]
```

## Troubleshooting

### CORS Issues with Audio Files
- Host audio files on a CORS-enabled CDN
- Or use a proxy server for local files

### Player Not Loading
- Ensure webamp is imported dynamically (client-side only)
- Check browser console for errors

### Positioning Issues
- The player uses fixed positioning by default
- Modify `.webamp-container` styles as needed
