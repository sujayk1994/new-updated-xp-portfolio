<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import { runningPrograms } from '../../../lib/store';

    export let id;
    export let window;
    export let self;
    export let parentNode = null;
    export let fs_item = null;
    export let exec_path = null;

    let audioElement;
    let isPlaying = false;
    let currentTime = 0;
    let duration = 0;

    export let options = {
        title: 'Winamp',
        min_width: 275,
        min_height: 116,
        width: 275,
        height: 116,
        icon: '/images/xp/icons/Winamp.png',
        id: id,
        resizable: false
    };

    function togglePlay() {
        if (audioElement) {
            if (isPlaying) {
                audioElement.pause();
            } else {
                audioElement.play();
            }
        }
    }

    function handleTimeUpdate() {
        if (audioElement) {
            currentTime = audioElement.currentTime;
            duration = audioElement.duration;
        }
    }

    function handlePlayPause() {
        isPlaying = !audioElement.paused;
    }

    function destroy() {
        if (audioElement) audioElement.pause();
        runningPrograms.update(programs => programs.filter(p => p !== self));
        self?.$destroy();
    }
</script>

<Window bind:this={window} {options} {self} on:close={destroy}>
    <div class="winamp">
        <audio 
            bind:this={audioElement}
            on:timeupdate={handleTimeUpdate}
            on:play={handlePlayPause}
            on:pause={handlePlayPause}
            src="https://cdn.jsdelivr.net/gh/captbaritone/webamp@43434d82cfe0e37286dbbe0666072dc3190a83bc/mp3/llama-2.91.mp3"
        />
        
        <div class="player-skin">
            <div class="title-bar">Winamp</div>
            
            <div class="main-window">
                <div class="display">
                    <div class="display-text">Now Playing</div>
                    <div class="time">{Math.floor(currentTime)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</div>
                </div>
                
                <div class="controls">
                    <button class="btn btn-prev">◀◀</button>
                    <button class="btn btn-play" on:click={togglePlay}>
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button class="btn btn-next">▶▶</button>
                    <button class="btn btn-stop">⏹</button>
                    <button class="btn btn-eject">⏏</button>
                </div>
                
                <div class="progress">
                    <input type="range" min="0" max={duration || 100} value={currentTime} 
                        on:input={(e) => { if(audioElement) audioElement.currentTime = e.target.value; }}
                        class="progress-bar"
                    />
                </div>
                
                <div class="volume">
                    Volume:
                    <input type="range" min="0" max="100" value="100" 
                        on:input={(e) => { if(audioElement) audioElement.volume = e.target.value / 100; }}
                        class="volume-slider"
                    />
                </div>
            </div>
        </div>
    </div>
</Window>

<style>
    .winamp {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #00aa00 0%, #004400 100%);
        padding: 2px;
        box-sizing: border-box;
        font-family: 'MS Sans Serif', Arial, sans-serif;
        font-size: 11px;
    }

    .player-skin {
        width: 100%;
        height: 100%;
        background: #00aa00;
        display: flex;
        flex-direction: column;
        border: 2px solid;
        border-color: #dfdfdf #808080 #808080 #dfdfdf;
        box-shadow: inset 1px 1px #ffffff, inset -1px -1px #000000;
    }

    .title-bar {
        background: linear-gradient(90deg, #000080 0%, #1084d7 100%);
        color: white;
        padding: 2px 4px;
        font-weight: bold;
        font-size: 11px;
    }

    .main-window {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 4px;
    }

    .display {
        background: #003300;
        color: #00ff00;
        padding: 4px;
        text-align: center;
        font-family: 'Courier New', monospace;
        font-size: 10px;
        border: inset 1px;
        border-color: #404040 #dfdfdf;
    }

    .display-text {
        font-size: 9px;
        opacity: 0.7;
    }

    .time {
        font-weight: bold;
        margin-top: 2px;
    }

    .controls {
        display: flex;
        gap: 2px;
        justify-content: center;
    }

    .btn {
        width: 24px;
        height: 18px;
        padding: 0;
        font-size: 10px;
        background: #00aa00;
        border: 2px solid;
        border-color: #dfdfdf #404040 #404040 #dfdfdf;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .btn:active {
        border-color: #404040 #dfdfdf #dfdfdf #404040;
    }

    .progress {
        display: flex;
        gap: 2px;
        align-items: center;
    }

    .progress-bar {
        flex: 1;
        height: 8px;
        cursor: pointer;
    }

    .volume {
        display: flex;
        gap: 4px;
        align-items: center;
        font-size: 9px;
    }

    .volume-slider {
        width: 40px;
        height: 6px;
    }
</style>
