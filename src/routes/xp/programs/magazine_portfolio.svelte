<svelte:options accessors={true} />

<script>
    import Window from "../../../lib/components/xp/Window.svelte";
    import {
        runningPrograms,
        zIndex,
        hardDrive,
    } from "../../../lib/store";
    import { isAdmin, adminUser } from "../../../lib/admin";
    import { onMount, onDestroy } from "svelte";

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let exec_path;
    export let openMagazineId = null;

    let currentView = 'gallery';
    let selectedMagazine = null;
    let magazines = [];
    let loading = true;
    let isEditing = false;
    let editingMagazine = null;
    let fileInput;
    let coverInput;
    let uploading = false;
    let saveMessage = "";
    let carouselIndex = 0;
    let flipbookContainer;
    let flipbookPages = [];
    let currentPage = 0;
    let totalPages = 0;
    let loadingFlipbook = false;
    let flipbookReady = false;
    let isFlipping = false;
    let flipDirection = 'none';

    export let options = {
        title: "Magazine Portfolio",
        min_width: 800,
        min_height: 600,
        width: 1000,
        height: 700,
        icon: "/images/xp/icons/MagazinePortfolio.png",
        id: id,
        exec_path
    };

    onMount(async () => {
        await loadMagazines();
        if (openMagazineId) {
            const mag = magazines.find(m => m.id === openMagazineId);
            if (mag) {
                openMagazine(mag);
            }
        }
    });

    async function loadMagazines() {
        loading = true;
        try {
            const response = await fetch('/api/admin/magazines');
            const data = await response.json();
            if (data.success) {
                magazines = data.magazines || [];
            } else {
                magazines = [];
            }
        } catch (error) {
            console.error('Error loading magazines:', error);
            magazines = [];
        }
        loading = false;
    }

    async function openMagazine(magazine) {
        selectedMagazine = magazine;
        currentView = 'flipbook';
        loadingFlipbook = true;
        flipbookReady = false;
        currentPage = 0;
        isFlipping = false;
        flipDirection = 'none';
        
        if (magazine.pages && magazine.pages.length > 0) {
            flipbookPages = magazine.pages;
            totalPages = flipbookPages.length;
            loadingFlipbook = false;
            flipbookReady = true;
        } else if (magazine.pdfUrl) {
            await loadPdfPages(magazine.pdfUrl);
        } else {
            flipbookPages = [];
            totalPages = 0;
            loadingFlipbook = false;
            flipbookReady = true;
        }
    }

    async function loadPdfPages(pdfUrl) {
        try {
            if (typeof pdfjsLib === 'undefined') {
                await loadPdfJs();
            }
            
            const loadingTask = pdfjsLib.getDocument(pdfUrl);
            const pdf = await loadingTask.promise;
            totalPages = pdf.numPages;
            flipbookPages = [];
            
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const scale = 1.5;
                const viewport = page.getViewport({ scale });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                flipbookPages.push(canvas.toDataURL('image/jpeg', 0.8));
            }
            
            flipbookPages = flipbookPages;
            loadingFlipbook = false;
            flipbookReady = true;
        } catch (error) {
            console.error('Error loading PDF:', error);
            loadingFlipbook = false;
        }
    }

    function loadPdfJs() {
        return new Promise((resolve, reject) => {
            if (typeof pdfjsLib !== 'undefined') {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function goToGallery() {
        currentView = 'gallery';
        selectedMagazine = null;
        flipbookPages = [];
        flipbookReady = false;
    }

    function nextPage() {
        if (currentPage < totalPages - 2 && !isFlipping) {
            isFlipping = true;
            flipDirection = 'forward';
            setTimeout(() => {
                currentPage += 2;
                isFlipping = false;
                flipDirection = 'none';
            }, 400);
        }
    }

    function prevPage() {
        if (currentPage > 0 && !isFlipping) {
            isFlipping = true;
            flipDirection = 'backward';
            setTimeout(() => {
                currentPage -= 2;
                isFlipping = false;
                flipDirection = 'none';
            }, 400);
        }
    }

    function goToPage(pageNum) {
        if (isFlipping) return;
        let targetPage = Math.max(0, Math.min(pageNum, totalPages - 1));
        if (targetPage % 2 !== 0) targetPage--;
        
        if (targetPage !== currentPage) {
            isFlipping = true;
            flipDirection = targetPage > currentPage ? 'forward' : 'backward';
            setTimeout(() => {
                currentPage = targetPage;
                isFlipping = false;
                flipDirection = 'none';
            }, 400);
        }
    }

    function getVisibleMagazines() {
        if (magazines.length === 0) return [];
        const itemsToShow = Math.min(3, magazines.length);
        const maxIndex = Math.max(0, magazines.length - itemsToShow);
        const safeIndex = Math.min(carouselIndex, maxIndex);
        return magazines.slice(safeIndex, safeIndex + itemsToShow);
    }

    function nextCarousel() {
        const maxIndex = Math.max(0, magazines.length - 3);
        if (carouselIndex < maxIndex) {
            carouselIndex++;
        }
    }

    function prevCarousel() {
        if (carouselIndex > 0) {
            carouselIndex--;
        }
    }

    function canNavigateNext() {
        return magazines.length > 3 && carouselIndex < magazines.length - 3;
    }

    function canNavigatePrev() {
        return carouselIndex > 0;
    }

    function startAddMagazine() {
        if (!$isAdmin) return;
        editingMagazine = {
            id: 'new_' + Date.now(),
            title: '',
            description: '',
            coverUrl: '',
            pages: [],
            createdAt: Date.now()
        };
        isEditing = true;
    }

    function startEditMagazine(magazine) {
        if (!$isAdmin) return;
        editingMagazine = { ...magazine, pages: [...(magazine.pages || [])] };
        isEditing = true;
    }

    function cancelEdit() {
        editingMagazine = null;
        isEditing = false;
        saveMessage = "";
    }

    async function saveMagazine() {
        if (!$isAdmin || !editingMagazine) return;
        
        if (!editingMagazine.title || editingMagazine.title.trim() === '') {
            saveMessage = "Title is required";
            return;
        }
        
        uploading = true;
        try {
            const response = await fetch('/api/admin/magazines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ magazine: editingMagazine })
            });
            const data = await response.json();
            if (data.success) {
                await loadMagazines();
                cancelEdit();
                saveMessage = "Magazine saved successfully!";
                setTimeout(() => saveMessage = "", 3000);
            } else {
                saveMessage = data.error || "Failed to save";
            }
        } catch (error) {
            console.error('Error saving magazine:', error);
            saveMessage = "Error saving magazine";
        }
        uploading = false;
    }

    async function deleteMagazine(magazine) {
        if (!$isAdmin) return;
        if (!confirm(`Delete "${magazine.title}"?`)) return;
        
        try {
            const response = await fetch('/api/admin/magazines', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: magazine.id })
            });
            const data = await response.json();
            if (data.success) {
                await loadMagazines();
                carouselIndex = Math.max(0, Math.min(carouselIndex, Math.max(0, magazines.length - 3)));
            }
        } catch (error) {
            console.error('Error deleting magazine:', error);
        }
    }

    async function uploadCover() {
        if (!coverInput?.files?.length) return;
        uploading = true;
        try {
            const file = coverInput.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileId', 'magazine_cover_' + Date.now());
            
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            if (data.success) {
                editingMagazine.coverUrl = data.url;
                editingMagazine = editingMagazine;
            } else {
                saveMessage = data.error || "Failed to upload cover";
            }
        } catch (error) {
            console.error('Error uploading cover:', error);
            saveMessage = "Error uploading cover";
        }
        uploading = false;
    }

    async function uploadPages() {
        if (!fileInput?.files?.length) return;
        uploading = true;
        
        const files = Array.from(fileInput.files);
        const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));
        
        for (const file of sortedFiles) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('fileId', 'magazine_page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
                
                const response = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                if (data.success) {
                    editingMagazine.pages = [...editingMagazine.pages, data.url];
                }
            } catch (error) {
                console.error('Error uploading page:', error);
            }
        }
        
        editingMagazine = editingMagazine;
        uploading = false;
    }

    function removePage(index) {
        editingMagazine.pages = editingMagazine.pages.filter((_, i) => i !== index);
    }

    function movePage(index, direction) {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= editingMagazine.pages.length) return;
        const pages = [...editingMagazine.pages];
        [pages[index], pages[newIndex]] = [pages[newIndex], pages[index]];
        editingMagazine.pages = pages;
    }

    export async function destroy() {
        close_program();
    }

    function close_program() {
        runningPrograms.update((programs) => programs.filter((p) => p != self));
        self.$destroy();
    }

    function handleKeydown(event) {
        if (currentView === 'flipbook') {
            if (event.key === 'ArrowRight') nextPage();
            if (event.key === 'ArrowLeft') prevPage();
            if (event.key === 'Escape') goToGallery();
        }
    }

    $: visibleMagazines = getVisibleMagazines();
</script>

<svelte:window on:keydown={handleKeydown} />

<Window
    {options}
    bind:this={window}
    on_click_close={destroy}
>
    <div slot="content" class="magazine-container absolute inset-1 top-0 flex flex-col bg-gradient-to-b from-[#1a1a2e] to-[#16213e] overflow-hidden">
        {#if loading}
            <div class="flex-1 flex items-center justify-center">
                <div class="text-white text-lg">Loading magazines...</div>
            </div>
        {:else if isEditing}
            <div class="flex-1 overflow-auto p-4">
                <div class="bg-white/10 backdrop-blur rounded-lg p-6 max-w-2xl mx-auto">
                    <h2 class="text-xl font-bold text-white mb-4">
                        {editingMagazine.id.startsWith('new_') ? 'Add New Magazine' : 'Edit Magazine'}
                    </h2>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-300 mb-1">Title *</label>
                            <input type="text" bind:value={editingMagazine.title}
                                class="w-full px-3 py-2 bg-white/20 text-white rounded border border-white/30 focus:outline-none focus:border-purple-400" 
                                placeholder="Enter magazine title" />
                        </div>
                        
                        <div>
                            <label class="block text-sm text-gray-300 mb-1">Description</label>
                            <textarea bind:value={editingMagazine.description} rows="2"
                                class="w-full px-3 py-2 bg-white/20 text-white rounded border border-white/30 focus:outline-none focus:border-purple-400 resize-none"
                                placeholder="Brief description of the magazine"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm text-gray-300 mb-1">Cover Image</label>
                            <div class="flex items-center gap-4">
                                {#if editingMagazine.coverUrl}
                                    <img src={editingMagazine.coverUrl} alt="Cover" class="w-24 h-32 object-cover rounded shadow" />
                                {:else}
                                    <div class="w-24 h-32 bg-white/10 rounded flex items-center justify-center text-gray-400 text-xs">
                                        No cover
                                    </div>
                                {/if}
                                <div>
                                    <input type="file" accept="image/*" bind:this={coverInput} on:change={uploadCover} class="hidden" />
                                    <button on:click={() => coverInput.click()} disabled={uploading}
                                        class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 text-sm">
                                        {uploading ? 'Uploading...' : 'Upload Cover'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm text-gray-300 mb-2">Magazine Pages ({editingMagazine.pages.length} pages)</label>
                            <div class="mb-3">
                                <input type="file" accept="image/*" multiple bind:this={fileInput} on:change={uploadPages} class="hidden" />
                                <button on:click={() => fileInput.click()} disabled={uploading}
                                    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm">
                                    {uploading ? 'Uploading...' : 'Add Page Images'}
                                </button>
                                <span class="text-xs text-gray-400 ml-2">Select multiple images (they will be sorted by name)</span>
                            </div>
                            
                            {#if editingMagazine.pages.length > 0}
                                <div class="grid grid-cols-6 gap-2 max-h-48 overflow-auto bg-black/20 p-2 rounded">
                                    {#each editingMagazine.pages as page, index}
                                        <div class="relative group">
                                            <img src={page} alt="Page {index + 1}" class="w-full h-20 object-cover rounded" />
                                            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                                                <button on:click={() => movePage(index, -1)} class="p-1 bg-white/20 rounded text-white text-xs hover:bg-white/40" disabled={index === 0}>
                                                    &lt;
                                                </button>
                                                <button on:click={() => removePage(index)} class="p-1 bg-red-500/80 rounded text-white text-xs hover:bg-red-600">
                                                    X
                                                </button>
                                                <button on:click={() => movePage(index, 1)} class="p-1 bg-white/20 rounded text-white text-xs hover:bg-white/40" disabled={index === editingMagazine.pages.length - 1}>
                                                    &gt;
                                                </button>
                                            </div>
                                            <span class="absolute bottom-0 left-0 right-0 text-center text-xs text-white bg-black/50">{index + 1}</span>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                        
                        <div class="flex justify-end gap-3 pt-4 border-t border-white/20">
                            <button on:click={cancelEdit}
                                class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                                Cancel
                            </button>
                            <button on:click={saveMagazine} disabled={uploading || !editingMagazine.title}
                                class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50">
                                {uploading ? 'Saving...' : 'Save Magazine'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        {:else if currentView === 'gallery'}
            <div class="flex-1 flex flex-col p-6 overflow-hidden">
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-white tracking-tight">Magazine Portfolio</h1>
                        <p class="text-gray-400 text-sm mt-1">Click on a magazine to browse through the pages</p>
                    </div>
                    {#if $isAdmin}
                        <button on:click={startAddMagazine}
                            class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 shadow-lg">
                            + Add Magazine
                        </button>
                    {/if}
                </div>
                
                {#if magazines.length === 0}
                    <div class="flex-1 flex items-center justify-center">
                        <div class="text-center text-gray-400">
                            <div class="text-6xl mb-4 opacity-30">📚</div>
                            <p class="text-lg mb-2">No magazines yet</p>
                            {#if $isAdmin}
                                <p class="text-sm">Click "Add Magazine" to create your first magazine</p>
                            {:else}
                                <p class="text-sm">Check back later for magazine content</p>
                            {/if}
                        </div>
                    </div>
                {:else}
                    <div class="flex-1 flex items-center justify-center">
                        <div class="relative w-full max-w-4xl">
                            {#if canNavigatePrev()}
                                <button on:click={prevCarousel} 
                                    class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition-all">
                                    &#8249;
                                </button>
                            {/if}
                            
                            <div class="flex gap-6 justify-center overflow-hidden">
                                {#each visibleMagazines as magazine, i (magazine.id)}
                                    <div class="magazine-card relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                                         style="perspective: 1000px;"
                                         on:click={() => openMagazine(magazine)}>
                                        <div class="relative w-56 h-80 rounded-lg overflow-hidden shadow-2xl"
                                             style="transform-style: preserve-3d; transform: rotateY({i === 1 && visibleMagazines.length === 3 ? 0 : i === 0 ? 5 : -5}deg);">
                                            {#if magazine.coverUrl}
                                                <img src={magazine.coverUrl} alt={magazine.title} 
                                                     class="w-full h-full object-cover" />
                                            {:else}
                                                <div class="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                                    <span class="text-white text-4xl font-bold">{magazine.title.charAt(0)}</span>
                                                </div>
                                            {/if}
                                            
                                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            
                                            <div class="absolute bottom-0 left-0 right-0 p-4">
                                                <h3 class="text-white font-bold text-lg leading-tight">{magazine.title}</h3>
                                                {#if magazine.description}
                                                    <p class="text-gray-300 text-xs mt-1 line-clamp-2">{magazine.description}</p>
                                                {/if}
                                                <p class="text-gray-400 text-xs mt-2">{magazine.pages?.length || 0} pages</p>
                                            </div>
                                            
                                            <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <span class="text-white bg-black/50 px-4 py-2 rounded-full text-sm font-medium">
                                                    Open Magazine
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {#if $isAdmin}
                                            <div class="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button on:click|stopPropagation={() => startEditMagazine(magazine)}
                                                    class="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white text-sm shadow-lg">
                                                    E
                                                </button>
                                                <button on:click|stopPropagation={() => deleteMagazine(magazine)}
                                                    class="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm shadow-lg">
                                                    X
                                                </button>
                                            </div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                            
                            {#if canNavigateNext()}
                                <button on:click={nextCarousel}
                                    class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition-all">
                                    &#8250;
                                </button>
                            {/if}
                        </div>
                    </div>
                    
                    {#if magazines.length > 3}
                        <div class="flex justify-center gap-2 mt-6">
                            {#each Array(Math.ceil(magazines.length / 3)) as _, i}
                                <button on:click={() => carouselIndex = Math.min(i * 3, magazines.length - 3)}
                                    class="w-2 h-2 rounded-full transition-all {carouselIndex >= i * 3 && carouselIndex < (i + 1) * 3 ? 'bg-purple-500 w-6' : 'bg-white/30 hover:bg-white/50'}">
                                </button>
                            {/each}
                        </div>
                    {/if}
                {/if}
            </div>
        {:else if currentView === 'flipbook'}
            <div class="flex-1 flex flex-col bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e]">
                <div class="flex items-center justify-between px-6 py-3 bg-black/30">
                    <button on:click={goToGallery}
                        class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <span class="text-xl">&larr;</span>
                        <span>Back to Gallery</span>
                    </button>
                    <h2 class="text-white font-medium">{selectedMagazine?.title}</h2>
                    <div class="text-gray-400 text-sm">
                        {#if totalPages > 0}
                            Page {currentPage + 1}-{Math.min(currentPage + 2, totalPages)} of {totalPages}
                        {/if}
                    </div>
                </div>
                
                <div class="flex-1 flex items-center justify-center overflow-hidden p-4" bind:this={flipbookContainer}>
                    {#if loadingFlipbook}
                        <div class="text-white text-lg flex flex-col items-center gap-4">
                            <div class="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            <span>Loading magazine pages...</span>
                        </div>
                    {:else if flipbookPages.length === 0}
                        <div class="text-gray-400 text-center">
                            <div class="text-6xl mb-4 opacity-30">📖</div>
                            <p class="text-lg mb-2">No pages available</p>
                            <p class="text-sm">This magazine doesn't have any pages yet</p>
                        </div>
                    {:else}
                        <div class="flipbook-wrapper relative flex items-center select-none">
                            <button on:click={prevPage} 
                                class="absolute -left-16 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={currentPage === 0 || isFlipping}>
                                &#8249;
                            </button>
                            
                            <div class="flipbook flex shadow-2xl relative" style="perspective: 2000px;">
                                <div class="page left-page bg-white relative overflow-hidden"
                                     class:flip-backward={isFlipping && flipDirection === 'backward'}
                                     style="width: 320px; height: 450px; transform-origin: right center;">
                                    {#if flipbookPages[currentPage]}
                                        <img src={flipbookPages[currentPage]} alt="Page {currentPage + 1}" 
                                             class="w-full h-full object-contain bg-gray-100" draggable="false" />
                                        <div class="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-0.5 rounded">
                                            {currentPage + 1}
                                        </div>
                                    {:else}
                                        <div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            Cover
                                        </div>
                                    {/if}
                                    <div class="page-shadow absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>
                                </div>
                                
                                <div class="book-spine w-1 bg-gradient-to-r from-gray-400 to-gray-300 shadow-inner"></div>
                                
                                <div class="page right-page bg-white relative overflow-hidden"
                                     class:flip-forward={isFlipping && flipDirection === 'forward'}
                                     style="width: 320px; height: 450px; transform-origin: left center;">
                                    {#if flipbookPages[currentPage + 1]}
                                        <img src={flipbookPages[currentPage + 1]} alt="Page {currentPage + 2}" 
                                             class="w-full h-full object-contain bg-gray-100" draggable="false" />
                                        <div class="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-0.5 rounded">
                                            {currentPage + 2}
                                        </div>
                                    {:else}
                                        <div class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            {currentPage + 1 >= totalPages ? 'End' : ''}
                                        </div>
                                    {/if}
                                    <div class="page-shadow absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
                                </div>
                            </div>
                            
                            <button on:click={nextPage}
                                class="absolute -right-16 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={currentPage >= totalPages - 2 || isFlipping}>
                                &#8250;
                            </button>
                        </div>
                    {/if}
                </div>
                
                {#if flipbookPages.length > 0}
                    <div class="px-6 py-3 bg-black/30">
                        <div class="flex items-center justify-center gap-2">
                            <span class="text-gray-400 text-sm">1</span>
                            <div class="flex-1 max-w-md">
                                <input type="range" min="0" max={Math.max(0, totalPages - 2)} step="2" bind:value={currentPage}
                                    disabled={isFlipping}
                                    class="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:cursor-not-allowed" />
                            </div>
                            <span class="text-gray-400 text-sm">{totalPages}</span>
                        </div>
                        <div class="flex justify-center gap-1 mt-3 max-w-lg mx-auto overflow-x-auto py-1">
                            {#each flipbookPages.slice(0, 16) as page, i}
                                <button on:click={() => goToPage(i)}
                                    disabled={isFlipping}
                                    class="w-8 h-10 rounded overflow-hidden border-2 transition-all flex-shrink-0 disabled:cursor-not-allowed {currentPage === i || currentPage + 1 === i ? 'border-purple-500' : 'border-transparent opacity-60 hover:opacity-100'}">
                                    <img src={page} alt="Thumb {i + 1}" class="w-full h-full object-cover" draggable="false" />
                                </button>
                            {/each}
                            {#if flipbookPages.length > 16}
                                <span class="text-gray-400 text-xs self-center flex-shrink-0 pl-2">+{flipbookPages.length - 16} more</span>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
        
        {#if saveMessage}
            <div class="absolute bottom-4 right-4 {saveMessage.includes('Error') || saveMessage.includes('required') ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded-lg shadow-lg">
                {saveMessage}
            </div>
        {/if}
    </div>
</Window>

<style>
    :global(.magazine-container) {
        font-family: 'Segoe UI', Arial, sans-serif;
    }
    
    .magazine-card {
        filter: drop-shadow(0 25px 25px rgba(0, 0, 0, 0.5));
    }
    
    .flipbook {
        box-shadow: 0 0 60px rgba(0, 0, 0, 0.5);
    }
    
    .page {
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
        backface-visibility: hidden;
    }
    
    .left-page {
        border-radius: 3px 0 0 3px;
    }
    
    .right-page {
        border-radius: 0 3px 3px 0;
    }
    
    .book-spine {
        height: 450px;
    }
    
    .flip-forward {
        animation: flipForward 0.4s ease-in-out;
    }
    
    .flip-backward {
        animation: flipBackward 0.4s ease-in-out;
    }
    
    @keyframes flipForward {
        0% {
            transform: rotateY(0deg);
        }
        50% {
            transform: rotateY(-90deg);
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
        }
        100% {
            transform: rotateY(0deg);
        }
    }
    
    @keyframes flipBackward {
        0% {
            transform: rotateY(0deg);
        }
        50% {
            transform: rotateY(90deg);
            box-shadow: 10px 0 30px rgba(0, 0, 0, 0.3);
        }
        100% {
            transform: rotateY(0deg);
        }
    }
    
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        background: #a855f7;
        border-radius: 50%;
        cursor: pointer;
    }
    
    input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: #a855f7;
        border-radius: 50%;
        cursor: pointer;
        border: none;
    }
    
    input[type="range"]:disabled::-webkit-slider-thumb {
        cursor: not-allowed;
    }
    
    input[type="range"]:disabled::-moz-range-thumb {
        cursor: not-allowed;
    }
</style>
