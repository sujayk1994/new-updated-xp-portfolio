<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import * as utils from '../lib/utils';
    
    let dispatcher = createEventDispatcher();
    let showCursor = false;
    
    onMount(() => {
        document.body.style.cursor = 'none';
    });
    
    async function startWindows() {
        await utils.unlockAudio();
        dispatcher('load_page', {url: './xp/starting.svelte'});
    }
    
    function handleKeydown(e) {
        if (e.key === 'Enter') {
            startWindows();
        } else if (e.key === 'Escape') {
            window.location.reload();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="landing-screen" on:click={startWindows}>
    <img src="/images/bios_splash.jpg" alt="BIOS Boot Screen" class="bios-image" />
</div>

<style>
    .landing-screen {
        position: absolute;
        inset: 0;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: none;
    }
    
    .bios-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    
    :global(body) {
        cursor: none;
    }
</style>
