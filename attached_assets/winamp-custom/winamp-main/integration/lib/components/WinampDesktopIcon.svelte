<script>
  import { winampStore } from '../stores/winampStore';
  import { createEventDispatcher } from 'svelte';
  
  export let x = 20;
  export let y = 20;
  export let selected = false;
  
  const dispatch = createEventDispatcher();
  
  let clickCount = 0;
  let clickTimer = null;
  
  function handleClick(e) {
    e.stopPropagation();
    clickCount++;
    
    if (clickCount === 1) {
      clickTimer = setTimeout(() => {
        dispatch('select');
        clickCount = 0;
      }, 300);
    } else if (clickCount === 2) {
      clearTimeout(clickTimer);
      clickCount = 0;
      winampStore.open();
    }
  }
</script>

<div 
  class="desktop-icon" 
  class:selected
  style="left: {x}px; top: {y}px;"
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && winampStore.open()}
  role="button"
  tabindex="0"
>
  <div class="icon-image">
    <img src="/icons/winamp.png" alt="Winamp" />
  </div>
  <span class="icon-label">Winamp</span>
</div>

<style>
  .desktop-icon {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70px;
    padding: 4px;
    cursor: pointer;
    user-select: none;
  }
  
  .desktop-icon:focus {
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
    color: white;
    text-align: center;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
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
