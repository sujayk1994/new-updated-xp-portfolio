<script>
  import { onMount, onDestroy } from 'svelte';
  
  let webampInstance = null;
  let containerRef;
  let isLoaded = false;
  let error = null;
  
  const initialTracks = [
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
        artist: "Diablo Swing Orchestra",
        title: "Heroines"
      },
      url: "https://raw.githubusercontent.com/nicmlu/public_files/main/DSO_Heroines.mp3",
      duration: 322
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
    },
    {
      metaData: {
        artist: "Sample Artist",
        title: "Chill Vibes"
      },
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      duration: 325
    }
  ];
  
  onMount(async () => {
    try {
      const Webamp = (await import('webamp')).default;
      
      webampInstance = new Webamp({
        initialTracks,
        initialSkin: {
          url: "https://cdn.jsdelivr.net/gh/nicmlu/public_files/base-2.91.wsz"
        },
        availableSkins: [
          { url: "https://cdn.jsdelivr.net/gh/nicmlu/public_files/base-2.91.wsz", name: "Base" },
          { url: "https://cdn.jsdelivr.net/gh/nicmlu/public_files/Green-Dimension-V2.wsz", name: "Green Dimension" },
          { url: "https://cdn.jsdelivr.net/gh/nicmlu/public_files/MacOSXAqua1-04.wsz", name: "Mac OS X Aqua" }
        ],
        __initialWindowLayout: {
          main: { position: { x: 50, y: 100 } },
          playlist: { position: { x: 50, y: 232 } },
          equalizer: { position: { x: 50, y: 348 } }
        }
      });
      
      webampInstance.onClose(() => {
        webampInstance.reopen();
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
      webampInstance.dispose();
    }
  });
  
  export function play() {
    if (webampInstance) webampInstance.play();
  }
  
  export function pause() {
    if (webampInstance) webampInstance.pause();
  }
  
  export function stop() {
    if (webampInstance) webampInstance.stop();
  }
  
  export function nextTrack() {
    if (webampInstance) webampInstance.nextTrack();
  }
  
  export function previousTrack() {
    if (webampInstance) webampInstance.previousTrack();
  }
  
  export function setVolume(volume) {
    if (webampInstance) webampInstance.setVolume(volume);
  }
  
  export function getWebampInstance() {
    return webampInstance;
  }
</script>

<div class="webamp-wrapper">
  {#if error}
    <div class="error-message">
      <p>Failed to load Winamp: {error}</p>
      <p>Please refresh the page to try again.</p>
    </div>
  {:else if !isLoaded}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading Winamp...</p>
    </div>
  {/if}
  
  <div bind:this={containerRef} class="webamp-container"></div>
</div>

<style>
  .webamp-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .webamp-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
  }
  
  :global(#webamp) {
    z-index: 100 !important;
  }
  
  :global(.webamp-wrapper *) {
    image-rendering: pixelated;
  }
  
  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    z-index: 1000;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top-color: #00ff00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .error-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 0, 0, 0.2);
    border: 1px solid #ff4444;
    padding: 20px;
    border-radius: 8px;
    color: white;
    text-align: center;
    z-index: 1000;
  }
</style>
