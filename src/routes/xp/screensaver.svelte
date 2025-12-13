<script>
    import { onMount, onDestroy } from 'svelte';
    
    export let timeout = 60000;
    
    let isActive = false;
    let videoElement;
    let inactivityTimer;
    
    function resetTimer() {
        if (isActive) {
            deactivateScreensaver();
        }
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(activateScreensaver, timeout);
    }
    
    function activateScreensaver() {
        isActive = true;
        if (videoElement) {
            videoElement.currentTime = 0;
            videoElement.play().catch(() => {});
        }
    }
    
    function deactivateScreensaver() {
        isActive = false;
        if (videoElement) {
            videoElement.pause();
        }
        resetTimer();
    }
    
    function handleUserActivity(e) {
        if (isActive) {
            e.preventDefault();
            e.stopPropagation();
            deactivateScreensaver();
        } else {
            resetTimer();
        }
    }
    
    onMount(() => {
        window.addEventListener('mousemove', handleUserActivity, true);
        window.addEventListener('mousedown', handleUserActivity, true);
        window.addEventListener('keydown', handleUserActivity, true);
        window.addEventListener('touchstart', handleUserActivity, true);
        window.addEventListener('scroll', handleUserActivity, true);
        
        resetTimer();
    });
    
    onDestroy(() => {
        clearTimeout(inactivityTimer);
        window.removeEventListener('mousemove', handleUserActivity, true);
        window.removeEventListener('mousedown', handleUserActivity, true);
        window.removeEventListener('keydown', handleUserActivity, true);
        window.removeEventListener('touchstart', handleUserActivity, true);
        window.removeEventListener('scroll', handleUserActivity, true);
    });
</script>

{#if isActive}
    <div 
        class="screensaver-overlay"
        on:mousemove={handleUserActivity}
        on:mousedown={handleUserActivity}
        on:keydown={handleUserActivity}
        on:touchstart={handleUserActivity}
    >
        <video
            bind:this={videoElement}
            src="/video/pipes_screensaver.mp4"
            autoplay
            loop
            muted
            playsinline
            class="screensaver-video"
        >
            <track kind="captions" />
        </video>
    </div>
{/if}

<style>
    .screensaver-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999999;
        background: black;
        cursor: none;
        /* Mobile-specific: ensure it covers iOS safe areas */
        padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    }
    
    .screensaver-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Mobile-specific adjustments */
    @media (max-width: 768px) {
        .screensaver-overlay {
            /* Ensure proper sizing on mobile including notch areas */
            width: 100%;
            height: 100%;
            min-height: 100vh;
            min-height: -webkit-fill-available;
        }
        
        .screensaver-video {
            /* Better video positioning on mobile */
            object-position: center center;
        }
    }
</style>
