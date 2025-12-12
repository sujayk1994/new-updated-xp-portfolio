<script>
    import TaskBar from "./task_bar.svelte";
    import WorkSpace from "./work_space.svelte";
    import ContextMenu from "../../lib/components/xp/ContextMenu.svelte";
    import Screensaver from "./screensaver.svelte";
    import axios from "axios";
    import { get, set, keys } from "idb-keyval";
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import {
        zIndex,
        hardDrive,
        wallpaper,
        queueCommand,
    } from "../../lib/store";
    import StartMenu from "./start_menu.svelte";
    import Welcome from "./welcome.svelte";
    import * as utils from "../../lib/utils";
    import { checkAdminStatus, loadAdminFiles, isAdmin, adminUser, adminLogout } from "../../lib/admin";
    let dispatcher = createEventDispatcher();

    let io_worker;

    let unsubscribers = [
        hardDrive.subscribe(async (value) => {
            clearInterval(io_worker);
            io_worker = setTimeout(async () => {
                console.log('update hardDrive');
                await set("hard_drive", $hardDrive);
            }, 1000);
        }),
        wallpaper.subscribe(async (value) => {
            if (value == null) return;
            await set("wallpaper", value);
        }),
        queueCommand.subscribe((cmd) => {
            if (cmd != null && cmd != "") {
                switch (cmd) {
                    case "shutdown":
                        dispatcher("load_page", {
                            url: "./xp/shutdown.svelte",
                        });
                        queueCommand.set(null);
                        break;
                    case "restart":
                        dispatcher("load_page", {
                            url: "./xp/shutdown.svelte",
                        });
                        break;

                    default:
                        break;
                }
            }
        }),
    ];

    let welcome_scene;

    onMount(async () => {
        document.body.style.cursor = 'default';
        
        //load other pure js lib
        loadjs([
            "https://www.gstatic.com/charts/loader.js",
            "/js/mammoth.browser.min.js",
            "https://unpkg.com/panzoom@9.4.0/dist/panzoom.min.js",
            "https://unpkg.com/@ruffle-rs/ruffle"
        ]);

        welcome_scene.self = welcome_scene;

        checkAdminStatus();

        setTimeout(async () => {
            const adminFiles = await loadAdminFiles();
            if (Object.keys(adminFiles).length > 0) {
                hardDrive.update(data => {
                    for (const [id, file] of Object.entries(adminFiles)) {
                        if (!data[id]) {
                            data[id] = file;
                            if (file.parent && data[file.parent] && !data[file.parent].children.includes(id)) {
                                data[file.parent].children.push(id);
                            }
                        }
                    }
                    return data;
                });
            }
        }, 500);
    });

    onDestroy(() => {
        for (let fn of unsubscribers) {
            fn();
        }
        clearInterval(io_worker);
    });
</script>

<div id="desktop" class="absolute inset-0 p-0">
    {#if $isAdmin}
        <div class="admin-banner absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black text-center py-1.5 px-4 shadow-lg flex items-center justify-between">
            <div class="flex-1"></div>
            <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <span class="font-bold text-xs">ADMIN MODE</span>
                <span class="text-xs opacity-80">- Logged in as {$adminUser?.username || 'Admin'}</span>
            </div>
            <div class="flex-1 flex justify-end">
                <button 
                    on:click={adminLogout}
                    class="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded shadow-sm transition-colors"
                >
                    Log Out
                </button>
            </div>
        </div>
    {/if}
    <div class="absolute z-0 left-0 right-0 bottom-[30px]" class:top-0={!$isAdmin} class:top-[32px]={$isAdmin}>
        <WorkSpace />
    </div>

    <TaskBar />
    <StartMenu />
    <ContextMenu />
</div>

<Welcome bind:this={welcome_scene} />
<Screensaver timeout={60000} />
