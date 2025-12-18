<script>
  import WinampPlayer from '$lib/components/WinampPlayer.svelte';
  import WinampTaskbarButton from '$lib/components/WinampTaskbarButton.svelte';
  import { winampStore } from '$lib/stores/winampStore';
  import { browser } from '$app/environment';
</script>

<div class="xp-desktop">
  <slot />
</div>

<div class="xp-taskbar">
  <button class="start-button">
    <img src="/icons/start.png" alt="" />
    <span>start</span>
  </button>
  
  <div class="taskbar-buttons">
    <WinampTaskbarButton />
  </div>
  
  <div class="system-tray">
    <span class="clock">12:00 PM</span>
  </div>
</div>

{#if browser && $winampStore.isOpen}
  <WinampPlayer />
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  .xp-desktop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 30px;
    background: #3a6ea5;
    overflow: hidden;
  }
  
  .xp-taskbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(180deg, 
      #245edb 0%, 
      #3f8cf3 9%, 
      #245edb 18%, 
      #245edb 92%, 
      #1941a5 100%
    );
    display: flex;
    align-items: center;
    padding: 0 2px;
    z-index: 9999;
  }
  
  .start-button {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 0 12px;
    background: linear-gradient(180deg, 
      #5cb85c 0%, 
      #3d943d 50%, 
      #2d7b2d 100%
    );
    border: none;
    border-radius: 0 8px 8px 0;
    color: white;
    font-family: 'Franklin Gothic Medium', 'Tahoma', sans-serif;
    font-size: 14px;
    font-weight: bold;
    font-style: italic;
    cursor: pointer;
    text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
  }
  
  .start-button img {
    width: 20px;
    height: 20px;
  }
  
  .taskbar-buttons {
    flex: 1;
    display: flex;
    gap: 3px;
    padding: 0 4px;
    overflow: hidden;
  }
  
  .system-tray {
    display: flex;
    align-items: center;
    padding: 0 8px;
    height: 100%;
    background: linear-gradient(180deg, 
      #0f7bc6 0%, 
      #1290e9 10%, 
      #1290e9 90%, 
      #0f7bc6 100%
    );
  }
  
  .clock {
    font-family: 'Tahoma', sans-serif;
    font-size: 11px;
    color: white;
  }
</style>
