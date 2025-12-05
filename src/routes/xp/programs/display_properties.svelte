<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import Button from '../../../lib/components/xp/Button.svelte';
    import Tab from '../../../lib/components/xp/Tab.svelte';
    import {onMount } from 'svelte';
    import { runningPrograms, wallpaper, hardDrive, bootScreen } from '../../../lib/store';
    import {get, set} from 'idb-keyval';
    import _, { isEqual } from 'lodash';
    import { wallpapers_folder, default_boot_screen, supported_boot_screen_filetypes } from '../../../lib/system';
    import * as utils from '../../../lib/utils';

    export let id;
    export let window;
    export let self;
    export let exec_path;

    let preview = $wallpaper;
    let wallpapers = $hardDrive[wallpapers_folder]
    .children
    .filter(el => $hardDrive[el].type == 'file');

    let selectedTab = 'Desktop';
    let bootScreenSettings = {...default_boot_screen};
    let bootScreenPreview = null;

    onMount(async () => {
        let savedBootScreen = await get('boot_screen');
        if(savedBootScreen) {
            bootScreenSettings = {...savedBootScreen};
            bootScreenPreview = savedBootScreen.customGif;
        }
    })


    export function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    async function apply(){
        if(selectedTab === 'Desktop') {
            wallpaper.set(preview);
        } else if(selectedTab === 'Boot Screen') {
            await set('boot_screen', bootScreenSettings);
            bootScreen.set(bootScreenSettings);
        }
        destroy();
    }

    function handleBootScreenFileSelect(event) {
        const file = event.target.files[0];
        if(file) {
            const ext = utils.extname(file.name).toLowerCase();
            if(supported_boot_screen_filetypes.includes(ext)) {
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
        title: 'Display Properties',
        min_width: 400,
        min_height: 570,
        width: 400,
        height: 570,
        icon: null,
        id: id,
        resizable: false,
        maximize_btn: false,
        minimize_btn: false,
        exec_path
    };

    async function get_wallpaper_url(w){
        let fs_item = $hardDrive[w];
        console.log(fs_item);
        if(fs_item.storage_type == 'remote'){
            return fs_item.url;
        } else if (fs_item.storage_type == 'local'){
            let file = await get(fs_item.url);
            return URL.createObjectURL(file);
        }
    }


</script>

<Window options={options} bind:this={window} on_click_close={destroy}>
    
    <div slot="content" class="absolute inset-1 p-2 pb-1 flex flex-col bg-xp-yellow overflow-hidden">
        <Tab size={'sm'} items={['Themes', 'Desktop', 'Screesaver', 'Appearance', 'Boot Screen', 'Settings']} 
            selected={selectedTab} on:change={(e) => selectedTab = e.detail}>
        </Tab>
        <div class="w-full grow bg-[#fafaf9] shadow-sm -mt-[1px] flex flex-col overflow-hidden">
            {#if selectedTab === 'Desktop'}
                <div class="h-[250px] shrink-0 relative">
                    <div class="absolute top-8 left-1/2 -translate-x-1/2 w-[190px] h-[190px]">
                        <div class="w-full h-full relative">
                            {#await get_wallpaper_url(preview)}
                                <div class="absolute bg-cover" 
                                    style="inset:10px 10px 30px 10px;">
                                </div>
                            {:then url} 
                                <div class="absolute bg-cover" 
                                    style="inset:10px 10px 30px 10px;"
                                    style:background-image="url({url})">
                                </div>
                            {/await}
                            <div class="absolute inset-0 bg-cover bg-[url(/images/xp/crt_monitor.png)]">

                            </div>
                        </div>
                    </div>
                </div>
                <div class="grow flex flex-row text-[13px] p-2 text-slate-800 overflow-hidden">
                    <div class="grow flex flex-col overflow-hidden">
                        <span class="my-1">Background</span>
                        <div class="grow p-1 overflow-y-scroll overflow-x-hidden border border-slate-700">
                            {#each wallpapers as wallpaper}
                            <div class="w-full flex flex-row" on:click={() => preview = wallpaper}>
                                <img src="/images/xp/icons/JPG.png" class="w-[20px] h-[20px] shrink-0" alt="">
                                <p class="leading-[20px] ml-1 px-1 grow-0 line-clamp-1 {_.isEqual(preview, wallpaper) ? 'bg-blue-600 text-slate-50' : ''}">
                                    {$hardDrive[wallpaper].basename}
                                </p>
                            </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {:else if selectedTab === 'Boot Screen'}
                <div class="flex flex-col p-4 text-[13px] text-slate-800 overflow-y-auto">
                    <div class="border border-slate-400 p-3 mb-4">
                        <p class="font-bold mb-2">Boot Screen Preview</p>
                        <div class="w-full h-[150px] bg-black rounded flex items-center justify-center overflow-hidden" 
                             style="background-color: {bootScreenSettings.backgroundColor}">
                            {#if bootScreenSettings.type === 'custom' && bootScreenPreview}
                                <img src={bootScreenPreview} alt="Boot Screen Preview" class="max-w-full max-h-full object-contain">
                            {:else}
                                <div class="text-center">
                                    <img src="/images/xp_loading_logo.jpg" alt="" class="w-[120px] mx-auto">
                                    <div class="w-[80px] h-[12px] border border-gray-400 rounded mx-auto mt-8 overflow-hidden">
                                        <div class="h-full w-[30%] bg-blue-500 animate-pulse"></div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>

                    <div class="border border-slate-400 p-3 mb-4">
                        <p class="font-bold mb-2">Boot Screen Type</p>
                        <div class="flex flex-col gap-2">
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
                        <div class="border border-slate-400 p-3 mb-4">
                            <p class="font-bold mb-2">Custom Loading Image</p>
                            <p class="text-xs text-slate-600 mb-2">Supported formats: GIF, PNG, JPG, JPEG, WEBP</p>
                            <div class="flex gap-2">
                                <label class="inline-block px-3 py-1 bg-slate-200 border border-slate-400 cursor-pointer hover:bg-slate-300 text-center">
                                    Browse...
                                    <input type="file" accept=".gif,.png,.jpg,.jpeg,.webp" 
                                           class="hidden" on:change={handleBootScreenFileSelect}>
                                </label>
                                {#if bootScreenPreview}
                                    <button class="px-3 py-1 bg-slate-200 border border-slate-400 hover:bg-slate-300"
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

                    <div class="border border-slate-400 p-3 mb-4">
                        <p class="font-bold mb-2">Background Color</p>
                        <div class="flex items-center gap-2">
                            <input type="color" value={bootScreenSettings.backgroundColor} 
                                   on:input={(e) => bootScreenSettings = {...bootScreenSettings, backgroundColor: e.target.value}}
                                   class="w-[40px] h-[30px] cursor-pointer">
                            <span class="text-xs">{bootScreenSettings.backgroundColor}</span>
                        </div>
                    </div>

                    {#if bootScreenSettings.type === 'default'}
                        <div class="border border-slate-400 p-3 mb-4">
                            <p class="font-bold mb-2">Default Screen Options</p>
                            <div class="flex flex-col gap-2">
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

                    <div class="mt-2">
                        <button class="px-3 py-1 bg-slate-200 border border-slate-400 hover:bg-slate-300"
                                on:click={resetToDefault}>
                            Reset to Default
                        </button>
                    </div>
                </div>
            {:else}
                <div class="flex items-center justify-center h-full text-slate-500 text-[13px]">
                    <p>This tab is not available yet.</p>
                </div>
            {/if}
        </div>
        <div class="shrink-0 flex flex-row justify-end items-center px-1 pt-2">
            <Button title="OK" style="margin-right:10px;" on_click={apply}></Button>
            <Button title="Cancel" on_click={destroy}></Button>
        </div>
    </div>
</Window>


<svelte:options accessors={true}></svelte:options>