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
    let coverInput;
    let uploading = false;
    let saveMessage = "";

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

    function extractSrcFromEmbed(code) {
        if (!code) return null;
        const srcMatch = code.match(/src=["']([^"']+)["']/i);
        if (srcMatch && srcMatch[1]) {
            return srcMatch[1];
        }
        if (code.startsWith('http')) {
            return code;
        }
        return null;
    }

    function openMagazine(magazine) {
        selectedMagazine = magazine;
        currentView = 'viewer';
    }

    function goToGallery() {
        currentView = 'gallery';
        selectedMagazine = null;
    }

    function startAddMagazine() {
        if (!$isAdmin) return;
        editingMagazine = {
            id: 'new_' + Date.now(),
            title: '',
            description: '',
            coverUrl: '',
            embedUrl: '',
            createdAt: Date.now()
        };
        isEditing = true;
    }

    function startEditMagazine(magazine, e) {
        if (!$isAdmin) return;
        if (e) e.stopPropagation();
        editingMagazine = { ...magazine };
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
                saveMessage = "Magazine saved!";
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

    async function deleteMagazine(magazine, e) {
        if (!$isAdmin) return;
        if (e) e.stopPropagation();
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

    export async function destroy() {
        close_program();
    }

    function close_program() {
        runningPrograms.update((programs) => programs.filter((p) => p != self));
        self.$destroy();
    }

    function handleKeydown(event) {
        if (currentView === 'viewer' && event.key === 'Escape') {
            goToGallery();
        }
    }
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
                                placeholder="Brief description"></textarea>
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
                            <label class="block text-sm text-gray-300 mb-1">FlipHTML5 Embed Code</label>
                            <textarea bind:value={editingMagazine.embedUrl} rows="4"
                                class="w-full px-3 py-2 bg-white/20 text-white rounded border border-white/30 focus:outline-none focus:border-purple-400 resize-none font-mono text-xs"
                                placeholder='Paste embed code from FlipHTML5 here...'></textarea>
                            <p class="text-xs text-gray-400 mt-1">
                                Paste the HTML embed code or URL from FlipHTML5
                            </p>
                            {#if editingMagazine.embedUrl}
                                <p class="text-xs text-green-400 mt-1">
                                    Detected URL: {extractSrcFromEmbed(editingMagazine.embedUrl) || 'Invalid'}
                                </p>
                            {/if}
                        </div>
                        
                        {#if saveMessage}
                            <p class="text-sm {saveMessage.includes('saved') ? 'text-green-400' : 'text-red-400'}">
                                {saveMessage}
                            </p>
                        {/if}
                        
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
        {:else if currentView === 'viewer' && selectedMagazine}
            <div class="flex-1 flex flex-col">
                <div class="flex items-center justify-between p-3 bg-black/30">
                    <button on:click={goToGallery}
                        class="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 flex items-center gap-2">
                        <span>←</span> Back to Gallery
                    </button>
                    <h2 class="text-white font-semibold">{selectedMagazine.title}</h2>
                    <div class="w-32"></div>
                </div>
                <div class="flex-1 relative bg-black">
                    {#if extractSrcFromEmbed(selectedMagazine.embedUrl)}
                        <iframe 
                            src={extractSrcFromEmbed(selectedMagazine.embedUrl)}
                            class="absolute inset-0 w-full h-full border-0"
                            title={selectedMagazine.title}
                            allowfullscreen
                            allow="fullscreen"
                        ></iframe>
                    {:else}
                        <div class="absolute inset-0 flex items-center justify-center text-gray-400">
                            No embed URL configured for this magazine
                        </div>
                    {/if}
                </div>
            </div>
        {:else}
            <div class="flex-1 flex flex-col p-6 overflow-hidden">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-white">Magazine Portfolio</h1>
                        <p class="text-gray-400 text-sm mt-1">Click on a magazine to view</p>
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
                    <div class="flex-1 overflow-auto">
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {#each magazines as magazine (magazine.id)}
                                <div 
                                    class="magazine-card relative group cursor-pointer transform transition-all duration-200 hover:scale-105"
                                    on:click={() => openMagazine(magazine)}
                                >
                                    <div class="relative rounded-lg overflow-hidden shadow-xl bg-black/30 aspect-[3/4]">
                                        {#if magazine.coverUrl}
                                            <img src={magazine.coverUrl} alt={magazine.title} 
                                                class="w-full h-full object-cover" />
                                        {:else}
                                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
                                                <span class="text-4xl">📖</span>
                                            </div>
                                        {/if}
                                        
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        
                                        <div class="absolute bottom-0 left-0 right-0 p-3">
                                            <h3 class="text-white font-semibold text-sm truncate">{magazine.title}</h3>
                                            {#if magazine.description}
                                                <p class="text-gray-300 text-xs truncate mt-1">{magazine.description}</p>
                                            {/if}
                                        </div>
                                        
                                        {#if $isAdmin}
                                            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <button on:click={(e) => startEditMagazine(magazine, e)}
                                                    class="p-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                                                    ✏️
                                                </button>
                                                <button on:click={(e) => deleteMagazine(magazine, e)}
                                                    class="p-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                                                    🗑️
                                                </button>
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
        
        {#if saveMessage && !isEditing}
            <div class="absolute bottom-4 right-4 px-4 py-2 bg-green-600 text-white rounded shadow-lg">
                {saveMessage}
            </div>
        {/if}
    </div>
</Window>

<style>
    .magazine-container {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .magazine-card:hover {
        box-shadow: 0 10px 40px rgba(139, 92, 246, 0.3);
    }
</style>
