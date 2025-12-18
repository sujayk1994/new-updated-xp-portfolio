<script>
  import { winampStore } from '../stores/winampStore';
  
  $: isOpen = $winampStore.isOpen;
  $: isMinimized = $winampStore.isMinimized;
  
  function handleClick() {
    if (!isOpen) {
      winampStore.open();
    } else if (isMinimized) {
      winampStore.restore();
    } else {
      winampStore.minimize();
    }
  }
</script>

{#if isOpen}
  <button 
    class="taskbar-button" 
    class:active={!isMinimized}
    on:click={handleClick}
  >
    <img src="/icons/winamp.png" alt="" class="icon" />
    <span class="label">Winamp</span>
  </button>
{/if}

<style>
  .taskbar-button {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 150px;
    max-width: 180px;
    height: 22px;
    padding: 0 8px;
    background: linear-gradient(180deg, 
      #3c7fb1 0%, 
      #2968a3 3%, 
      #236092 6%, 
      #1c5a8c 10%, 
      #1c5a8c 90%, 
      #185687 94%, 
      #154f7d 97%, 
      #0f4772 100%
    );
    border: none;
    border-radius: 2px;
    color: white;
    font-family: 'Tahoma', sans-serif;
    font-size: 11px;
    text-align: left;
    cursor: pointer;
    box-shadow: 
      inset 1px 1px 0 rgba(255,255,255,0.2),
      inset -1px -1px 0 rgba(0,0,0,0.2);
  }
  
  .taskbar-button:hover {
    background: linear-gradient(180deg, 
      #4c8fc1 0%, 
      #3978b3 3%, 
      #3370a2 6%, 
      #2c6a9c 10%, 
      #2c6a9c 90%, 
      #286697 94%, 
      #255f8d 97%, 
      #1f5782 100%
    );
  }
  
  .taskbar-button.active {
    background: linear-gradient(180deg, 
      #1c5a8c 0%, 
      #154f7d 10%, 
      #154f7d 90%, 
      #0f4772 100%
    );
    box-shadow: 
      inset 1px 1px 2px rgba(0,0,0,0.3),
      inset -1px -1px 0 rgba(255,255,255,0.1);
  }
  
  .icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  
  .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
