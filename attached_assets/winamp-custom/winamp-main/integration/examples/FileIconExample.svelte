<script>
  import { handleFileDoubleClick, isAudioFile, getAudioIcon } from '$lib/utils/fileAssociations';
  import { createEventDispatcher } from 'svelte';
  
  export let file = { name: 'song.mp3', url: '' };
  export let selected = false;
  
  const dispatch = createEventDispatcher();
  
  let clickCount = 0;
  let clickTimer = null;
  
  function getIconForFile(filename) {
    if (isAudioFile(filename)) {
      return '/icons/audio.png';
    }
    return '/icons/file.png';
  }
  
  function handleClick(e) {
    e.stopPropagation();
    clickCount++;
    
    if (clickCount === 1) {
      clickTimer = setTimeout(() => {
        dispatch('select', file);
        clickCount = 0;
      }, 300);
    } else if (clickCount === 2) {
      clearTimeout(clickTimer);
      clickCount = 0;
      
      const handled = handleFileDoubleClick(file, { url: file.url });
      
      if (!handled) {
        dispatch('open', file);
      }
    }
  }
</script>

<div 
  class="file-icon" 
  class:selected
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleFileDoubleClick(file, { url: file.url })}
  role="button"
  tabindex="0"
>
  <div class="icon-image">
    <img src={getIconForFile(file.name)} alt="" />
  </div>
  <span class="icon-label">{file.name}</span>
</div>

<style>
  .file-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70px;
    padding: 4px;
    cursor: pointer;
    user-select: none;
  }
  
  .file-icon:focus {
    outline: none;
  }
  
  .icon-image {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }
  
  .icon-image img {
    width: 32px;
    height: 32px;
    image-rendering: pixelated;
  }
  
  .icon-label {
    font-family: 'Tahoma', sans-serif;
    font-size: 11px;
    color: black;
    text-align: center;
    word-wrap: break-word;
    max-width: 100%;
    line-height: 1.2;
  }
  
  .selected .icon-label {
    background: #316ac5;
    color: white;
    padding: 1px 2px;
  }
  
  .selected .icon-image {
    opacity: 0.7;
  }
</style>
