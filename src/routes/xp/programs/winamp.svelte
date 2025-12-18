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

  onMount(() => {
    // If opened with an audio file
    if (fs_item && fs_item.url) {
      openAudioFile(fs_item, fs_item.url);
    } else {
      // Just open Winamp without a file
      winampStore.open();
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
