<script>
  import { onMount } from 'svelte';
  import { winampStore } from '../../../lib/stores/winampStore';
  import { openAudioFile } from '../../../lib/utils/fileAssociations';

  export let id;
  export let window;
  export let self;
  export let parentNode = null;
  export let fs_item = null;
  export let exec_path = null;

  onMount(async () => {
    // If opened with an audio file
    if (fs_item && fs_item.url) {
      openAudioFile(fs_item, fs_item.url);
    } else {
      // Just open Winamp without a file - Play default intro
      winampStore.open();
      
      const defaultTrack = {
        metaData: {
          artist: "DJ Mike Llama",
          title: "Winamp Demo"
        },
        url: "https://cdn.jsdelivr.net/gh/captbaritone/webamp@43434d82cfe0e37286dbbe0666072dc3190a83bc/mp3/llama-2.91.mp3"
      };
      
      // Give store a moment to initialize instance
      setTimeout(() => {
        try {
          winampStore.setPlaylist([defaultTrack]);
          winampStore.play();
        } catch (e) {
          console.error('Error playing intro:', e);
        }
      }, 1500);
    }
    
    // Close the program window since Winamp opens as overlay
    if (self) {
      setTimeout(() => {
        try {
          self.$destroy();
        } catch (e) {
          console.warn('Could not destroy window:', e);
        }
      }, 100);
    }
  });
</script>
