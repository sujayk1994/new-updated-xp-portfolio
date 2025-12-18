<script>
  import { winampStore } from '../stores/winampStore';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  function handleClick() {
    winampStore.open();
    dispatch('close-menu');
  }
</script>

<button class="menu-item" on:click={handleClick}>
  <img src="/icons/winamp.png" alt="" class="icon" />
  <span class="label">Winamp</span>
</button>

<style>
  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 4px 8px;
    background: transparent;
    border: none;
    color: black;
    font-family: 'Tahoma', sans-serif;
    font-size: 11px;
    text-align: left;
    cursor: pointer;
  }
  
  .menu-item:hover {
    background: #316ac5;
    color: white;
  }
  
  .icon {
    width: 24px;
    height: 24px;
  }
  
  .label {
    font-weight: bold;
  }
</style>
