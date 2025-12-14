<script>
    import { onMount, onDestroy, tick } from 'svelte';
    import { runningPrograms, systemVolume, zIndex, hardDrive } from '../../../lib/store';
    import * as utils from '../../../lib/utils';
    import { get } from 'idb-keyval';

    export let id;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;

    const SKIN_PATH = '/images/xp/winamp_skin';
    
    let supported_audio_types = ['.mp3', '.wav', '.ogg', '.flac', '.aac'];

    let audio_node;
    let currentTime = 0;
    let duration = 0;
    let paused = true;
    let player_volume = 0.8;
    let loop = false;
    let shuffle = false;
    let trackName = 'Winamp 2.91';
    let createdUrls = [];
    let playerNode;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let position = { x: 100, y: 100 };
    let myZIndex = 100;
    let scrollOffset = 0;
    let scrollInterval;
    let seekDragging = false;
    let volumeDragging = false;
    let minimized = false;
    let visible = true;

    let prevPressed = false;
    let playPressed = false;
    let pausePressed = false;
    let stopPressed = false;
    let nextPressed = false;
    let ejectPressed = false;

    export let window = {
        get z_index() { return myZIndex; },
        get minimized() { return minimized; },
        get maximized() { return false; },
        on_click_minimize() {
            minimized = true;
            visible = false;
        },
        focus() {
            bringToFront();
            minimized = false;
            visible = true;
        },
        restore() {
            minimized = false;
            visible = true;
            bringToFront();
        }
    };

    $: audio_volume = player_volume * $systemVolume;
    $: minutes = Math.floor(currentTime / 60);
    $: seconds = Math.floor(currentTime % 60);
    $: seekPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    $: volumeFrame = Math.floor(player_volume * 27);

    onMount(async () => {
        if (fs_item && supported_audio_types.includes(fs_item.ext?.toLowerCase())) {
            await loadTrack(fs_item);
        }
        startTitleScroll();
        bringToFront();
    });

    onDestroy(() => {
        if (scrollInterval) clearInterval(scrollInterval);
        createdUrls.forEach(url => URL.revokeObjectURL(url));
    });

    function bringToFront() {
        zIndex.update(z => z + 1);
        myZIndex = $zIndex;
        window = { ...window };
    }

    function startTitleScroll() {
        scrollInterval = setInterval(() => {
            if (!paused && trackName.length > 20) {
                scrollOffset = (scrollOffset + 1) % (trackName.length * 5 + 30);
            }
        }, 150);
    }

    async function loadTrack(item) {
        if (!item) return;
        
        let url;
        if (item.storage_type == 'local') {
            let file = await get(item.url);
            url = URL.createObjectURL(file);
            createdUrls.push(url);
        } else if (item.storage_type == 'remote') {
            url = item.url;
        }

        if (url) {
            await tick();
            audio_node.src = url;
            trackName = item.name.replace(item.ext, '');
            audio_node.play();
        }
    }

    async function open_file() {
        const OpenModal = (await import('../../../lib/components/xp/OpenModal.svelte')).default;
        let modal = new OpenModal({
            target: parentNode || document.body,
            props: { filetypes: ['.mp3', '.wav', '.ogg', '.flac', '.aac'], filetypes_desc: 'Audio Files' }
        });
        modal.self = modal;
        modal.on_open = () => {
            let item = $hardDrive[modal.selected_items[0]];
            loadTrack(item);
            modal.destroy();
        };
    }

    export function destroy() {
        if (scrollInterval) clearInterval(scrollInterval);
        createdUrls.forEach(url => URL.revokeObjectURL(url));
        createdUrls = [];
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    export let options = {
        title: 'Winamp',
        min_width: 275,
        min_height: 116,
        width: 275,
        height: 116,
        icon: '/images/xp/icons/AudioPlayer.png',
        id: id,
        exec_path
    };

    function play() {
        if (paused) {
            audio_node.play();
        } else {
            audio_node.pause();
        }
    }

    function stop() {
        audio_node.pause();
        audio_node.currentTime = 0;
        currentTime = 0;
    }

    function prevTrack() {
        audio_node.currentTime = 0;
    }

    function nextTrack() {
        audio_node.currentTime = duration || 0;
    }

    function onMouseDown(e) {
        if (e.target.closest('.control-button') || e.target.closest('.seek-bar') || e.target.closest('.volume-slider')) return;
        isDragging = true;
        dragOffset = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        bringToFront();
    }

    function onMouseMove(e) {
        if (isDragging) {
            position = {
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            };
        }
        if (seekDragging && duration > 0) {
            const seekBar = playerNode.querySelector('.seek-bar');
            const rect = seekBar.getBoundingClientRect();
            let percent = (e.clientX - rect.left) / rect.width;
            percent = Math.max(0, Math.min(1, percent));
            currentTime = percent * duration;
        }
        if (volumeDragging) {
            const volSlider = playerNode.querySelector('.volume-slider');
            const rect = volSlider.getBoundingClientRect();
            let percent = (e.clientX - rect.left) / rect.width;
            player_volume = Math.max(0, Math.min(1, percent));
        }
    }

    function onMouseUp() {
        isDragging = false;
        seekDragging = false;
        volumeDragging = false;
    }

    function onSeekStart(e) {
        if (duration > 0) {
            seekDragging = true;
            const rect = e.currentTarget.getBoundingClientRect();
            let percent = (e.clientX - rect.left) / rect.width;
            percent = Math.max(0, Math.min(1, percent));
            currentTime = percent * duration;
        }
    }

    function onVolumeStart(e) {
        volumeDragging = true;
        const rect = e.currentTarget.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;
        player_volume = Math.max(0, Math.min(1, percent));
    }

    async function on_drop(e) {
        e.preventDefault();
        for (let file of e.dataTransfer.files) {
            if (supported_audio_types.includes(utils.extname(file.name))) {
                let url = URL.createObjectURL(file);
                createdUrls.push(url);
                await tick();
                audio_node.src = url;
                trackName = file.name.replace(utils.extname(file.name), '');
                audio_node.play();
                break;
            }
        }
    }

    function getDigitOffset(digit) {
        const digitMap = {
            '0': 0, '1': 9, '2': 18, '3': 27, '4': 36,
            '5': 45, '6': 54, '7': 63, '8': 72, '9': 81
        };
        return digitMap[digit] || 90;
    }
</script>

{#if visible}
<div 
    class="winamp-player"
    bind:this={playerNode}
    style="left: {position.x}px; top: {position.y}px; z-index: {myZIndex};"
    on:mousedown={onMouseDown}
    on:drop={on_drop}
    on:dragover|preventDefault
>
    <audio 
        src="" 
        bind:this={audio_node} 
        {loop} 
        bind:currentTime 
        bind:duration 
        bind:paused 
        bind:volume={audio_volume}
    ></audio>

    <div class="titlebar">
        <div class="clutterbar"></div>
        <div class="title-text">
            {#if trackName.length > 20}
                <div class="marquee" style="transform: translateX(-{scrollOffset}px);">
                    {trackName} *** {trackName}
                </div>
            {:else}
                {trackName}
            {/if}
        </div>
        <div class="title-buttons">
            <button class="tb-btn minimize" on:click={() => window.on_click_minimize()}></button>
            <button class="tb-btn shade" on:click={() => {}}></button>
            <button class="tb-btn close" on:click={destroy}></button>
        </div>
    </div>

    <div class="display-area">
        <div class="time-display">
            <div class="digit" style="background-position: -{getDigitOffset(String(minutes).padStart(2,'0')[0])}px 0;"></div>
            <div class="digit" style="background-position: -{getDigitOffset(String(minutes).padStart(2,'0')[1])}px 0;"></div>
            <div class="digit-colon"></div>
            <div class="digit" style="background-position: -{getDigitOffset(String(seconds).padStart(2,'0')[0])}px 0;"></div>
            <div class="digit" style="background-position: -{getDigitOffset(String(seconds).padStart(2,'0')[1])}px 0;"></div>
        </div>

        <div class="play-status">
            <div class="status-icon {paused ? 'paused' : 'playing'}"></div>
        </div>

        <div class="stereo-mono">
            <div class="stereo-indicator active"></div>
            <div class="mono-indicator"></div>
        </div>

        <div class="visualizer">
            {#each Array(19) as _, i}
                <div class="viz-bar" style="height: {paused ? 2 : Math.random() * 15 + 2}px;"></div>
            {/each}
        </div>

        <div class="kbps-khz">
            <div class="kbps">128</div>
            <div class="khz">44</div>
        </div>
    </div>

    <div class="song-title">
        <div class="title-scroll" style="transform: translateX(-{scrollOffset}px);">
            {trackName.toUpperCase()} *** {trackName.toUpperCase()}
        </div>
    </div>

    <div class="seek-bar control-button" on:mousedown={onSeekStart}>
        <div class="seek-bg"></div>
        <div class="seek-thumb" style="left: {seekPercent}%;"></div>
    </div>

    <div class="bottom-section">
        <div class="controls">
            <button 
                class="control-button prev {prevPressed ? 'pressed' : ''}"
                on:mousedown={() => prevPressed = true}
                on:mouseup={() => { prevPressed = false; prevTrack(); }}
                on:mouseleave={() => prevPressed = false}
            ></button>
            <button 
                class="control-button play-btn {playPressed ? 'pressed' : ''}"
                on:mousedown={() => playPressed = true}
                on:mouseup={() => { playPressed = false; if(paused) play(); }}
                on:mouseleave={() => playPressed = false}
            ></button>
            <button 
                class="control-button pause-btn {pausePressed ? 'pressed' : ''}"
                on:mousedown={() => pausePressed = true}
                on:mouseup={() => { pausePressed = false; if(!paused) play(); }}
                on:mouseleave={() => pausePressed = false}
            ></button>
            <button 
                class="control-button stop-btn {stopPressed ? 'pressed' : ''}"
                on:mousedown={() => stopPressed = true}
                on:mouseup={() => { stopPressed = false; stop(); }}
                on:mouseleave={() => stopPressed = false}
            ></button>
            <button 
                class="control-button next {nextPressed ? 'pressed' : ''}"
                on:mousedown={() => nextPressed = true}
                on:mouseup={() => { nextPressed = false; nextTrack(); }}
                on:mouseleave={() => nextPressed = false}
            ></button>
            <button 
                class="control-button eject {ejectPressed ? 'pressed' : ''}"
                on:mousedown={() => ejectPressed = true}
                on:mouseup={() => { ejectPressed = false; open_file(); }}
                on:mouseleave={() => ejectPressed = false}
            ></button>
        </div>

        <div class="sliders">
            <div class="volume-slider control-button" on:mousedown={onVolumeStart}>
                <div class="vol-bg"></div>
                <div class="vol-thumb" style="left: {player_volume * 100}%;"></div>
            </div>
            <div class="balance-slider">
                <div class="bal-bg"></div>
                <div class="bal-thumb"></div>
            </div>
        </div>

        <div class="eq-pl-buttons">
            <button class="eq-btn"></button>
            <button class="pl-btn"></button>
        </div>

        <div class="shuffle-repeat">
            <button class="shuffle-btn {shuffle ? 'active' : ''}" on:click={() => shuffle = !shuffle}></button>
            <button class="repeat-btn {loop ? 'active' : ''}" on:click={() => loop = !loop}></button>
        </div>
    </div>
</div>
{/if}

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp} />
<svelte:options accessors={true} />

<style>
    .winamp-player {
        position: absolute;
        width: 275px;
        height: 116px;
        background: url('/images/xp/winamp_skin/main.bmp') no-repeat;
        background-size: 275px 116px;
        user-select: none;
        font-family: Arial, sans-serif;
        image-rendering: pixelated;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.5);
    }

    .titlebar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 14px;
        display: flex;
        align-items: center;
        cursor: move;
        background: url('/images/xp/winamp_skin/titlebar.bmp') no-repeat;
        background-position: 0 0;
    }

    .clutterbar {
        width: 8px;
        height: 43px;
        position: absolute;
        left: 6px;
        top: 17px;
    }

    .title-text {
        flex: 1;
        color: transparent;
        font-size: 8px;
        text-align: center;
        overflow: hidden;
    }

    .title-buttons {
        position: absolute;
        right: 0;
        top: 3px;
        display: flex;
        gap: 0;
    }

    .tb-btn {
        width: 9px;
        height: 9px;
        border: none;
        cursor: pointer;
        background: url('/images/xp/winamp_skin/titlebar.bmp') no-repeat;
    }

    .tb-btn.minimize {
        background-position: -9px -18px;
    }
    .tb-btn.minimize:active {
        background-position: 0 -18px;
    }

    .tb-btn.shade {
        background-position: -9px -27px;
    }
    .tb-btn.shade:active {
        background-position: 0 -27px;
    }

    .tb-btn.close {
        background-position: -18px -9px;
        margin-right: 2px;
    }
    .tb-btn.close:active {
        background-position: -9px -9px;
    }

    .display-area {
        position: absolute;
        top: 22px;
        left: 11px;
        width: 93px;
        height: 37px;
    }

    .time-display {
        position: absolute;
        left: 36px;
        top: 8px;
        display: flex;
        gap: 0;
    }

    .digit {
        width: 9px;
        height: 13px;
        background: url('/images/xp/winamp_skin/numbers.bmp') no-repeat;
        background-size: auto 13px;
    }

    .digit-colon {
        width: 5px;
        height: 13px;
        background: url('/images/xp/winamp_skin/numbers.bmp') no-repeat;
        background-position: -99px 0;
        background-size: auto 13px;
    }

    .play-status {
        position: absolute;
        left: 26px;
        top: 28px;
    }

    .status-icon {
        width: 9px;
        height: 9px;
        background: url('/images/xp/winamp_skin/playpaus.bmp') no-repeat;
    }
    .status-icon.playing {
        background-position: 0 0;
    }
    .status-icon.paused {
        background-position: -9px 0;
    }

    .stereo-mono {
        position: absolute;
        right: 8px;
        top: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .stereo-indicator, .mono-indicator {
        width: 29px;
        height: 12px;
        background: url('/images/xp/winamp_skin/monoster.bmp') no-repeat;
    }
    .stereo-indicator {
        background-position: 0 0;
    }
    .stereo-indicator.active {
        background-position: 0 -12px;
    }
    .mono-indicator {
        background-position: -29px 0;
    }
    .mono-indicator.active {
        background-position: -29px -12px;
    }

    .visualizer {
        position: absolute;
        left: 24px;
        top: 43px;
        width: 76px;
        height: 16px;
        display: flex;
        gap: 1px;
        align-items: flex-end;
        background: #000;
    }

    .viz-bar {
        width: 3px;
        background: linear-gradient(to top, #00ff00, #ffff00, #ff0000);
        transition: height 0.1s;
    }

    .kbps-khz {
        position: absolute;
        left: 0;
        top: 18px;
        display: flex;
        flex-direction: column;
        font-size: 6px;
        color: #00ff00;
    }

    .song-title {
        position: absolute;
        top: 24px;
        left: 111px;
        width: 155px;
        height: 15px;
        overflow: hidden;
        background: #000;
    }

    .title-scroll {
        white-space: nowrap;
        color: #00ff00;
        font-size: 8px;
        font-family: "Small Fonts", Arial, sans-serif;
        line-height: 15px;
    }

    .seek-bar {
        position: absolute;
        top: 72px;
        left: 16px;
        width: 248px;
        height: 10px;
        cursor: pointer;
    }

    .seek-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 10px;
        background: url('/images/xp/winamp_skin/posbar.bmp') no-repeat;
        background-position: 0 0;
    }

    .seek-thumb {
        position: absolute;
        top: 0;
        width: 29px;
        height: 10px;
        background: url('/images/xp/winamp_skin/posbar.bmp') no-repeat;
        background-position: 0 -10px;
        transform: translateX(-50%);
        cursor: pointer;
    }

    .bottom-section {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30px;
    }

    .controls {
        position: absolute;
        left: 16px;
        bottom: 10px;
        display: flex;
        gap: 0;
    }

    .control-button {
        border: none;
        cursor: pointer;
        background: url('/images/xp/winamp_skin/cbuttons.bmp') no-repeat;
    }

    .control-button.prev {
        width: 23px;
        height: 18px;
        background-position: 0 0;
    }
    .control-button.prev.pressed {
        background-position: 0 -18px;
    }

    .control-button.play-btn {
        width: 23px;
        height: 18px;
        background-position: -23px 0;
    }
    .control-button.play-btn.pressed {
        background-position: -23px -18px;
    }

    .control-button.pause-btn {
        width: 23px;
        height: 18px;
        background-position: -46px 0;
    }
    .control-button.pause-btn.pressed {
        background-position: -46px -18px;
    }

    .control-button.stop-btn {
        width: 23px;
        height: 18px;
        background-position: -69px 0;
    }
    .control-button.stop-btn.pressed {
        background-position: -69px -18px;
    }

    .control-button.next {
        width: 22px;
        height: 18px;
        background-position: -92px 0;
    }
    .control-button.next.pressed {
        background-position: -92px -18px;
    }

    .control-button.eject {
        width: 22px;
        height: 16px;
        background-position: -114px 0;
    }
    .control-button.eject.pressed {
        background-position: -114px -16px;
    }

    .sliders {
        position: absolute;
        left: 107px;
        bottom: 7px;
        display: flex;
        gap: 10px;
    }

    .volume-slider {
        width: 68px;
        height: 14px;
        position: relative;
        cursor: pointer;
    }

    .vol-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        background: url('/images/xp/winamp_skin/volume.bmp') no-repeat;
        background-size: 68px auto;
    }

    .vol-thumb {
        position: absolute;
        top: 0;
        width: 14px;
        height: 11px;
        background: url('/images/xp/winamp_skin/volume.bmp') no-repeat;
        background-position: 0 -422px;
        transform: translateX(-50%);
    }

    .balance-slider {
        width: 38px;
        height: 14px;
        position: relative;
    }

    .bal-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        background: url('/images/xp/winamp_skin/balance.bmp') no-repeat;
        background-size: 38px auto;
    }

    .bal-thumb {
        position: absolute;
        top: 0;
        left: 50%;
        width: 14px;
        height: 11px;
        background: url('/images/xp/winamp_skin/balance.bmp') no-repeat;
        background-position: 0 -422px;
        transform: translateX(-50%);
    }

    .eq-pl-buttons {
        position: absolute;
        right: 48px;
        bottom: 8px;
        display: flex;
        gap: 3px;
    }

    .eq-btn, .pl-btn {
        width: 23px;
        height: 12px;
        border: none;
        cursor: pointer;
        background: url('/images/xp/winamp_skin/shufrep.bmp') no-repeat;
    }

    .eq-btn {
        background-position: -0px -61px;
    }
    .eq-btn:active {
        background-position: -46px -61px;
    }

    .pl-btn {
        background-position: -23px -61px;
    }
    .pl-btn:active {
        background-position: -69px -61px;
    }

    .shuffle-repeat {
        position: absolute;
        right: 7px;
        bottom: 8px;
        display: flex;
        gap: 4px;
    }

    .shuffle-btn, .repeat-btn {
        width: 28px;
        height: 15px;
        border: none;
        cursor: pointer;
        background: url('/images/xp/winamp_skin/shufrep.bmp') no-repeat;
    }

    .shuffle-btn {
        background-position: -28px -0px;
    }
    .shuffle-btn.active {
        background-position: -28px -15px;
    }

    .repeat-btn {
        background-position: 0 -30px;
    }
    .repeat-btn.active {
        background-position: 0 -45px;
    }

    .marquee {
        white-space: nowrap;
    }
</style>
