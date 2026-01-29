<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import { runningPrograms, zIndex } from '../../../lib/store'
    import DumbProgress from '../../../lib/components/xp/DumbProgress.svelte';

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let game_url;
    export let game_name;
    export let game_icon;
    export let exec_path;

    let iframe;
    let iframe_loaded = false;

    export async function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    let ws_size = {width: document.querySelector('#work-space').offsetWidth, height: document.querySelector('#work-space').offsetHeight};

    export let options = {
        title: game_name || 'Game',
        min_width: 640,
        min_height: 480,
        width: Math.min(ws_size.width - 20, 800),
        height: Math.min(ws_size.height - 20, 600),
        icon: game_icon || '/images/xp/icons/GameController.png',
        id: id,
        exec_path
    };

    function on_window_focused(){
        setTimeout(() => {
            if(iframe){
                iframe.contentWindow.focus();
            }
        }, 100)
    }

</script>

<Window options={options} bind:this={window} on_click_close={destroy} on_focused={on_window_focused}>
    <div slot="content" class="absolute inset-0.5 top-0 flex flex-col bg-black">

        <div class="absolute inset-0 overflow-hidden bg-black">

            {#if !iframe_loaded}
            <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-slate-500 text-sm p-2 rounded font-mono">
                <DumbProgress style="width:150px;height:15px;"></DumbProgress>
            </div>
            {/if}

            <iframe 
                class="w-full h-full {!iframe_loaded ? 'hidden' : ''} {window?.z_index == $zIndex ? 'pointer-events-auto' : 'pointer-events-none'}" 
                bind:this={iframe} 
                src={game_url} 
                allow="gamepad *;" 
                frameborder="0" 
                allowfullscreen
                on:load={() => iframe_loaded = true}>
            </iframe>
        </div>

    </div>
    
</Window>

<svelte:options accessors={true}></svelte:options>