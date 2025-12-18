<script>
  import { onMount } from 'svelte';

  let winampReady = false;
  let currentTrack = null;

  onMount(() => {
    // Initialize Winamp integration
    window.winampAPI = {
      playAudio: playInWinamp,
      getCurrentTrack: () => currentTrack,
      isReady: () => winampReady
    };
    winampReady = true;
  });

  export async function playInWinamp(filePath) {
    try {
      const response = await fetch('/api/winamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: filePath, action: 'play' })
      });

      const result = await response.json();
      if (result.status === 'success') {
        currentTrack = filePath;
        console.log('🎵 Winamp playing:', filePath);
        // Trigger local playback if needed
        triggerWinampPlayback(filePath);
      }
      return result;
    } catch (error) {
      console.error('Winamp playback error:', error);
      return { status: 'error', message: error.message };
    }
  }

  function triggerWinampPlayback(filePath) {
    // Dispatch custom event that can be listened to by any component
    window.dispatchEvent(
      new CustomEvent('winamp:play', {
        detail: { file: filePath, timestamp: Date.now() }
      })
    );
  }

  // Export function to be used in other components
  export const playAudio = playInWinamp;
</script>

<!-- This component integrates Winamp as a microservice without UI -->
<!-- It provides API methods for other components to use -->
