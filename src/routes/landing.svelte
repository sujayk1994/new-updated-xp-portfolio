<script>
    import { createEventDispatcher } from 'svelte';
    import * as utils from '../lib/utils';
    
    let dispatcher = createEventDispatcher();
    
    async function startWindows() {
        await utils.unlockAudio();
        dispatcher('load_page', {url: './xp/starting.svelte'});
    }
</script>

<div class="landing-screen">
    <img src="/images/bios_splash.jpg" alt="BIOS" class="bios-image" />
    
    <div class="button-container">
        <button class="retro-button" on:click={startWindows}>
            Start Windows Normally
        </button>
    </div>
</div>

<style>
    .landing-screen {
        position: absolute;
        inset: 0;
        background: #000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'Consolas', 'Courier New', monospace;
    }
    
    .bios-image {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
    }
    
    .button-container {
        margin-top: 40px;
    }
    
    .retro-button {
        background: linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 50%, #1a1a1a 100%);
        border: 2px solid #666;
        border-top-color: #888;
        border-left-color: #888;
        border-bottom-color: #333;
        border-right-color: #333;
        color: #fff;
        font-family: 'Consolas', 'Courier New', monospace;
        font-size: 18px;
        padding: 12px 32px;
        cursor: pointer;
        text-shadow: 1px 1px 2px #000;
        box-shadow: 
            inset 1px 1px 0 rgba(255,255,255,0.1),
            inset -1px -1px 0 rgba(0,0,0,0.3),
            2px 2px 8px rgba(0,0,0,0.5);
        transition: all 0.1s ease;
    }
    
    .retro-button:hover {
        background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 50%, #2a2a2a 100%);
        border-top-color: #999;
        border-left-color: #999;
    }
    
    .retro-button:active {
        background: linear-gradient(180deg, #2a2a2a 0%, #3a3a3a 50%, #4a4a4a 100%);
        border-top-color: #333;
        border-left-color: #333;
        border-bottom-color: #888;
        border-right-color: #888;
        transform: translateY(1px);
    }
</style>
