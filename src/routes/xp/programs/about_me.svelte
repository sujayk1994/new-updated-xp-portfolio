<svelte:options accessors={true} />

<script>
    import Window from "../../../lib/components/xp/Window.svelte";
    import {
        runningPrograms,
        zIndex,
        hardDrive,
    } from "../../../lib/store";
    import { isAdmin, adminUser } from "../../../lib/admin";
    import { onMount } from "svelte";

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let exec_path;

    let isEditing = false;
    let aboutContent = {
        name: "Your Name",
        title: "Your Title / Profession",
        bio: "Write a short bio about yourself here. Share your story, your passions, and what drives you.",
        email: "your.email@example.com",
        phone: "+1 (555) 123-4567",
        location: "Your City, Country",
        skills: ["Skill 1", "Skill 2", "Skill 3"],
        socialLinks: {
            linkedin: "",
            github: "",
            twitter: "",
            website: ""
        }
    };

    let editForm = { ...aboutContent };
    let loading = true;
    let saving = false;
    let saveMessage = "";

    export let options = {
        title: "About Me",
        min_width: 400,
        min_height: 350,
        width: 550,
        height: 500,
        icon: "/images/xp/icons/Information.png",
        id: id,
        exec_path
    };

    onMount(async () => {
        await loadAboutContent();
    });

    async function loadAboutContent() {
        loading = true;
        try {
            const response = await fetch('/api/admin/about-me');
            const data = await response.json();
            if (data.success && data.content) {
                aboutContent = { ...aboutContent, ...data.content };
                editForm = { ...aboutContent };
            }
        } catch (error) {
            console.error('Error loading about content:', error);
        }
        loading = false;
    }

    async function saveAboutContent() {
        if (!$isAdmin) {
            saveMessage = "Admin access required to save changes";
            return;
        }
        
        saving = true;
        saveMessage = "";
        try {
            const response = await fetch('/api/admin/about-me', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editForm })
            });
            const data = await response.json();
            if (data.success) {
                aboutContent = { ...editForm };
                isEditing = false;
                saveMessage = "Saved successfully!";
                setTimeout(() => saveMessage = "", 3000);
            } else {
                saveMessage = data.error || "Failed to save";
            }
        } catch (error) {
            console.error('Error saving about content:', error);
            saveMessage = "Error saving content";
        }
        saving = false;
    }

    function startEditing() {
        if (!$isAdmin) return;
        editForm = JSON.parse(JSON.stringify(aboutContent));
        isEditing = true;
    }

    function cancelEditing() {
        editForm = JSON.parse(JSON.stringify(aboutContent));
        isEditing = false;
    }

    function addSkill() {
        editForm.skills = [...editForm.skills, ""];
    }

    function removeSkill(index) {
        editForm.skills = editForm.skills.filter((_, i) => i !== index);
    }

    export async function destroy() {
        close_program();
    }

    function close_program() {
        runningPrograms.update((programs) => programs.filter((p) => p != self));
        self.$destroy();
    }
</script>

<Window
    {options}
    bind:this={window}
    on_click_close={destroy}
>
    <div slot="content" class="absolute inset-1 top-0 flex flex-col bg-gradient-to-b from-[#f5f5f5] to-[#e8e8e8] overflow-hidden">
        {#if loading}
            <div class="flex-1 flex items-center justify-center">
                <div class="text-gray-500">Loading...</div>
            </div>
        {:else if isEditing}
            <div class="flex-1 overflow-auto p-4">
                <div class="bg-white rounded shadow-sm border border-gray-300 p-4 space-y-4">
                    <h2 class="text-lg font-bold text-blue-800 border-b pb-2">Edit About Me</h2>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" bind:value={editForm.name} 
                                class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Title</label>
                            <input type="text" bind:value={editForm.title}
                                class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Bio</label>
                        <textarea bind:value={editForm.bio} rows="4"
                            class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" bind:value={editForm.email}
                                class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                            <input type="text" bind:value={editForm.phone}
                                class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Location</label>
                        <input type="text" bind:value={editForm.location}
                            class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Skills</label>
                        <div class="space-y-2">
                            {#each editForm.skills as skill, index}
                                <div class="flex gap-2">
                                    <input type="text" bind:value={editForm.skills[index]}
                                        class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                                    <button on:click={() => removeSkill(index)}
                                        class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">X</button>
                                </div>
                            {/each}
                            <button on:click={addSkill}
                                class="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">+ Add Skill</button>
                        </div>
                    </div>

                    <div class="border-t pt-4">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">Social Links</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">LinkedIn</label>
                                <input type="url" bind:value={editForm.socialLinks.linkedin}
                                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">GitHub</label>
                                <input type="url" bind:value={editForm.socialLinks.github}
                                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" placeholder="https://github.com/..." />
                            </div>
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">Twitter</label>
                                <input type="url" bind:value={editForm.socialLinks.twitter}
                                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" placeholder="https://twitter.com/..." />
                            </div>
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">Website</label>
                                <input type="url" bind:value={editForm.socialLinks.website}
                                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" placeholder="https://yoursite.com" />
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 pt-2 border-t">
                        <button on:click={cancelEditing}
                            class="px-4 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 border border-gray-400">
                            Cancel
                        </button>
                        <button on:click={saveAboutContent} disabled={saving}
                            class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        {:else}
            <div class="flex-1 overflow-auto p-4">
                <div class="bg-white rounded shadow-sm border border-gray-300">
                    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t">
                        <div class="flex items-center gap-4">
                            <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                                {aboutContent.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 class="text-xl font-bold">{aboutContent.name}</h1>
                                <p class="text-blue-100">{aboutContent.title}</p>
                            </div>
                        </div>
                    </div>

                    <div class="p-4 space-y-4">
                        <div>
                            <h2 class="text-sm font-bold text-gray-700 mb-1">About</h2>
                            <p class="text-sm text-gray-600 leading-relaxed">{aboutContent.bio}</p>
                        </div>

                        <div class="border-t pt-3">
                            <h2 class="text-sm font-bold text-gray-700 mb-2">Contact Information</h2>
                            <div class="grid grid-cols-1 gap-2 text-sm">
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-500">Email:</span>
                                    <a href="mailto:{aboutContent.email}" class="text-blue-600 hover:underline">{aboutContent.email}</a>
                                </div>
                                {#if aboutContent.phone}
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-500">Phone:</span>
                                    <span>{aboutContent.phone}</span>
                                </div>
                                {/if}
                                {#if aboutContent.location}
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-500">Location:</span>
                                    <span>{aboutContent.location}</span>
                                </div>
                                {/if}
                            </div>
                        </div>

                        {#if aboutContent.skills && aboutContent.skills.length > 0}
                        <div class="border-t pt-3">
                            <h2 class="text-sm font-bold text-gray-700 mb-2">Skills</h2>
                            <div class="flex flex-wrap gap-2">
                                {#each aboutContent.skills as skill}
                                    {#if skill}
                                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{skill}</span>
                                    {/if}
                                {/each}
                            </div>
                        </div>
                        {/if}

                        {#if aboutContent.socialLinks && (aboutContent.socialLinks.linkedin || aboutContent.socialLinks.github || aboutContent.socialLinks.twitter || aboutContent.socialLinks.website)}
                        <div class="border-t pt-3">
                            <h2 class="text-sm font-bold text-gray-700 mb-2">Connect</h2>
                            <div class="flex flex-wrap gap-3">
                                {#if aboutContent.socialLinks.linkedin}
                                <a href={aboutContent.socialLinks.linkedin} target="_blank" rel="noopener" 
                                    class="text-sm text-blue-600 hover:underline">LinkedIn</a>
                                {/if}
                                {#if aboutContent.socialLinks.github}
                                <a href={aboutContent.socialLinks.github} target="_blank" rel="noopener"
                                    class="text-sm text-blue-600 hover:underline">GitHub</a>
                                {/if}
                                {#if aboutContent.socialLinks.twitter}
                                <a href={aboutContent.socialLinks.twitter} target="_blank" rel="noopener"
                                    class="text-sm text-blue-600 hover:underline">Twitter</a>
                                {/if}
                                {#if aboutContent.socialLinks.website}
                                <a href={aboutContent.socialLinks.website} target="_blank" rel="noopener"
                                    class="text-sm text-blue-600 hover:underline">Website</a>
                                {/if}
                            </div>
                        </div>
                        {/if}
                    </div>
                </div>

                {#if $isAdmin}
                <div class="mt-4 flex justify-center">
                    <button on:click={startEditing}
                        class="px-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 shadow">
                        Edit About Me
                    </button>
                </div>
                {/if}

                {#if saveMessage}
                <div class="mt-2 text-center text-sm text-green-600">{saveMessage}</div>
                {/if}
            </div>
        {/if}
    </div>
</Window>
