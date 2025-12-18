<script>
  import "../app.css";
  import WinampPlayer from '$lib/components/WinampPlayer.svelte';
  import { winampStore } from '$lib/stores/winampStore';
</script>

{#if $winampStore.isOpen}
  <WinampPlayer />
{/if}

<slot />