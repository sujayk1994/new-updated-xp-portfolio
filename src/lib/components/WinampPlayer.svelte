<script>
  import { onMount, onDestroy } from 'svelte';
  import { winampStore } from '../stores/winampStore';
  
  let webampInstance = null;
  let containerRef;
  
  const defaultTracks = [
    {
      metaData: {
        artist: "DJ Mike Llama",
        title: "Llama Whippin' Intro"
      },
      url: "https://cdn.jsdelivr.net/gh/captbaritone/webamp@43434d82cfe0e37286dbbe0666072dc3190a83bc/mp3/llama-2.91.mp3",
      duration: 5.32
    },
    {
      metaData: {
        artist: "Sample Artist",
        title: "Electronic Dreams"
      },
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: 375
    },
    {
      metaData: {
        artist: "Sample Artist",
        title: "Ambient Waves"
      },
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      duration: 323
    }
  ];
  
  onMount(async () => {
    try {
      const Webamp = (await import('webamp')).default;
      
      const storeState = $winampStore;
      
      webampInstance = new Webamp({
        initialTracks: defaultTracks,
        __initialWindowLayout: {
          main: { position: { x: storeState.position.x, y: storeState.position.y } },
          playlist: { position: { x: storeState.position.x, y: storeState.position.y + 116 } },
          equalizer: { position: { x: storeState.position.x, y: storeState.position.y + 232 } }
        }
      });
      
      winampStore.setInstance(webampInstance);
      
      webampInstance.onClose(() => {
        winampStore.close();
      });
      
      webampInstance.onMinimize(() => {
        winampStore.minimize();
      });
      
      if (containerRef) {
        await webampInstance.renderWhenReady(containerRef);
      }
      
    } catch (err) {
      console.error('Failed to initialize Webamp:', err);
    }
  });
  
  onDestroy(() => {
    if (webampInstance) {
      try {
        webampInstance.dispose();
      } catch (e) {
        console.warn('Error disposing webamp:', e);
      }
    }
  });
</script>

{#if !$winampStore.isMinimized}
  <div class="winamp-overlay">
    <div bind:this={containerRef} class="webamp-container"></div>
  </div>
{/if}

<style>
  .winamp-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: var(--winamp-z-index, 1000);
    pointer-events: none;
  }
  
  .webamp-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto;
  }
  
  :global(#webamp) {
    z-index: 1000 !important;
  }
  
  :global(.webamp *) {
    image-rendering: pixelated;
  }
</style>
