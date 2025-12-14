<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import { onMount, onDestroy } from 'svelte';
    import { runningPrograms, hardDrive } from '../../../lib/store';
    import { get as idbGet } from 'idb-keyval';
    import * as utils from '../../../lib/utils';
    import { browser } from '$app/environment';

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;

    let webampInstance = null;
    let containerRef;
    let supported_audio_types = ['.mp3', '.wav', '.ogg', '.flac', '.aac'];
    let createdUrls = [];

    onMount(async () => {
        if (!browser) return;
        
        try {
            const Webamp = (await import('webamp')).default;
            
            let initialTracks = [];
            
            if (fs_item && supported_audio_types.includes(fs_item.ext?.toLowerCase())) {
                let url = await getFileUrl(fs_item);
                if (url) {
                    initialTracks.push({
                        metaData: {
                            artist: "Unknown Artist",
                            title: fs_item.name.replace(fs_item.ext, '')
                        },
                        url: url
                    });
                }
            }

            webampInstance = new Webamp({
                initialTracks: initialTracks.length > 0 ? initialTracks : [
                    {
                        metaData: {
                            artist: "DJ Mike Llama",
                            title: "Llama Whippin' Intro"
                        },
                        url: "https://cdn.webampskins.org/winamp/demo.mp3"
                    }
                ]
            });

            await webampInstance.renderWhenReady(containerRef);
            
            if (initialTracks.length > 0) {
                webampInstance.play();
            }

            webampInstance.onClose(() => {
                destroy();
            });
        } catch (error) {
            console.error('Winamp initialization error:', error);
        }
    });

    async function getFileUrl(item) {
        if (!item) return null;
        
        if (item.storage_type == 'local') {
            let file = await idbGet(item.url);
            let url = URL.createObjectURL(file);
            createdUrls.push(url);
            return url;
        } else if (item.storage_type == 'remote') {
            return item.url;
        }
        return null;
    }

    export async function loadTrack(item) {
        if (!webampInstance || !item) return;
        
        let url = await getFileUrl(item);
        if (url) {
            webampInstance.setTracksToPlay([{
                metaData: {
                    artist: "Unknown Artist",
                    title: item.name.replace(item.ext, '')
                },
                url: url
            }]);
            webampInstance.play();
        }
    }

    onDestroy(() => {
        if (webampInstance) {
            webampInstance.dispose();
        }
    });

    export function destroy() {
        if (webampInstance) {
            webampInstance.dispose();
        }
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
        height: 350,
        icon: '/images/xp/icons/Winamp.png',
        id: id,
        exec_path,
        resizable: false,
        hide_titlebar: true
    };
</script>

<Window bind:this={window} {options} program={self}>
    <div class="winamp-container" bind:this={containerRef}>
    </div>
</Window>

<style>
    .winamp-container {
        width: 100%;
        height: 100%;
        position: relative;
        background: #1e1e1e;
    }

    :global(.winamp-container #webamp) {
        position: relative !important;
    }

    :global(.winamp-container .webamp-status) {
        display: none;
    }
</style>
