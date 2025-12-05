<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import Button from '../../../lib/components/xp/Button.svelte';
    import { onMount } from 'svelte';
    import { runningPrograms, zIndex } from '../../../lib/store';

    export let id;
    export let window;
    export let self;
    export let exec_path;

    let videos = [];
    let loading = true;
    let error = null;
    let showForm = false;
    let editingVideo = null;
    
    let formData = {
        title: '',
        youtubeUrl: '',
        channel: 'Portfolio Channel',
        description: '',
        duration: '',
        views: '0 views',
        thumbnailUrl: '',
        isPublic: true,
        displayOrder: 0
    };

    onMount(async () => {
        await loadVideos();
    });

    async function loadVideos() {
        loading = true;
        error = null;
        try {
            const response = await fetch('/api/admin/videos');
            const data = await response.json();
            if (data.success) {
                videos = data.videos;
            } else {
                error = data.error || 'Failed to load videos';
            }
        } catch (e) {
            error = 'Failed to connect to server';
        }
        loading = false;
    }

    function resetForm() {
        formData = {
            title: '',
            youtubeUrl: '',
            channel: 'Portfolio Channel',
            description: '',
            duration: '',
            views: '0 views',
            thumbnailUrl: '',
            isPublic: true,
            displayOrder: 0
        };
        editingVideo = null;
    }

    function openAddForm() {
        resetForm();
        showForm = true;
    }

    function openEditForm(video) {
        editingVideo = video;
        formData = {
            title: video.title,
            youtubeUrl: `https://youtube.com/watch?v=${video.youtube_id}`,
            channel: video.channel,
            description: video.description || '',
            duration: video.duration || '',
            views: video.views || '0 views',
            thumbnailUrl: video.thumbnail_url || '',
            isPublic: video.is_public,
            displayOrder: video.display_order || 0
        };
        showForm = true;
    }

    function closeForm() {
        showForm = false;
        resetForm();
    }

    async function saveVideo() {
        if (!formData.title || !formData.youtubeUrl) {
            alert('Title and YouTube URL are required');
            return;
        }

        try {
            const method = editingVideo ? 'PUT' : 'POST';
            const body = editingVideo ? { ...formData, id: editingVideo.id } : formData;
            
            const response = await fetch('/api/admin/videos', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            
            const data = await response.json();
            if (data.success) {
                await loadVideos();
                closeForm();
            } else {
                alert(data.error || 'Failed to save video');
            }
        } catch (e) {
            alert('Failed to save video');
        }
    }

    async function deleteVideo(video) {
        if (!confirm(`Are you sure you want to delete "${video.title}"?`)) {
            return;
        }

        try {
            const response = await fetch('/api/admin/videos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: video.id })
            });
            
            const data = await response.json();
            if (data.success) {
                await loadVideos();
            } else {
                alert(data.error || 'Failed to delete video');
            }
        } catch (e) {
            alert('Failed to delete video');
        }
    }

    export function destroy() {
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    let ws_size = {width: document.querySelector('#work-space')?.offsetWidth || 800, height: document.querySelector('#work-space')?.offsetHeight || 600};

    export let options = {
        title: 'Video Manager - Admin Panel',
        min_width: 600,
        min_height: 400,
        width: Math.min(ws_size.width - 40, 900),
        height: Math.min(ws_size.height - 40, 600),
        icon: '/images/xp/icons/InternetExplorer6.png',
        id: id,
        exec_path
    };
</script>

<Window options={options} bind:this={window} on_click_close={destroy}>
    <div slot="content" class="absolute inset-1 top-0 flex flex-col bg-[#ECE9D8] overflow-hidden">
        <div class="p-3 border-b border-[#ACA899] bg-gradient-to-b from-[#FAFAFA] to-[#ECE9D8] flex justify-between items-center">
            <h2 class="text-sm font-bold text-[#003399]">Manage Portfolio Videos</h2>
            <Button on_click={openAddForm}>
                <span class="px-2">Add New Video</span>
            </Button>
        </div>

        {#if showForm}
            <div class="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
                <div class="bg-[#ECE9D8] border-2 border-[#0054E3] shadow-lg w-[500px] max-h-[90%] overflow-auto">
                    <div class="bg-gradient-to-r from-[#0054E3] to-[#2E8AEF] text-white px-3 py-2 font-bold text-sm">
                        {editingVideo ? 'Edit Video' : 'Add New Video'}
                    </div>
                    <div class="p-4 space-y-3">
                        <div>
                            <label class="block text-xs font-medium mb-1">Title *</label>
                            <input 
                                type="text" 
                                bind:value={formData.title}
                                class="w-full border border-[#7F9DB9] px-2 py-1 text-sm"
                                placeholder="Video title"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-medium mb-1">YouTube URL *</label>
                            <input 
                                type="text" 
                                bind:value={formData.youtubeUrl}
                                class="w-full border border-[#7F9DB9] px-2 py-1 text-sm"
                                placeholder="https://youtube.com/watch?v=..."
                            />
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-medium mb-1">Channel Name</label>
                                <input 
                                    type="text" 
                                    bind:value={formData.channel}
                                    class="w-full border border-[#7F9DB9] px-2 py-1 text-sm"
                                    placeholder="Portfolio Channel"
                                />
                            </div>
                            <div>
                                <label class="block text-xs font-medium mb-1">Duration</label>
                                <input 
                                    type="text" 
                                    bind:value={formData.duration}
                                    class="w-full border border-[#7F9DB9] px-2 py-1 text-sm"
                                    placeholder="3:45"
                                />
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-medium mb-1">Views Text</label>
                                <input 
                                    type="text" 
                                    bind:value={formData.views}
                                    class="w-full border border-[#7F9DB9] px-2 py-1 text-sm"
                                    placeholder="1.2K views"
                                />
                            </div>
                            <div>
                                <label class="block text-xs font-medium mb-1">Display Order</label>
                                <input 
                                    type="number" 
                                    bind:value={formData.displayOrder}
                                    class="w-full border border-[#7F9DB9] px-2 py-1 text-sm"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium mb-1">Description</label>
                            <textarea 
                                bind:value={formData.description}
                                class="w-full border border-[#7F9DB9] px-2 py-1 text-sm h-16 resize-none"
                                placeholder="Video description..."
                            ></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-medium mb-1">Custom Thumbnail URL (optional)</label>
                            <input 
                                type="text" 
                                bind:value={formData.thumbnailUrl}
                                class="w-full border border-[#7F9DB9] px-2 py-1 text-sm"
                                placeholder="Leave empty to use YouTube thumbnail"
                            />
                        </div>
                        <div class="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                bind:checked={formData.isPublic}
                                id="isPublic"
                            />
                            <label for="isPublic" class="text-xs">Visible to visitors</label>
                        </div>
                        <div class="flex justify-end gap-2 pt-2 border-t border-[#ACA899]">
                            <Button on_click={closeForm}>
                                <span class="px-3">Cancel</span>
                            </Button>
                            <Button on_click={saveVideo}>
                                <span class="px-3">{editingVideo ? 'Update' : 'Add'} Video</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        <div class="flex-1 overflow-auto p-3">
            {#if loading}
                <div class="flex items-center justify-center h-full">
                    <span class="text-sm text-gray-600">Loading videos...</span>
                </div>
            {:else if error}
                <div class="flex flex-col items-center justify-center h-full gap-2">
                    <span class="text-sm text-red-600">{error}</span>
                    <Button on_click={loadVideos}>
                        <span class="px-2">Retry</span>
                    </Button>
                </div>
            {:else if videos.length === 0}
                <div class="flex flex-col items-center justify-center h-full gap-2">
                    <span class="text-sm text-gray-600">No videos yet. Add your first video!</span>
                    <Button on_click={openAddForm}>
                        <span class="px-2">Add Video</span>
                    </Button>
                </div>
            {:else}
                <div class="space-y-2">
                    {#each videos as video}
                        <div class="bg-white border border-[#ACA899] p-3 flex gap-3 items-start">
                            <img 
                                src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                                alt={video.title}
                                class="w-32 h-20 object-cover bg-gray-200"
                            />
                            <div class="flex-1 min-w-0">
                                <h3 class="font-medium text-sm truncate">{video.title}</h3>
                                <p class="text-xs text-gray-600">{video.channel}</p>
                                <p class="text-xs text-gray-500">{video.views} • {video.duration || 'No duration'}</p>
                                <div class="flex items-center gap-2 mt-1">
                                    <span class="text-xs px-1.5 py-0.5 rounded {video.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
                                        {video.is_public ? 'Public' : 'Hidden'}
                                    </span>
                                    <span class="text-xs text-gray-400">Order: {video.display_order || 0}</span>
                                </div>
                            </div>
                            <div class="flex flex-col gap-1">
                                <Button on_click={() => openEditForm(video)}>
                                    <span class="px-2 text-xs">Edit</span>
                                </Button>
                                <Button on_click={() => deleteVideo(video)}>
                                    <span class="px-2 text-xs">Delete</span>
                                </Button>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <div class="p-2 border-t border-[#ACA899] bg-[#ECE9D8] text-xs text-gray-600">
            {videos.length} video{videos.length !== 1 ? 's' : ''} in your portfolio
        </div>
    </div>
</Window>

<svelte:options accessors={true}></svelte:options>
