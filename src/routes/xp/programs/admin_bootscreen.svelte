<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import Button from '../../../lib/components/xp/Button.svelte';
    import { onMount } from 'svelte';
    import { runningPrograms, bootScreen } from '../../../lib/store';
    import { isAdmin } from '../../../lib/admin';
    import { default_boot_screen, supported_boot_screen_filetypes } from '../../../lib/system';
    import * as utils from '../../../lib/utils';
    import axios from 'axios';

    export let id;
    export let window;
    export let self;
    export let exec_path;

    let bootScreenSettings = {...default_boot_screen};
    let bootScreenPreview = null;
    let saving = false;
    let message = '';
    let messageType = '';

    onMount(async () => {
        await loadSettings();
    });

    async function loadSettings() {
        try {
            const response = await axios.get('/api/admin/bootscreen');
            if (response.data.success && response.data.settings) {
                bootScreenSettings = {...response.data.settings};
                bootScreenPreview = response.data.settings.customGif;
            }
        } catch (error) {
            console.error('Error loading boot screen settings:', error);
            showMessage('Failed to load settings', 'error');
        }
    }

    export function destroy() {
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    async function apply() {
        if (!$isAdmin) {
            showMessage('You must be logged in as admin to save changes', 'error');
            return;
        }

        saving = true;
        try {
            const response = await axios.post('/api/admin/bootscreen', {
                settings: bootScreenSettings
            });
            
            if (response.data.success) {
                bootScreen.set(bootScreenSettings);
                showMessage('Boot screen settings saved successfully!', 'success');
            } else {
                showMessage(response.data.error || 'Failed to save settings', 'error');
            }
        } catch (error) {
            console.error('Error saving boot screen settings:', error);
            showMessage('Failed to save settings. Make sure you are logged in as admin.', 'error');
        } finally {
            saving = false;
        }
    }

    function showMessage(msg, type) {
        message = msg;
        messageType = type;
        setTimeout(() => {
            message = '';
        }, 3000);
    }

    function handleBootScreenFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const ext = utils.extname(file.name).toLowerCase();
            if (supported_boot_screen_filetypes.includes(ext)) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    bootScreenPreview = e.target.result;
                    bootScreenSettings = {
                        ...bootScreenSettings,
                        customGif: e.target.result,
                        type: 'custom'
                    };
                };
                reader.readAsDataURL(file);
            } else {
                showMessage('Unsupported file type. Use GIF, PNG, JPG, JPEG, or WEBP.', 'error');
            }
        }
    }

    function setBootScreenType(type) {
        bootScreenSettings = {...bootScreenSettings, type};
    }

    function resetToDefault() {
        bootScreenSettings = {...default_boot_screen};
        bootScreenPreview = null;
    }

    function removeCustomImage() {
        bootScreenPreview = null;
        bootScreenSettings = {
            ...bootScreenSettings,
            customGif: null,
            type: 'default'
        };
    }

    export let options = {
        title: 'Boot Screen Settings (Admin)',
        min_width: 450,
        min_height: 600,
        width: 450,
        height: 600,
        icon: '/images/xp/icons/DisplayProperties.png',
        id: id,
        resizable: false,
        maximize_btn: false,
        minimize_btn: true,
        exec_path
    };
</script>

<Window options={options} bind:this={window} on_click_close={destroy}>
    <div slot="content" class="absolute inset-1 p-3 flex flex-col bg-[#ece9d8] overflow-hidden">
        {#if !$isAdmin}
            <div class="flex items-center justify-center h-full">
                <div class="text-center p-4 bg-yellow-50 border border-yellow-300 rounded">
                    <img src="/images/xp/icons/UserAccounts.png" alt="" class="w-12 h-12 mx-auto mb-2" />
                    <p class="text-sm text-yellow-800">You must be logged in as admin to access this feature.</p>
                </div>
            </div>
        {:else}
            <div class="flex flex-col gap-3 overflow-y-auto flex-1">
                <div class="border border-slate-400 bg-white p-3 rounded">
                    <p class="font-bold text-sm mb-2">Boot Screen Preview</p>
                    <div class="w-full h-[120px] bg-black rounded flex items-center justify-center overflow-hidden" 
                         style="background-color: {bootScreenSettings.backgroundColor}">
                        {#if bootScreenSettings.type === 'custom' && bootScreenPreview}
                            <img src={bootScreenPreview} alt="Boot Screen Preview" class="max-w-full max-h-full object-contain">
                        {:else}
                            <div class="text-center">
                                {#if bootScreenSettings.showLogo !== false}
                                    <img src="/images/xp_loading_logo.jpg" alt="" class="w-[100px] mx-auto">
                                {/if}
                                {#if bootScreenSettings.showProgress !== false}
                                    <div class="w-[60px] h-[10px] border border-gray-400 rounded mx-auto mt-6 overflow-hidden">
                                        <div class="h-full w-[30%] bg-blue-500 animate-pulse"></div>
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>
                </div>

                <div class="border border-slate-400 bg-white p-3 rounded">
                    <p class="font-bold text-sm mb-2">Boot Screen Type</p>
                    <div class="flex flex-col gap-2 text-sm">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="bootType" value="default" 
                                   checked={bootScreenSettings.type === 'default'}
                                   on:change={() => setBootScreenType('default')}>
                            <span>Default Windows XP</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="bootType" value="custom"
                                   checked={bootScreenSettings.type === 'custom'}
                                   on:change={() => setBootScreenType('custom')}>
                            <span>Custom Image/GIF</span>
                        </label>
                    </div>
                </div>

                {#if bootScreenSettings.type === 'custom'}
                    <div class="border border-slate-400 bg-white p-3 rounded">
                        <p class="font-bold text-sm mb-2">Custom Loading Image</p>
                        <p class="text-xs text-slate-600 mb-2">Supported formats: GIF, PNG, JPG, JPEG, WEBP</p>
                        <div class="flex gap-2">
                            <label class="inline-block px-3 py-1 bg-slate-200 border border-slate-400 cursor-pointer hover:bg-slate-300 text-center text-sm">
                                Browse...
                                <input type="file" accept=".gif,.png,.jpg,.jpeg,.webp" 
                                       class="hidden" on:change={handleBootScreenFileSelect}>
                            </label>
                            {#if bootScreenPreview}
                                <button class="px-3 py-1 bg-slate-200 border border-slate-400 hover:bg-slate-300 text-sm"
                                        on:click={removeCustomImage}>
                                    Remove
                                </button>
                            {/if}
                        </div>
                        {#if bootScreenPreview}
                            <p class="text-xs text-green-600 mt-2">Custom image loaded</p>
                        {:else}
                            <p class="text-xs text-slate-500 mt-2">No custom image selected</p>
                        {/if}
                    </div>
                {/if}

                <div class="border border-slate-400 bg-white p-3 rounded">
                    <p class="font-bold text-sm mb-2">Background Color</p>
                    <div class="flex items-center gap-2">
                        <input type="color" value={bootScreenSettings.backgroundColor} 
                               on:input={(e) => bootScreenSettings = {...bootScreenSettings, backgroundColor: e.target.value}}
                               class="w-[40px] h-[30px] cursor-pointer">
                        <span class="text-xs">{bootScreenSettings.backgroundColor}</span>
                    </div>
                </div>

                {#if bootScreenSettings.type === 'default'}
                    <div class="border border-slate-400 bg-white p-3 rounded">
                        <p class="font-bold text-sm mb-2">Default Screen Options</p>
                        <div class="flex flex-col gap-2 text-sm">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={bootScreenSettings.showLogo}
                                       on:change={(e) => bootScreenSettings = {...bootScreenSettings, showLogo: e.target.checked}}>
                                <span>Show Windows Logo</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={bootScreenSettings.showProgress}
                                       on:change={(e) => bootScreenSettings = {...bootScreenSettings, showProgress: e.target.checked}}>
                                <span>Show Progress Bar</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={bootScreenSettings.showCopyright}
                                       on:change={(e) => bootScreenSettings = {...bootScreenSettings, showCopyright: e.target.checked}}>
                                <span>Show Copyright Text</span>
                            </label>
                        </div>
                    </div>
                {/if}

                {#if message}
                    <div class="p-2 rounded text-sm {messageType === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}">
                        {message}
                    </div>
                {/if}
            </div>

            <div class="shrink-0 flex flex-row justify-between items-center px-1 pt-3 border-t border-slate-400 mt-2">
                <button class="px-3 py-1 bg-slate-200 border border-slate-400 hover:bg-slate-300 text-sm"
                        on:click={resetToDefault}>
                    Reset to Default
                </button>
                <div class="flex gap-2">
                    <Button title={saving ? "Saving..." : "Apply & Save"} style="margin-right:10px;" on_click={apply}></Button>
                    <Button title="Close" on_click={destroy}></Button>
                </div>
            </div>
        {/if}
    </div>
</Window>

<svelte:options accessors={true}></svelte:options>
