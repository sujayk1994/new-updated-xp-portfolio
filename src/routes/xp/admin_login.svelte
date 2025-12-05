<script>
    import { onMount } from 'svelte';
    import { adminLogin, adminRegister, adminLogout, checkAdminExists, isAdmin, adminUser, adminLoading, showAdminLogin } from '../../lib/admin';
    import * as utils from '../../lib/utils';
    const { click_outside } = utils;

    export let self = null;

    let username = '';
    let password = '';
    let errorMessage = '';
    let adminExists = true;
    let isRegistering = false;

    onMount(async () => {
        adminExists = await checkAdminExists();
        if (!adminExists) {
            isRegistering = true;
        }
    });

    function close() {
        showAdminLogin.set(false);
        if (self && self.$destroy) {
            self.$destroy();
        }
    }

    async function handleSubmit() {
        errorMessage = '';
        
        if (!username.trim() || !password.trim()) {
            errorMessage = 'Please enter username and password';
            return;
        }

        if (isRegistering) {
            if (password.length < 6) {
                errorMessage = 'Password must be at least 6 characters';
                return;
            }
            const result = await adminRegister(username, password);
            if (!result.success) {
                errorMessage = result.error;
            } else {
                close();
                window.location.reload();
            }
        } else {
            const result = await adminLogin(username, password);
            if (!result.success) {
                errorMessage = result.error;
            } else {
                close();
                window.location.reload();
            }
        }
    }

    async function handleLogout() {
        await adminLogout();
    }

    function handleKeydown(event) {
        if (event.key === 'Enter') {
            handleSubmit();
        }
        if (event.key === 'Escape') {
            close();
        }
    }
</script>

<div class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" on:click|self={close}>
    <div class="xp-window w-[380px] shadow-2xl" use:click_outside on:click_outside={close}>
        <div class="xp-titlebar flex items-center justify-between px-1 h-[26px] select-none"
             style="background: linear-gradient(180deg, #0a246a 0%, #0a246a 3%, #a6caf0 4%, #0a246a 5%, #0a246a 100%);">
            <div class="flex items-center gap-1">
                <img src="/images/xp/icons/UserAccounts.png" alt="" class="w-4 h-4" />
                <span class="text-white text-xs font-bold drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]">
                    {$isAdmin ? 'Admin Panel' : (isRegistering ? 'Create Admin Account' : 'Admin Login')}
                </span>
            </div>
            <button class="xp-close-btn w-5 h-[18px] flex items-center justify-center text-[10px]" on:click={close}>
                ✕
            </button>
        </div>

        <div class="bg-[#ece9d8] p-4">
            {#if $isAdmin}
                <div class="text-center">
                    <div class="flex items-center justify-center gap-2 mb-4">
                        <img src="/images/xp/icons/UserAccounts.png" alt="" class="w-12 h-12" />
                        <div class="text-left">
                            <div class="text-sm font-bold">Logged in as:</div>
                            <div class="text-lg text-blue-800">{$adminUser?.username}</div>
                        </div>
                    </div>
                    <p class="text-xs text-gray-600 mb-4">
                        You are currently logged in as admin. Any files or folders you create will be saved permanently and visible to all visitors.
                    </p>
                    <button 
                        class="xp-button px-6 py-1"
                        on:click={handleLogout}
                    >
                        Log Out
                    </button>
                </div>
            {:else}
                <div class="flex gap-4">
                    <img src="/images/xp/icons/UserAccounts.png" alt="" class="w-12 h-12 shrink-0" />
                    <div class="flex-1">
                        {#if isRegistering}
                            <p class="text-xs text-gray-600 mb-3">
                                Create your admin account to manage portfolio content. This will be the only admin account.
                            </p>
                        {:else}
                            <p class="text-xs text-gray-600 mb-3">
                                Enter your credentials to access admin mode and make permanent changes.
                            </p>
                        {/if}

                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <label class="text-xs w-20 text-right">User name:</label>
                                <input 
                                    type="text" 
                                    bind:value={username}
                                    on:keydown={handleKeydown}
                                    class="xp-input flex-1 px-1 py-0.5 text-xs"
                                    placeholder="admin"
                                />
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-xs w-20 text-right">Password:</label>
                                <input 
                                    type="password" 
                                    bind:value={password}
                                    on:keydown={handleKeydown}
                                    class="xp-input flex-1 px-1 py-0.5 text-xs"
                                />
                            </div>
                        </div>

                        {#if errorMessage}
                            <div class="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 p-1 rounded">
                                {errorMessage}
                            </div>
                        {/if}
                    </div>
                </div>

                <div class="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-300">
                    {#if !adminExists && !isRegistering}
                        <button 
                            class="xp-button px-4 py-1 text-xs"
                            on:click={() => isRegistering = true}
                        >
                            Create Account
                        </button>
                    {/if}
                    <button 
                        class="xp-button px-4 py-1 text-xs"
                        on:click={handleSubmit}
                        disabled={$adminLoading}
                    >
                        {$adminLoading ? 'Please wait...' : (isRegistering ? 'Create' : 'OK')}
                    </button>
                    <button 
                        class="xp-button px-4 py-1 text-xs"
                        on:click={close}
                    >
                        Cancel
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .xp-window {
        border: 1px solid #0054e3;
        border-radius: 8px 8px 0 0;
        overflow: hidden;
    }

    .xp-titlebar {
        background: linear-gradient(180deg, 
            #0058e6 0%, 
            #3a93ff 3%, 
            #288eff 6%,
            #0054e3 90%,
            #0048c8 100%
        );
        border-bottom: 1px solid #0048c8;
    }

    .xp-close-btn {
        background: linear-gradient(180deg, #e35f5f 0%, #c83232 50%, #d14848 100%);
        border: 1px solid #3d3d3d;
        border-radius: 3px;
        color: white;
        font-weight: bold;
    }

    .xp-close-btn:hover {
        background: linear-gradient(180deg, #ff7070 0%, #e04040 50%, #f05050 100%);
    }

    .xp-close-btn:active {
        background: linear-gradient(180deg, #c83232 0%, #a02828 50%, #b83030 100%);
    }

    .xp-button {
        background: linear-gradient(180deg, #fff 0%, #ece9d8 89%, #d8d4c4 100%);
        border: 1px solid #003c74;
        border-radius: 3px;
        font-size: 11px;
        min-width: 75px;
    }

    .xp-button:hover {
        background: linear-gradient(180deg, #fff 0%, #e3dfce 89%, #ccc8b8 100%);
    }

    .xp-button:active {
        background: linear-gradient(180deg, #d8d4c4 0%, #c0bcac 50%, #d8d4c4 100%);
    }

    .xp-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .xp-input {
        border: 1px solid #7f9db9;
        border-radius: 0;
        background: white;
    }

    .xp-input:focus {
        outline: none;
        border-color: #316ac5;
    }
</style>
