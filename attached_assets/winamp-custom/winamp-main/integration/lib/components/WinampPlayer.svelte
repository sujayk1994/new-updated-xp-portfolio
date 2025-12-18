<script>
  import { onMount, onDestroy } from 'svelte';
  import { winampStore } from '../stores/winampStore';
  
  let webampInstance = null;
  let containerRef;
  let isLoaded = false;
  let error = null;
  
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
        initialSkin: {
          url: "https://cdn.jsdelivr.net/gh/nicmlu/public_files/base-2.91.wsz"
        },
        availableSkins: [
          { url: "https://cdn.jsdelivr.net/gh/nicmlu/public_files/base-2.91.wsz", name: "Base" },
          { url: "https://cdn.jsdelivr.net/gh/nicmlu/public_files/Green-Dimension-V2.wsz", name: "Green Dimension" },
          { url: "https://cdn.jsdelivr.net/gh/nicmlu/public_files/MacOSXAqua1-04.wsz", name: "Mac OS X Aqua" }
        ],
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
      
      await webampInstance.renderWhenReady(containerRef);
      isLoaded = true;
      
    } catch (err) {
      console.error('Failed to initialize Webamp:', err);
      error = err.message;
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
    {#if error}
      <div class="error-message">
        <p>Failed to load Winamp: {error}</p>
        <button on:click={() => winampStore.close()}>Close</button>
      </div>
    {:else if !isLoaded}
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading Winamp...</p>
      </div>
    {/if}
    
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
  
  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    background: rgba(0, 0, 0, 0.8);
    padding: 30px;
    border-radius: 8px;
    z-index: 2000;
    pointer-events: auto;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: #00ff00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .error-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid #ff4444;
    padding: 20px 30px;
    border-radius: 8px;
    color: white;
    text-align: center;
    z-index: 2000;
    pointer-events: auto;
  }
  
  .error-message button {
    margin-top: 15px;
    padding: 8px 20px;
    background: #0078d4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .error-message button:hover {
    background: #106ebe;
  }
</style>
