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

    let embedCode = "";
    let savedEmbedCode = "";
    let isEditing = false;
    let loading = true;
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
        await loadEmbedCode();
    });

    async function loadEmbedCode() {
        loading = true;
        try {
            const response = await fetch('/api/admin/magazine-embed');
            const data = await response.json();
            if (data.success && data.embedUrl) {
                savedEmbedCode = data.embedUrl;
                embedCode = data.embedUrl;
            }
        } catch (error) {
            console.error('Error loading embed code:', error);
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

    function getEmbedSrc() {
        return extractSrcFromEmbed(savedEmbedCode);
    }

    async function saveEmbedCode() {
        if (!$isAdmin) return;
        
        try {
            const response = await fetch('/api/admin/magazine-embed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embedUrl: embedCode })
            });
            const data = await response.json();
            if (data.success) {
                savedEmbedCode = embedCode;
                isEditing = false;
                saveMessage = "Saved successfully!";
                setTimeout(() => saveMessage = "", 3000);
            } else {
                saveMessage = data.error || "Failed to save";
            }
        } catch (error) {
            console.error('Error saving embed code:', error);
            saveMessage = "Error saving";
        }
    }

    function startEdit() {
        if (!$isAdmin) return;
        embedCode = savedEmbedCode;
        isEditing = true;
    }

    function cancelEdit() {
        embedCode = savedEmbedCode;
        isEditing = false;
        saveMessage = "";
    }

    export async function destroy() {
        close_program();
    }

    function close_program() {
        runningPrograms.update((programs) => programs.filter((p) => p != self));
        self.$destroy();
    }

    $: embedSrc = getEmbedSrc();
</script>

<Window
    {options}
    bind:this={window}
    on_click_close={destroy}
>
    <div slot="content" class="magazine-container absolute inset-1 top-0 flex flex-col bg-gradient-to-b from-[#1a1a2e] to-[#16213e] overflow-hidden">
        {#if loading}
            <div class="flex-1 flex items-center justify-center">
                <div class="text-white text-lg">Loading...</div>
            </div>
        {:else if isEditing}
            <div class="flex-1 flex flex-col p-6 overflow-auto">
                <div class="bg-white/10 backdrop-blur rounded-lg p-6 max-w-2xl mx-auto w-full">
                    <h2 class="text-xl font-bold text-white mb-4">Configure FlipHTML5 Embed</h2>
                    
                    <div class="space-y-4">
                        <div>
                            <label for="embed-code" class="block text-sm text-gray-300 mb-2">Paste HTML Embed Code or URL</label>
                            <textarea 
                                id="embed-code"
                                bind:value={embedCode}
                                rows="6"
                                class="w-full px-3 py-2 bg-white/20 text-white rounded border border-white/30 focus:outline-none focus:border-purple-400 font-mono text-xs resize-none" 
                                placeholder='<iframe src="https://online.fliphtml5.com/xxxxx/xxxx/" ...></iframe>'
                            ></textarea>
                            <p class="text-xs text-gray-400 mt-2">
                                Paste the full HTML embed code from FlipHTML5, or just the URL.
                            </p>
                        </div>
                        
                        <div class="bg-blue-900/30 border border-blue-500/30 rounded p-3 text-sm text-blue-200">
                            <strong>How to get the embed code:</strong>
                            <ol class="list-decimal list-inside mt-2 space-y-1 text-xs">
                                <li>Go to your FlipHTML5 dashboard</li>
                                <li>Click "Share" on your publication</li>
                                <li>Select "Embed" tab</li>
                                <li>Copy the HTML embed code</li>
                                <li>Paste it here</li>
                            </ol>
                        </div>

                        {#if embedCode}
                            <div class="bg-green-900/30 border border-green-500/30 rounded p-3">
                                <p class="text-xs text-green-300 mb-1">Detected embed URL:</p>
                                <code class="text-xs text-green-200 break-all">{extractSrcFromEmbed(embedCode) || 'Could not extract URL'}</code>
                            </div>
                        {/if}
                        
                        {#if saveMessage}
                            <p class="text-sm {saveMessage.includes('success') ? 'text-green-400' : 'text-red-400'}">
                                {saveMessage}
                            </p>
                        {/if}
                        
                        <div class="flex justify-end gap-3 pt-4 border-t border-white/20">
                            <button on:click={cancelEdit}
                                class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                                Cancel
                            </button>
                            <button on:click={saveEmbedCode}
                                class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        {:else if savedEmbedCode && embedSrc}
            <div class="flex-1 flex flex-col">
                {#if $isAdmin}
                    <div class="flex justify-end p-2 bg-black/20">
                        <button on:click={startEdit}
                            class="px-3 py-1 text-sm bg-purple-600/80 text-white rounded hover:bg-purple-700">
                            Edit Embed
                        </button>
                    </div>
                {/if}
                <div class="flex-1 relative">
                    <iframe 
                        src={embedSrc}
                        class="absolute inset-0 w-full h-full border-0"
                        title="Magazine Portfolio"
                        allowfullscreen
                        allow="fullscreen"
                    ></iframe>
                </div>
            </div>
        {:else}
            <div class="flex-1 flex flex-col items-center justify-center p-6">
                <div class="text-center">
                    <div class="text-6xl mb-4 opacity-50">📚</div>
                    <h2 class="text-2xl font-bold text-white mb-2">Magazine Portfolio</h2>
                    <p class="text-gray-400 mb-6">No magazine has been configured yet.</p>
                    
                    {#if $isAdmin}
                        <button on:click={startEdit}
                            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 shadow-lg">
                            Configure FlipHTML5 Embed
                        </button>
                    {:else}
                        <p class="text-sm text-gray-500">Check back later for magazine content.</p>
                    {/if}
                </div>
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
</style>
