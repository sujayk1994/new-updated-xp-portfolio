<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import RangeSlider from "svelte-range-slider-pips";
    import { onMount, onDestroy, tick } from 'svelte';
    import { runningPrograms, systemVolume, zIndex, hardDrive } from '../../../lib/store';
    import * as utils from '../../../lib/utils';
    import { tooltip } from '$lib/components/xp/tooltip.js';
    import { get, set } from 'idb-keyval';

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;

    let supported_audio_types = ['.mp3', '.wav', '.ogg', '.flac', '.aac'];

    let audio_node;
    let currentTime = 0;
    let duration = 0;
    let paused = true;
    let player_volume = 0.8;
    let loop = false;
    let shuffle = false;
    let playlist = [];
    let currentTrackIndex = 0;
    let trackName = 'No track loaded';
    let createdUrls = [];
    let visualizerBars = Array(20).fill(0);
    let animationFrame;
    let audioContext;
    let analyser;
    let dataArray;

    $: audio_volume = player_volume * $systemVolume;

    onMount(async () => {
        if (fs_item && supported_audio_types.includes(fs_item.ext?.toLowerCase())) {
            await loadTrack(fs_item);
        }
        startVisualizer();
    });

    onDestroy(() => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        if (audioContext) {
            audioContext.close();
        }
        createdUrls.forEach(url => URL.revokeObjectURL(url));
    });

    function startVisualizer() {
        function animate() {
            if (analyser && dataArray) {
                analyser.getByteFrequencyData(dataArray);
                const step = Math.floor(dataArray.length / 20);
                visualizerBars = Array(20).fill(0).map((_, i) => {
                    const value = dataArray[i * step];
                    return (value / 255) * 100;
                });
            } else if (!paused) {
                visualizerBars = visualizerBars.map(() => Math.random() * 60 + 20);
            } else {
                visualizerBars = visualizerBars.map(v => Math.max(0, v - 5));
            }
            animationFrame = requestAnimationFrame(animate);
        }
        animate();
    }

    async function setupAudioContext() {
        if (!audioContext && audio_node) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                const source = audioContext.createMediaElementSource(audio_node);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
                dataArray = new Uint8Array(analyser.frequencyBinCount);
            } catch (e) {
                console.log('Audio context not available');
            }
        }
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
            window.update_title('Audio Player - ' + trackName);
            audio_node.play();
            setupAudioContext();
        }
    }

    async function open_file() {
        const OpenModal = (await import('../../../lib/components/xp/OpenModal.svelte')).default;
        let modal = new OpenModal({
            target: window.node_ref,
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
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        if (audioContext) {
            audioContext.close();
        }
        createdUrls.forEach(url => URL.revokeObjectURL(url));
        createdUrls = [];
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    export let options = {
        title: 'Audio Player',
        min_width: 320,
        min_height: 280,
        width: 380,
        height: 320,
        icon: '/images/xp/icons/AudioPlayer.png',
        id: id,
        exec_path
    };

    function play() {
        if (paused) {
            audio_node.play();
            setupAudioContext();
        } else {
            audio_node.pause();
        }
    }

    function stop() {
        audio_node.pause();
        audio_node.currentTime = 0;
        currentTime = 0;
    }

    function seek(e) {
        currentTime = e.detail.value;
    }

    function next5s() {
        currentTime = Math.min(currentTime + 5, duration);
    }

    function back5s() {
        currentTime = Math.max(currentTime - 5, 0);
    }

    function change_volume(e) {
        player_volume = e.detail.value;
    }

    function on_key_pressed(e) {
        if (window.z_index != $zIndex || isNaN(duration)) return;
        e.preventDefault();
        if (e.key == 'ArrowRight') {
            next5s();
        } else if (e.key == 'ArrowLeft') {
            back5s();
        } else if (e.key == 'ArrowUp') {
            player_volume = Math.min(1, player_volume + 0.05);
        } else if (e.key == 'ArrowDown') {
            player_volume = Math.max(0, player_volume - 0.05);
        } else if (e.key == ' ') {
            play();
        }
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
                window.update_title('Audio Player - ' + trackName);
                audio_node.play();
                setupAudioContext();
                break;
            }
        }
    }

    function on_drop_over(e) {
        e.preventDefault();
    }
</script>

<Window options={options} bind:this={window} on_click_close={destroy}>
    <div slot="content" class="absolute inset-0 flex flex-col overflow-hidden" 
         on:drop={on_drop} on:dragover={on_drop_over}
         style="background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);">
        
        <audio src="" bind:this={audio_node} {loop} 
               bind:currentTime bind:duration bind:paused bind:volume={audio_volume}></audio>

        <div class="flex-1 flex flex-col items-center justify-center p-4">
            <div class="w-full h-24 flex items-end justify-center gap-0.5 mb-4">
                {#each visualizerBars as height, i}
                    <div class="w-3 rounded-t transition-all duration-75"
                         style="height: {height}%; background: linear-gradient(180deg, #f39c12 0%, #e74c3c 50%, #9b59b6 100%);
                                box-shadow: 0 0 8px rgba(243, 156, 18, 0.5);">
                    </div>
                {/each}
            </div>

            <div class="w-full bg-black/40 rounded-lg p-3 mb-4 border border-gray-700">
                <div class="text-center text-green-400 font-mono text-sm truncate mb-2"
                     style="text-shadow: 0 0 10px rgba(34, 197, 94, 0.8);">
                    {trackName}
                </div>
                <div class="text-center text-green-300 font-mono text-xs">
                    {utils.format_time(currentTime)} / {isNaN(duration) ? '0:00' : utils.format_time(duration)}
                </div>
            </div>

            <div class="w-full mb-4">
                <RangeSlider max={parseInt(duration) || 100} values={[parseInt(currentTime)]} 
                             springValues={{ stiffness: 0.3, damping: 1 }} on:change={seek}
                             id="audio-player-slider" />
            </div>

            <div class="flex flex-row items-center justify-center gap-2 mb-4">
                <button use:tooltip tooltip="Rewind 5s [←]" disabled={isNaN(duration)} 
                        class="w-10 h-10 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 
                               hover:from-gray-500 hover:to-gray-700 border border-gray-500
                               flex items-center justify-center group disabled:opacity-50"
                        on:click={back5s}>
                    <svg class="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z"/>
                    </svg>
                </button>

                <button use:tooltip tooltip="Stop" disabled={isNaN(duration)} 
                        class="w-10 h-10 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 
                               hover:from-gray-500 hover:to-gray-700 border border-gray-500
                               flex items-center justify-center group disabled:opacity-50"
                        on:click={stop}>
                    <svg class="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/>
                    </svg>
                </button>

                <button use:tooltip tooltip="Play/Pause [Space]" 
                        class="w-14 h-14 rounded-full bg-gradient-to-b from-orange-500 to-orange-700 
                               hover:from-orange-400 hover:to-orange-600 border-2 border-orange-400
                               flex items-center justify-center shadow-lg"
                        style="box-shadow: 0 0 20px rgba(249, 115, 22, 0.5);"
                        on:click={play}>
                    {#if paused}
                        <svg class="w-6 h-6 fill-white ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
                        </svg>
                    {:else}
                        <svg class="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/>
                        </svg>
                    {/if}
                </button>

                <button use:tooltip tooltip="Forward 5s [→]" disabled={isNaN(duration)} 
                        class="w-10 h-10 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 
                               hover:from-gray-500 hover:to-gray-700 border border-gray-500
                               flex items-center justify-center group disabled:opacity-50"
                        on:click={next5s}>
                    <svg class="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z"/>
                    </svg>
                </button>

                <button use:tooltip tooltip="Loop" 
                        class="w-10 h-10 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 
                               hover:from-gray-500 hover:to-gray-700 border border-gray-500
                               flex items-center justify-center {loop ? 'ring-2 ring-orange-400' : ''}"
                        on:click={() => loop = !loop}>
                    <svg class="w-4 h-4 {loop ? 'fill-orange-400' : 'fill-white'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z"/>
                    </svg>
                </button>
            </div>

            <div class="w-full flex items-center gap-3 px-4">
                <svg class="w-4 h-4 fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <path d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 searching 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 search 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/>
                </svg>
                <div class="flex-1">
                    <RangeSlider max={1} step={0.01} values={[player_volume]} 
                                 springValues={{ stiffness: 0.9, damping: 1 }}
                                 id="audio-player-volume" on:change={change_volume} />
                </div>
            </div>
        </div>

        <div class="shrink-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 
                    border-t border-gray-600 p-2 flex justify-between items-center">
            <button on:click={open_file}
                    class="text-xs bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 
                           text-white px-3 py-1.5 rounded border border-gray-500">
                Open File
            </button>
            <div class="text-xs text-gray-400">
                {paused ? 'Paused' : 'Playing'}
            </div>
        </div>
    </div>
</Window>

<svelte:options accessors={true} />

<svelte:window on:keydown={on_key_pressed} />

<style>
    :global(#audio-player-slider) {
        --range-slider: #374151;
        --range-handle-inactive: #f97316;
        --range-handle: #f97316;
        --range-handle-focus: #fb923c;
        --range-float: #f97316;
        --range-range: #f97316;
    }
    
    :global(#audio-player-volume) {
        --range-slider: #374151;
        --range-handle-inactive: #9ca3af;
        --range-handle: #d1d5db;
        --range-handle-focus: #f3f4f6;
        --range-range: #6b7280;
    }
</style>
