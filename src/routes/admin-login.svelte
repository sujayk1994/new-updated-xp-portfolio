<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { adminLogin, adminRegister, adminLogout, checkAdminExists, isAdmin, adminUser, adminLoading, showAdminLogin, checkAdminStatus } from '../lib/admin';

    let username = '';
    let password = '';
    let errorMessage = '';
    let adminExists = true;
    let isRegistering = false;
    let loaded = false;

    onMount(async () => {
        await checkAdminStatus();
        adminExists = await checkAdminExists();
        if (!adminExists) {
            isRegistering = true;
        }
        loaded = true;
    });

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
                goto('/');
            }
        } else {
            const result = await adminLogin(username, password);
            if (!result.success) {
                errorMessage = result.error;
            } else {
                goto('/');
            }
        }
    }

    async function handleLogout() {
        await adminLogout();
        goto('/');
    }

    function handleKeydown(event) {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }

    function goHome() {
        goto('/');
    }
</script>

<svelte:head>
    <title>Admin Login - Windows XP</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-[#235fd9] to-[#0a246a] flex items-center justify-center">
    <div class="w-[420px]">
        <div class="admin-banner bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black text-center py-2 px-4 mb-4 rounded-t-lg shadow-lg">
            <div class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <span class="font-bold text-sm">ADMIN MODE</span>
            </div>
            <p class="text-xs mt-1 opacity-80">You are accessing the admin control panel</p>
        </div>

        <div class="xp-window shadow-2xl rounded-lg overflow-hidden">
            <div class="xp-titlebar flex items-center justify-between px-2 h-[30px] select-none"
                 style="background: linear-gradient(180deg, #0058e6 0%, #3a93ff 3%, #288eff 6%, #0054e3 90%, #0048c8 100%);">
                <div class="flex items-center gap-2">
                    <img src="/images/xp/icons/UserAccounts.png" alt="" class="w-4 h-4" />
                    <span class="text-white text-sm font-bold drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]">
                        {#if !loaded}
                            Loading...
                        {:else if $isAdmin}
                            Admin Panel
                        {:else if isRegistering}
                            Create Admin Account
                        {:else}
                            Admin Login
                        {/if}
                    </span>
                </div>
            </div>

            <div class="bg-[#ece9d8] p-6">
                {#if !loaded}
                    <div class="text-center py-8">
                        <div class="text-gray-600">Loading...</div>
                    </div>
                {:else if $isAdmin}
                    <div class="text-center">
                        <div class="flex items-center justify-center gap-3 mb-4">
                            <img src="/images/xp/icons/UserAccounts.png" alt="" class="w-16 h-16" />
                            <div class="text-left">
                                <div class="text-sm font-bold text-gray-700">Logged in as:</div>
                                <div class="text-xl text-blue-800 font-bold">{$adminUser?.username}</div>
                            </div>
                        </div>
                        
                        <div class="bg-green-100 border border-green-300 rounded p-3 mb-4">
                            <p class="text-xs text-green-800">
                                You are currently logged in as admin. Any files or folders you create will be saved permanently and visible to all visitors.
                            </p>
                        </div>

                        <div class="flex gap-3 justify-center">
                            <button 
                                class="xp-button px-6 py-2"
                                on:click={goHome}
                            >
                                Go to Desktop
                            </button>
                            <button 
                                class="xp-button px-6 py-2 bg-red-50"
                                on:click={handleLogout}
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                {:else}
                    <div class="flex gap-4">
                        <img src="/images/xp/icons/UserAccounts.png" alt="" class="w-16 h-16 shrink-0" />
                        <div class="flex-1">
                            {#if isRegistering}
                                <p class="text-sm text-gray-600 mb-4">
                                    Create your admin account to manage portfolio content. This will be the only admin account.
                                </p>
                            {:else}
                                <p class="text-sm text-gray-600 mb-4">
                                    Enter your credentials to access admin mode and make permanent changes.
                                </p>
                            {/if}

                            <div class="space-y-3">
                                <div class="flex items-center gap-3">
                                    <label class="text-sm w-24 text-right font-medium">User name:</label>
                                    <input 
                                        type="text" 
                                        bind:value={username}
                                        on:keydown={handleKeydown}
                                        class="xp-input flex-1 px-2 py-1 text-sm"
                                        placeholder="admin"
                                    />
                                </div>
                                <div class="flex items-center gap-3">
                                    <label class="text-sm w-24 text-right font-medium">Password:</label>
                                    <input 
                                        type="password" 
                                        bind:value={password}
                                        on:keydown={handleKeydown}
                                        class="xp-input flex-1 px-2 py-1 text-sm"
                                    />
                                </div>
                            </div>

                            {#if errorMessage}
                                <div class="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
                                    {errorMessage}
                                </div>
                            {/if}
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-300">
                        {#if !adminExists && !isRegistering}
                            <button 
                                class="xp-button px-5 py-1.5"
                                on:click={() => isRegistering = true}
                            >
                                Create Account
                            </button>
                        {/if}
                        <button 
                            class="xp-button px-5 py-1.5"
                            on:click={handleSubmit}
                            disabled={$adminLoading}
                        >
                            {$adminLoading ? 'Please wait...' : (isRegistering ? 'Create' : 'Login')}
                        </button>
                        <button 
                            class="xp-button px-5 py-1.5"
                            on:click={goHome}
                        >
                            Cancel
                        </button>
                    </div>
                {/if}
            </div>
        </div>

        <div class="text-center mt-4">
            <button 
                class="text-white/70 hover:text-white text-sm underline"
                on:click={goHome}
            >
                Return to Desktop
            </button>
        </div>
    </div>
</div>

<style>
    .xp-window {
        border: 1px solid #0054e3;
    }

    .xp-titlebar {
        border-bottom: 1px solid #0048c8;
    }

    .xp-button {
        background: linear-gradient(180deg, #fff 0%, #ece9d8 89%, #d8d4c4 100%);
        border: 1px solid #003c74;
        border-radius: 3px;
        font-size: 12px;
        min-width: 80px;
        cursor: pointer;
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

    .admin-banner {
        animation: pulse-glow 2s ease-in-out infinite;
    }

    @keyframes pulse-glow {
        0%, 100% {
            box-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
        }
        50% {
            box-shadow: 0 0 20px rgba(234, 179, 8, 0.8);
        }
    }
</style>
