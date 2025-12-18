<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import WebampPlayer from '../../../lib/components/WebampPlayer.svelte';
    import { runningPrograms } from '../../../lib/store';

    export let id;
    export let window;
    export let self;
    export let parentNode = null;
    export let fs_item = null;
    export let exec_path = null;

    export let options = {
        title: 'Winamp',
        min_width: 400,
        min_height: 300,
        width: 500,
        height: 600,
        icon: '/images/xp/icons/Winamp.png',
        id: id,
        resizable: true
    };

    function destroy() {
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }
</script>

<Window bind:this={window} {options} {self} on:close={destroy}>
    <div class="winamp-window-container">
        <WebampPlayer />
    </div>
</Window>

<style>
    .winamp-window-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    :global(.winamp-window-container #webamp) {
        position: relative !important;
        width: 100% !important;
        height: 100% !important;
    }
</style>
