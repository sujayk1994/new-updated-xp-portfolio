<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import Button from '../../../lib/components/xp/Button.svelte';
    import {onMount } from 'svelte';
    import { runningPrograms, zIndex } from '../../../lib/store'
    import Menu from '../../../lib/components/xp/Menu.svelte';
    import RButton from '../../../lib/components/xp/RButton.svelte';
    import ProgressBar from '../../../lib/components/xp/ProgressBar.svelte';
    import buildUrl from 'build-url';
    import isURL from 'is-valid-http-url';
    import * as fs from '../../../lib/fs';
    import * as utils from '../../../lib/utils';
    import * as finder from '../../../lib/finder';

    export let id;
    export let window;
    export let self;
    export let url;
    export let exec_path;

    let iframe;
    let address_bar;
    let youtubeHomepage = 'youtube://home';
    let homepage = url ? url : youtubeHomepage;
    let history = [homepage];
    
    let page_index = 0;
    let loading = true;
    let currentUrl = homepage;

    let real_url;
    let showYouTube = true;
    let currentVideo = null;
    let searchQuery = '';
    
    let videos = [];
    let videosLoading = true;
    let videosError = null;
    let profilePhoto = '';

    $: currentUrl = history[page_index];

    async function loadVideos() {
        videosLoading = true;
        videosError = null;
        try {
            const response = await fetch('/api/videos');
            const data = await response.json();
            if (data.success) {
                videos = data.videos;
            } else {
                videosError = data.error || 'Failed to load videos';
            }
        } catch (e) {
            videosError = 'Failed to connect to server';
        }
        videosLoading = false;
    }

    async function loadProfilePhoto() {
        try {
            const response = await fetch('/api/admin/about-me');
            const data = await response.json();
            if (data.success && data.content && data.content.profilePhoto) {
                profilePhoto = data.content.profilePhoto;
            }
        } catch (e) {
            console.error('Failed to load profile photo');
        }
    }

    $: filteredVideos = searchQuery 
        ? videos.filter(v => 
            v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.channel.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : videos;

    onMount(async () => {
        await loadVideos();
        await loadProfilePhoto();
        
        if (history[page_index] === youtubeHomepage || history[page_index].startsWith('youtube://')) {
            showYouTube = true;
            loading = false;
        } else {
            showYouTube = false;
            real_url = await to_real_url(history[page_index]);
        }
    })

    function on_user_input(e){
        if(e.key == 'Enter'){
            load_page();
        }
    }

    async function load_page(){
        loading = true;
        let url = address_bar.value;
        if(url == null || url.trim() == '') return;

        if (url === youtubeHomepage || url.startsWith('youtube://')) {
            showYouTube = true;
            if (url === youtubeHomepage) {
                currentVideo = null;
            } else if (url.startsWith('youtube://watch/')) {
                const videoId = url.replace('youtube://watch/', '');
                currentVideo = videos.find(v => v.id === videoId) || null;
            }
            loading = false;
            history = [...history.slice(0, page_index+1), url];
            page_index++;
            return;
        }

        if(/^[A-Z]:\\/.test(url)){

        } else if(!url.startsWith('https://') && !url.startsWith('http://')){
            url = 'https://' + url;
            if(!isURL(url)){
                url = buildUrl('https://bing.com', {
                    path: 'search',
                    queryParams: {
                        q: address_bar.value.trim()
                    }
                })
            }
        } 

        showYouTube = false;
        currentVideo = null;
        history = [...history.slice(0, page_index+1), url];
        page_index++;
        console.log(history);
        real_url = await to_real_url(history[page_index]);
    }

    async function back(){
        page_index = page_index - 1;
        const prevUrl = history[page_index];
        if (prevUrl === youtubeHomepage || prevUrl.startsWith('youtube://')) {
            showYouTube = true;
            if (prevUrl === youtubeHomepage) {
                currentVideo = null;
            } else if (prevUrl.startsWith('youtube://watch/')) {
                const videoId = prevUrl.replace('youtube://watch/', '');
                currentVideo = videos.find(v => v.id === videoId) || null;
            }
            loading = false;
        } else {
            showYouTube = false;
            currentVideo = null;
            real_url = await to_real_url(prevUrl);
        }
    }

    async function next(){
        page_index = page_index + 1;
        const nextUrl = history[page_index];
        if (nextUrl === youtubeHomepage || nextUrl.startsWith('youtube://')) {
            showYouTube = true;
            if (nextUrl === youtubeHomepage) {
                currentVideo = null;
            } else if (nextUrl.startsWith('youtube://watch/')) {
                const videoId = nextUrl.replace('youtube://watch/', '');
                currentVideo = videos.find(v => v.id === videoId) || null;
            }
            loading = false;
        } else {
            showYouTube = false;
            currentVideo = null;
            real_url = await to_real_url(nextUrl);
        }
    }

    function iframe_loaded(){
        loading = false;
    }

    async function to_real_url(url){
        if(/^[A-Z]:\\/.test(url)){
            let file = await fs.get_file(finder.to_id(url));
            return URL.createObjectURL(file);
        } else {
            return url;
        }
    }

    function playVideo(video) {
        currentVideo = video;
        const videoUrl = `youtube://watch/${video.id}`;
        history = [...history.slice(0, page_index+1), videoUrl];
        page_index++;
    }

    function goToHome() {
        currentVideo = null;
        searchQuery = '';
        const homeUrl = youtubeHomepage;
        history = [...history.slice(0, page_index+1), homeUrl];
        page_index++;
    }

    export function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    let ws_size = {width: document.querySelector('#work-space').offsetWidth, height: document.querySelector('#work-space').offsetHeight};

    export let options = {
        title: 'Microsoft Internet Explorer',
        min_width: 500,
        min_height: 400,
        width: Math.min(ws_size.width - 20, (ws_size.height - 20)*1.6),
        height: Math.min(ws_size.height - 20),
        icon: '/images/xp/icons/InternetExplorer6.png',
        id: id,
        exec_path
    };

    let menu = [
        {
            name: 'File',
            items: [
                [
                    {
                        name: 'Create Shortcut',
                        disabled: true
                    }
                ],
                [
                    {
                        name: 'Close',
                        action: () => {destroy();}
                    }
                ]
            ]
        },
        
        {
            name: 'View',
            items: [
                [
                    {
                        name: 'Toolbars'
                    },
                    {
                        name: 'Status Bar'
                    },
                    {
                        name: 'Explorer Bar'
                    }
                ],
                [
                    {
                        name: 'Thumbnails'
                    },
                    {
                        name: 'Tiles'
                    },
                    {
                        name: 'Icons'
                    },
                    {
                        name: 'List'
                    },
                    {
                        name: 'Details'
                    }
                ],
                [
                    {
                        name: 'Choose Details...'
                    },
                    {
                        name: 'Go To'
                    },
                    {
                        name: 'Refresh'
                    }
                ]
            ]
        },
        {
            name: 'Favorites',
            items: [
                [
                    {
                        name: 'Add to Favorites...'
                    },
                    {
                        name: 'Organize Favorites'
                    }
                ],
                [
                    {
                        name: 'Links',
                        icon: '/images/xp/icons/FolderClosed.png'
                    },
                    {
                        name: 'MSN.com',
                        icon: '/images/xp/icons/URL.png'
                    },
                    {
                        name: 'Radio Station Guide',
                        icon: '/images/xp/icons/URL.png'
                    }
                ]
            ]
        },
        {
            name: 'Tools',
            items: [
                [
                    {
                        name: 'Map Network Drive...'
                    },
                    {
                        name: 'Disconnect Network Drive...'
                    },
                    {
                        name: 'Synchronize...'
                    }
                ],
                [
                    {
                        name: 'Folder Options...'
                    }
                ]
            ]
        },
        {
            name: 'Help',
            items: [
                [
                    {
                        name: 'Help and Support Center'
                    },
                    {
                        name: 'Is this copy legal?'
                    }
                ],
                [
                    {
                        name: 'About Windows'
                    }
                ]
            ]
        }
    ]
</script>

<Window options={options} bind:this={window} on_click_close={destroy}>
    
    <div slot="content" class="absolute inset-1 top-0 flex flex-col bg-xp-yellow">
        <div class="shrink-0 w-full border-b border-stone-300 flex flex-row items-center justify-between">
            <Menu menu={menu}></Menu>
            <div class="w-[40px] h-full bg-slate-50  flex items-center justify-center">
                <div class="w-[20px] h-[20px] bg-[url(/images/ms.png)] bg-contain bg-center bg-no-repeat"></div>
            </div>
        </div>
        <div class="shrink-0 flex flex-row items-center border-b border-stone-300 overflow-hidden">
            <RButton icon="/images/xp/icons/Back.png" title="Back" 
                    on_click={back}
                    expandable={true} disabled={page_index == 0} tooltip_message="Back to Previous"></RButton>
            <RButton icon="/images/xp/icons/Forward.png" 
                    on_click={next}
                    expandable={true} disabled={page_index == history.length-1}></RButton>

            <RButton icon="/images/xp/icons/IEStop.png"></RButton>
            <RButton icon="/images/xp/icons/IERefresh.png" 
                on_click={() => {
                    if (showYouTube) {
                        loadVideos();
                    } else if (iframe) {
                        var src = iframe.src;
                        iframe.src = src;
                    }
                }}></RButton>
            <RButton icon="/images/xp/icons/IEHome.png"
                on_click={() => {
                    showYouTube = true;
                    currentVideo = null;
                    searchQuery = '';
                    loading = false;
                    history = [...history.slice(0, page_index+1), youtubeHomepage];
                    page_index++;
                }}>
            </RButton>

            <div class="w-[1px] h-full py-1">
                <div class=" w-full h-full border-l border-stone-300"></div>
            </div>

            <RButton icon="/images/xp/icons/Search.png" title="Search" 
                on_click={() => {
                    address_bar.focus();
                    address_bar.select();
                }}>
            </RButton>

            <RButton icon="/images/xp/icons/Favorites.png" title="Favorites"></RButton>
            <RButton icon="/images/xp/icons/IEHistory.png"></RButton>

            <div class="w-[1px] h-full py-1">
                <div class=" w-full h-full border-l border-stone-300"></div>
            </div>

            <RButton icon="/images/xp/icons/Email.png" expandable={true}></RButton>
            <RButton icon="/images/xp/icons/Fax.png"></RButton>
            <RButton icon="/images/xp/icons/WindowsMessenger.png"></RButton>
        </div>
        <div class="shrink-0 flex flex-row items-center border-b border-stone-300 text-[11px] items-center">
            <span class="px-2 text-slate-800">Address</span>
            <div class="grow h-[25px] relative">
                <input class="absolute inset-0 pl-6 outline-none" type="text" bind:this={address_bar}
                on:click={(e) => e.target.select()} on:keyup={on_user_input} value="{currentUrl}">
                <div class="w-[17px] h-[17px] absolute top-[4px] left-[4px] bg-[url(/images/xp/icons/URL.png)] bg-contain"></div>
            </div>
            <div on:click={load_page} class="w-[30px] h-[20px] bg-[url(/images/xp/icons/Go.png)] bg-center bg-contain bg-no-repeat cursor-pointer"></div>
        </div>
        
        <div class="grow overflow-hidden" style="font-family: Arial, sans-serif;">
            {#if showYouTube}
                <div class="w-full h-full bg-[#0f0f0f] flex flex-col overflow-hidden">
                    <div class="h-14 bg-[#0f0f0f] flex items-center justify-between px-4 shrink-0 border-b border-[#272727]">
                        <div class="flex items-center gap-4">
                            <button on:click={goToHome} class="flex items-center gap-1 hover:opacity-80">
                                <div class="flex items-center">
                                    <svg viewBox="0 0 28 20" class="h-5 w-auto">
                                        <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
                                        <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
                                    </svg>
                                    <span class="text-white text-xl font-bold ml-1" style="font-family: Arial, sans-serif;">Stube</span>
                                </div>
                            </button>
                        </div>
                        
                        <div class="flex-1 max-w-xl mx-8">
                            <div class="flex items-center bg-[#121212] border border-[#303030] rounded-full overflow-hidden">
                                <input 
                                    type="text" 
                                    placeholder="Search videos"
                                    bind:value={searchQuery}
                                    class="flex-1 bg-transparent text-white text-sm px-4 py-2 outline-none placeholder-gray-400"
                                    style="font-family: Arial, sans-serif;"
                                />
                                <button class="px-5 py-2 bg-[#222222] border-l border-[#303030] hover:bg-[#333333]">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-3">
                            <button class="p-2 hover:bg-[#272727] rounded-full">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                            </button>
                            <button class="p-2 hover:bg-[#272727] rounded-full">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                </svg>
                            </button>
                            {#if profilePhoto}
                                <img src={profilePhoto} alt="Profile" class="w-8 h-8 rounded-full object-cover" />
                            {:else}
                                <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    S
                                </div>
                            {/if}
                        </div>
                    </div>
                    
                    {#if currentVideo}
                        <div class="flex-1 flex overflow-hidden">
                            <div class="flex-1 overflow-y-auto p-6">
                                <div class="max-w-4xl">
                                    <div class="aspect-video bg-black rounded-xl overflow-hidden">
                                        <iframe 
                                            src="{currentVideo.youtubeUrl}?autoplay=1" 
                                            class="w-full h-full"
                                            frameborder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowfullscreen
                                            title={currentVideo.title}
                                        ></iframe>
                                    </div>
                                    
                                    <h1 class="text-white text-xl font-medium mt-3">{currentVideo.title}</h1>
                                    
                                    <div class="flex items-center justify-between mt-3 flex-wrap gap-3">
                                        <div class="flex items-center gap-3">
                                            {#if profilePhoto}
                                                <img src={profilePhoto} alt="Channel" class="w-10 h-10 rounded-full object-cover" />
                                            {:else}
                                                <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                                    {currentVideo.channel?.charAt(0) || 'S'}
                                                </div>
                                            {/if}
                                            <div>
                                                <p class="text-white text-sm font-medium">{currentVideo.channel}</p>
                                                <p class="text-gray-400 text-xs">Portfolio Channel</p>
                                            </div>
                                            <button class="ml-4 bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200">
                                                Subscribe
                                            </button>
                                        </div>
                                        
                                        <div class="flex items-center gap-2">
                                            <div class="flex items-center bg-[#272727] rounded-full overflow-hidden">
                                                <button class="flex items-center gap-2 px-4 py-2 hover:bg-[#3f3f3f]">
                                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                                                    </svg>
                                                    <span class="text-white text-sm">Like</span>
                                                </button>
                                                <div class="w-px h-6 bg-[#505050]"></div>
                                                <button class="px-4 py-2 hover:bg-[#3f3f3f]">
                                                    <svg class="w-5 h-5 text-white rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                            <button class="flex items-center gap-2 bg-[#272727] px-4 py-2 rounded-full hover:bg-[#3f3f3f]">
                                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                                </svg>
                                                <span class="text-white text-sm">Share</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-4 bg-[#272727] rounded-xl p-3">
                                        <p class="text-white text-sm">
                                            <span class="font-medium">{currentVideo.views}</span>
                                            <span class="mx-1">•</span>
                                            <span>{currentVideo.time}</span>
                                        </p>
                                        {#if currentVideo.description}
                                            <p class="text-white text-sm mt-2">{currentVideo.description}</p>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="w-80 overflow-y-auto p-4 border-l border-[#272727] hidden lg:block">
                                <h3 class="text-white font-medium mb-4">More Videos</h3>
                                {#each videos.filter(v => v.id !== currentVideo.id) as video}
                                    <button 
                                        class="w-full flex gap-2 mb-3 hover:bg-[#272727] rounded-lg p-1 text-left"
                                        on:click={() => playVideo(video)}
                                    >
                                        <div class="relative w-40 shrink-0">
                                            <img src={video.thumbnail} alt={video.title} class="w-full aspect-video object-cover rounded-lg bg-gray-800">
                                            <span class="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">{video.duration}</span>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <h4 class="text-white text-sm font-medium line-clamp-2">{video.title}</h4>
                                            <p class="text-gray-400 text-xs mt-1">{video.channel}</p>
                                            <p class="text-gray-400 text-xs">{video.views} • {video.time}</p>
                                        </div>
                                    </button>
                                {/each}
                            </div>
                        </div>
                    {:else}
                        <div class="flex-1 flex overflow-hidden">
                            <div class="w-16 bg-[#0f0f0f] shrink-0 py-3 flex flex-col items-center gap-4 border-r border-[#272727]">
                                <button on:click={goToHome} class="flex flex-col items-center gap-1 text-white hover:bg-[#272727] rounded-lg p-2 w-14">
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                    </svg>
                                    <span class="text-[10px]">Home</span>
                                </button>
                                <button class="flex flex-col items-center gap-1 text-gray-400 hover:bg-[#272727] rounded-lg p-2 w-14">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                    </svg>
                                    <span class="text-[10px]">Videos</span>
                                </button>
                            </div>
                            
                            <div class="flex-1 overflow-y-auto p-6">
                                {#if videosLoading}
                                    <div class="flex items-center justify-center h-64">
                                        <div class="text-gray-400">Loading videos...</div>
                                    </div>
                                {:else if videosError}
                                    <div class="flex flex-col items-center justify-center h-64 gap-4">
                                        <div class="text-gray-400">{videosError}</div>
                                        <button 
                                            on:click={loadVideos}
                                            class="px-4 py-2 bg-[#272727] text-white rounded-full hover:bg-[#3f3f3f]"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                {:else if filteredVideos.length === 0}
                                    <div class="flex flex-col items-center justify-center h-64 gap-2">
                                        <svg class="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                        </svg>
                                        <div class="text-gray-400 text-center">
                                            {#if searchQuery}
                                                No videos found for "{searchQuery}"
                                            {:else}
                                                No videos available yet
                                            {/if}
                                        </div>
                                    </div>
                                {:else}
                                    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
                                        <button class="px-3 py-1.5 bg-white text-black rounded-lg text-sm font-medium whitespace-nowrap">All</button>
                                        <button class="px-3 py-1.5 bg-[#272727] text-white rounded-lg text-sm whitespace-nowrap hover:bg-[#3f3f3f]">Recent</button>
                                        <button class="px-3 py-1.5 bg-[#272727] text-white rounded-lg text-sm whitespace-nowrap hover:bg-[#3f3f3f]">Popular</button>
                                    </div>
                                    
                                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {#each filteredVideos as video}
                                            <button 
                                                class="text-left group"
                                                on:click={() => playVideo(video)}
                                            >
                                                <div class="relative">
                                                    <img 
                                                        src={video.thumbnail} 
                                                        alt={video.title}
                                                        class="w-full aspect-video object-cover rounded-xl group-hover:rounded-none transition-all bg-gray-800"
                                                    />
                                                    <span class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                                                        {video.duration}
                                                    </span>
                                                </div>
                                                <div class="flex gap-3 mt-3">
                                                    {#if profilePhoto}
                                                        <img src={profilePhoto} alt="Channel" class="w-9 h-9 rounded-full object-cover shrink-0" />
                                                    {:else}
                                                        <div class="w-9 h-9 bg-purple-600 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-medium">
                                                            {video.channel?.charAt(0) || 'S'}
                                                        </div>
                                                    {/if}
                                                    <div class="flex-1 min-w-0">
                                                        <h3 class="text-white text-sm font-medium line-clamp-2 leading-5">
                                                            {video.title}
                                                        </h3>
                                                        <p class="text-gray-400 text-xs mt-1 hover:text-white">
                                                            {video.channel}
                                                        </p>
                                                        <p class="text-gray-400 text-xs">
                                                            {video.views} • {video.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            {:else}
                <iframe bind:this={iframe} 
                    class="w-full h-full bg-slate-50 {window?.z_index == $zIndex ? 'pointer-events-auto' : 'pointer-events-none'}" 
                    src="{real_url}" 
                    on:load={(e) => iframe_loaded(e)} frameborder="0"
                    title="Web page">
                </iframe>
            {/if}
        </div>
        <div class="bg-xp-yellow h-[20px] shrink-0 flex flex-row justify-between items-center px-2">
            <div class="flex flex-row">
                <img src="/images/xp/icons/URL.png" class="w-[15px] h-[15px]" alt="URL icon">
                {#if loading || videosLoading}
                    <ProgressBar style="width:100px;height:15px;margin-left:8px;" value={utils.random_int(50,80)}></ProgressBar>
                {:else}
                    <span class="ml-2 text-[11px]">Done</span>
                {/if}
            </div>
            <div class="flex flex-row">
                <img src="/images/xp/icons/InternetShortcut.png" class="w-[15px] h-[15px]" alt="Internet icon">
                <span class="ml-2 text-[11px]">Internet</span>
            </div>
        </div>
    </div>
</Window>


<svelte:options accessors={true}></svelte:options>
