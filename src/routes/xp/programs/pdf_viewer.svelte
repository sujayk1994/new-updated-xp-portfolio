<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import { runningPrograms, zIndex } from '../../../lib/store'
    import * as fs from '../../../lib/fs';
    import { onMount, tick } from 'svelte';
    import * as pdfjsLib from 'pdfjs-dist';

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;

    let canvasContainer;
    let loading = true;
    let error = null;
    let pdfDoc = null;
    let currentPage = 1;
    let totalPages = 0;
    let scale = 1.0;

    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    $: {
        if(fs_item && window) {
            window.update_title(fs_item.name)
        }
    }

    export async function destroy(){
        if(pdfDoc) {
            pdfDoc.destroy();
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
        icon: '/images/xp/icons/AdobeReader.png',
        id: id,
        exec_path
    };

    onMount(async () => {
        await loadPdf();
    });

    async function loadPdf() {
        if(fs_item != null) {
            try {
                let file = await fs.get_file(fs_item.id);
                if(file) {
                    const arrayBuffer = await file.arrayBuffer();
                    pdfDoc = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
                    totalPages = pdfDoc.numPages;
                    loading = false;
                    await tick();
                    await renderPage(currentPage);
                } else {
                    error = 'Could not load file';
                    loading = false;
                }
            } catch(e) {
                console.error('Error loading PDF:', e);
                error = 'Failed to load PDF: ' + e.message;
                loading = false;
            }
        } else {
            error = 'No PDF file selected';
            loading = false;
        }
    }

    async function renderPage(pageNum) {
        if(!pdfDoc || !canvasContainer) return;
        
        canvasContainer.innerHTML = '';
        
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({scale: scale});
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
        
        canvasContainer.appendChild(canvas);
        
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
    }

    function prevPage() {
        if(currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    }

    function nextPage() {
        if(currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    }

    function zoomIn() {
        scale = Math.min(scale + 0.25, 3.0);
        renderPage(currentPage);
    }

    function zoomOut() {
        scale = Math.max(scale - 0.25, 0.5);
        renderPage(currentPage);
    }

</script>

<Window options={options} bind:this={window} on_click_close={destroy}>
    <div slot="content" class="absolute inset-1 top-0 flex flex-col bg-slate-600">
        
        {#if !loading && pdfDoc}
        <div class="flex items-center justify-center gap-2 p-2 bg-slate-700 text-white text-sm shrink-0">
            <button 
                class="px-2 py-1 bg-slate-500 hover:bg-slate-400 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={prevPage}
                disabled={currentPage <= 1}>
                Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
                class="px-2 py-1 bg-slate-500 hover:bg-slate-400 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={nextPage}
                disabled={currentPage >= totalPages}>
                Next
            </button>
            <span class="mx-2">|</span>
            <button 
                class="px-2 py-1 bg-slate-500 hover:bg-slate-400 rounded"
                on:click={zoomOut}>
                -
            </button>
            <span>{Math.round(scale * 100)}%</span>
            <button 
                class="px-2 py-1 bg-slate-500 hover:bg-slate-400 rounded"
                on:click={zoomIn}>
                +
            </button>
        </div>
        {/if}
        
        <div class="flex-1 overflow-auto {window?.z_index == $zIndex ? 'pointer-events-auto' : 'pointer-events-none'}">
            {#if loading}
            <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-white text-sm p-2 rounded font-mono">
                Loading PDF...
            </div>
            {:else if error}
            <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-red-300 text-sm p-2 rounded font-mono text-center">
                {error}
            </div>
            {:else}
            <div bind:this={canvasContainer} class="p-4"></div>
            {/if}
        </div>

    </div>
    
</Window>

<svelte:options accessors={true}></svelte:options>
