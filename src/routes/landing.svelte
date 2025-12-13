<script>
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    import * as utils from '../lib/utils';
    
    let dispatcher = createEventDispatcher();
    let showCursor = false;
    let isMobile = false;
    
    function checkMobile() {
        isMobile = window.innerWidth <= 768 || 
            ('ontouchstart' in window) || 
            (navigator.maxTouchPoints > 0);
    }
    
    onMount(() => {
        document.body.style.cursor = 'none';
        checkMobile();
        window.addEventListener('resize', checkMobile);
    });
    
    onDestroy(() => {
        window.removeEventListener('resize', checkMobile);
    });
    
    function startWindows() {
        utils.unlockAudio();
        dispatcher('load_page', {url: './xp/starting.svelte'});
    }
    
    function handleKeydown(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.key === 'Enter') {
            startWindows();
        } else if (e.key === 'Escape') {
            location.reload();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="landing-screen" on:click={startWindows}>
    {#if isMobile}
        <img src="/images/bios_splash_mobile.jpg" alt="BIOS Boot Screen" class="bios-image" />
    {:else}
        <img src="/images/bios_splash.jpg" alt="BIOS Boot Screen" class="bios-image" />
    {/if}
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
