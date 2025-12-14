<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import { runningPrograms, zIndex, hardDrive } from '../../../lib/store'
    import * as fs from '../../../lib/fs';

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;

    let pdfUrl = null;
    let loading = true;

    $: {
        if(fs_item && window) {
            window.update_title(fs_item.name)
        }
    }

    export async function destroy(){
        if(pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    let ws_size = {width: document.querySelector('#work-space').offsetWidth, height: document.querySelector('#work-space').offsetHeight};

    export let options = {
        title: fs_item == null ? 'PDF Viewer' : fs_item.name,
        min_width: 500,
        min_height: 400,
        width: Math.min(ws_size.width - 20, (ws_size.height - 20)*1.6),
        height: Math.min(ws_size.height - 20),
        icon: '/images/xp/icons/PDF.png',
        id: id,
        exec_path
    };

    async function loadPdf() {
        if(fs_item != null) {
            try {
                let file = await fs.get_file(fs_item.id);
                if(file) {
                    pdfUrl = URL.createObjectURL(file);
                }
            } catch(e) {
                console.error('Error loading PDF:', e);
            }
        }
        loading = false;
    }

    loadPdf();

</script>

<Window options={options} bind:this={window} on_click_close={destroy}>
    <div slot="content" class="absolute inset-1 top-0 flex flex-col bg-slate-200">
        
        {#if loading}
        <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-slate-500 text-sm p-2 rounded font-mono">
            Loading...
        </div>
        {:else if pdfUrl}
        <iframe 
            src={pdfUrl} 
            title="PDF Viewer"
            width="100%" 
            height="100%" 
            class="inset-0 absolute bg-white {window?.z_index == $zIndex ? 'pointer-events-auto' : 'pointer-events-none'}">
        </iframe>
        {:else}
        <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-slate-500 text-sm p-2 rounded font-mono">
            No PDF file selected
        </div>
        {/if}

    </div>
    
</Window>

<svelte:options accessors={true}></svelte:options>
