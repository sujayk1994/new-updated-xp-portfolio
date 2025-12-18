<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import Window from '../../../lib/components/xp/Window.svelte';
    import { runningPrograms } from '../../../lib/store';

    export let id;
    export let window;
    export let self;
    export let parentNode = null;
    export let fs_item = null;
    export let exec_path = null;

    let containerRef;
    let webampInstance = null;
    let isLoaded = false;

    export let options = {
        title: 'Winamp',
        min_width: 275,
        min_height: 116,
        width: 275,
        height: 350,
        icon: '/images/xp/icons/Winamp.png',
        id: id,
        resizable: false,
        hide_titlebar: true
    };

    onMount(async () => {
        if (!browser || !containerRef) return;
        
        try {
            const Webamp = (await import('webamp')).default;
            
            webampInstance = new Webamp({
                initialTracks: [
                    {
                        metaData: {
                            artist: "DJ Mike Llama",
                            title: "Llama Whippin' Intro"
                        },
                        url: "https://cdn.jsdelivr.net/gh/captbaritone/webamp@43434d82cfe0e37286dbbe0666072dc3190a83bc/mp3/llama-2.91.mp3",
                        duration: 5.32
                    }
                ],
                initialSkin: {
                    url: "https://cdn.jsdelivr.net/gh/nicmlu/public_files/base-2.91.wsz"
                }
            });
            
            await webampInstance.renderWhenReady(containerRef);
            isLoaded = true;
        } catch (error) {
            console.error('Winamp error:', error);
        }
    });

    onDestroy(() => {
        if (webampInstance) {
            try {
                webampInstance.dispose();
            } catch (e) {
                console.warn('Dispose error:', e);
            }
        }
        destroy();
    });

    function destroy() {
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }
</script>

<Window bind:this={window} {options} {self} on:close={destroy}>
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
</style>
