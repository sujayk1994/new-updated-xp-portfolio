<script>
  import { onMount } from 'svelte';
  import WebampPlayer from './lib/WebampPlayer.svelte';
  
  let showInfo = true;
  
  onMount(() => {
    setTimeout(() => {
      showInfo = false;
    }, 5000);
  });
</script>

<main>
  {#if showInfo}
    <div class="info-panel">
      <h1>🎵 Classic Winamp Player</h1>
      <p>Authentic Windows XP Winamp experience</p>
      <p class="hint">Drag the player windows to move them around!</p>
    </div>
  {/if}
  
  <WebampPlayer />
</main>

<style>
  main {
    width: 100%;
    height: 100vh;
    position: relative;
  }
  
  .info-panel {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px 40px;
    border-radius: 10px;
    text-align: center;
    z-index: 1000;
    animation: fadeIn 0.5s ease-out;
  }
  
  .info-panel h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .info-panel p {
    font-size: 14px;
    opacity: 0.8;
  }
  
  .info-panel .hint {
    margin-top: 10px;
    font-style: italic;
    opacity: 0.6;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
</style>
