<script>
    import {onMount, createEventDispatcher} from 'svelte';
    import * as utils from '../../lib/utils';

    export let self;

    let fallback_timer;
    let destroyed = false;
    let isMobile = false;
    let screenReady = false;
    let audioPlayed = false;

    function checkMobile() {
        isMobile = typeof window !== 'undefined' && (
            window.innerWidth <= 768 || 
            ('ontouchstart' in window) || 
            (navigator.maxTouchPoints > 0)
        );
    }

    function cleanup() {
        if (destroyed) return;
        destroyed = true;
        clearTimeout(fallback_timer);
        if (self && typeof self.$destroy === 'function') {
            try {
                self.$destroy();
            } catch (e) {
                console.log('Welcome component cleanup');
            }
        }
    }

    onMount(() => {
        document.body.style.cursor = 'none';
        checkMobile();
        
        // Small delay to ensure welcome screen is fully rendered before playing sound
        // This fixes the issue where sound plays before welcome screen on mobile
        const soundDelay = isMobile ? 300 : 100;
        
        setTimeout(() => {
            screenReady = true;
            let welcome_audio = new Audio("/audio/xp_startup.mp3");
            welcome_audio.addEventListener("canplaythrough", (e) => {
                console.log('canplaythrough');
                if(!destroyed && screenReady && !audioPlayed){
                    audioPlayed = true;
                    welcome_audio.play().catch(async (e) => {
                    });
                }
            });

            welcome_audio.addEventListener("ended", (e) => {
                console.log("xp_startup audio ended");
                cleanup();
            });
        }, soundDelay);

        fallback_timer = setTimeout(() => {
            cleanup();
        }, 7000)

    })

    export function destroy(){
        cleanup();
    }
    
</script>


<div class="absolute inset-0 z-50 overflow-hidden flex flex-col bg-[#5a7edc] font-sans">
    <div class="h-[70px] bg-[#00309c] flex flex-row items-center shrink-0">
      
    </div>
    <div class="h-[2px] bg-[linear-gradient(45deg,#466dcd,#c7ddff,#b0c9f7,#5a7edc)] shrink-0"></div>
    <div class="grow bg-[radial-gradient(circle_at_5%_5%,#91b1ef_0,#7698e6_6%,#5a7edc_12%)] relative overflow-hidden flex items-center justify-center">
        <span class="welcome-text text-[42px] text-slate-50 italic font-bold">Welcome</span>
    </div>
  
    <div class="h-[2px] bg-[linear-gradient(45deg,#003399,#f99736,#c2814d,#00309c)] shrink-0"></div>
    <div class="h-[70px] w-full bg-[linear-gradient(90deg,#3833ac,#00309c)] shrink-0 relative">
    </div>

</div>

<style>
    .welcome-text {
        transform: translateX(-10%);
    }
    
    @media (max-width: 768px) {
        .welcome-text {
            transform: translateX(0);
            text-align: center;
        }
    }
</style>
  
<svelte:options accessors={true}></svelte:options>