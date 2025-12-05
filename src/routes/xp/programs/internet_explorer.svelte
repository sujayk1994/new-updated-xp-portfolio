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

    let real_url;
    let showYouTube = true;
    let currentVideo = null;
    let searchQuery = '';

    const videos = [
        {
            id: 'video1',
            title: 'Demo Reel 2024 - Creative Works Showcase',
            channel: 'Portfolio Channel',
            views: '12K views',
            time: '2 months ago',
            duration: '3:45',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: 'video2',
            title: 'Motion Graphics Animation Project',
            channel: 'Portfolio Channel',
            views: '8.5K views',
            time: '1 month ago',
            duration: '2:30',
            thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4'
        },
        {
            id: 'video3',
            title: 'Brand Identity Design Process',
            channel: 'Portfolio Channel',
            views: '5.2K views',
            time: '3 weeks ago',
            duration: '4:15',
            thumbnail: 'https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/embed/LXb3EKWsInQ'
        },
        {
            id: 'video4',
            title: 'UI/UX Design Walkthrough',
            channel: 'Portfolio Channel',
            views: '3.1K views',
            time: '1 week ago',
            duration: '5:20',
            thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw'
        }
    ];

    const recommendedVideos = videos.slice(0, 4);

    onMount(async () => {
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
            currentVideo = null;
            loading = false;
            history = [...history.slice(0, page_index+1), url, ...history.slice(page_index+1)];
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
        history = [...history.slice(0, page_index+1), url, ...history.slice(page_index+1)];
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
        if (address_bar) {
            address_bar.value = videoUrl;
        }
    }

    function goToHome() {
        currentVideo = null;
        const homeUrl = youtubeHomepage;
        history = [...history.slice(0, page_index+1), homeUrl];
        page_index++;
        if (address_bar) {
            address_bar.value = homeUrl;
        }
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
                        loading = true;
                        setTimeout(() => loading = false, 300);
                    } else if (iframe) {
                        var src = iframe.src;
                        iframe.src = src;
                    }
                }}></RButton>
            <RButton icon="/images/xp/icons/IEHome.png"
                on_click={() => {
                    address_bar.value = youtubeHomepage;
                    showYouTube = true;
                    currentVideo = null;
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
                on:click={(e) => e.target.select()} on:keyup={on_user_input} value="{history[page_index]}">
                <div class="w-[17px] h-[17px] absolute top-[4px] left-[4px] bg-[url(/images/xp/icons/URL.png)] bg-contain"></div>
            </div>
            <div on:click={load_page} class="w-[30px] h-[20px] bg-[url(/images/xp/icons/Go.png)] bg-center bg-contain bg-no-repeat"></div>
        </div>
        
        <div class="grow overflow-hidden">
            {#if showYouTube}
                <div class="w-full h-full bg-[#0f0f0f] flex flex-col overflow-hidden">
                    <div class="h-14 bg-[#0f0f0f] flex items-center justify-between px-4 shrink-0 border-b border-[#272727]">
                        <div class="flex items-center gap-4">
                            <button on:click={goToHome} class="flex items-center gap-1 hover:opacity-80">
                                <svg viewBox="0 0 90 20" class="h-5 w-auto fill-white">
                                    <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
                                    <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
                                    <path d="M34.6024 19.4328L36.0677 14.5765H40.6105L42.0842 19.4328H45.1467L40.298 5.14752H36.4014L31.5693 19.4328H34.6024ZM37.1364 8.39308H39.5413L40.1989 10.8355L40.9174 13.278H35.778L36.4792 10.8355L37.1364 8.39308Z" fill="white"/>
                                    <path d="M51.5765 19.6872C54.3174 19.6872 56.4043 18.0477 56.4043 14.6847V5.14752H53.4635V14.4302C53.4635 16.2381 52.6499 16.9986 51.5765 16.9986C50.503 16.9986 49.6895 16.2381 49.6895 14.4302V5.14752H46.7487V14.6847C46.7487 18.0477 48.8356 19.6872 51.5765 19.6872Z" fill="white"/>
                                    <path d="M60.5701 19.4328H63.5109V7.83609H66.9851V5.14752H57.0959V7.83609H60.5701V19.4328Z" fill="white"/>
                                    <path d="M74.2116 19.6872C76.9525 19.6872 79.0394 18.0477 79.0394 14.6847V5.14752H76.0986V14.4302C76.0986 16.2381 75.285 16.9986 74.2116 16.9986C73.1381 16.9986 72.3246 16.2381 72.3246 14.4302V5.14752H69.3838V14.6847C69.3838 18.0477 71.4707 19.6872 74.2116 19.6872Z" fill="white"/>
                                    <path d="M83.2052 19.4328H86.146V13.6536H87.5645C89.3559 13.6536 90 12.7489 90 11.1668V7.61953C90 6.03737 89.3559 5.14752 87.5645 5.14752H83.2052V19.4328ZM86.146 7.83609H87.0593C87.2174 7.83609 87.3504 7.87455 87.4585 7.95147C87.5665 8.02839 87.6205 8.15916 87.6205 8.34377V10.9462C87.6205 11.1308 87.5665 11.2616 87.4585 11.3385C87.3504 11.4154 87.2174 11.4539 87.0593 11.4539H86.146V7.83609Z" fill="white"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="flex-1 max-w-xl mx-8">
                            <div class="flex items-center bg-[#121212] border border-[#303030] rounded-full overflow-hidden">
                                <input 
                                    type="text" 
                                    placeholder="Search"
                                    bind:value={searchQuery}
                                    class="flex-1 bg-transparent text-white text-sm px-4 py-2 outline-none placeholder-gray-400"
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
                            <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                U
                            </div>
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
                                        ></iframe>
                                    </div>
                                    
                                    <h1 class="text-white text-xl font-medium mt-3">{currentVideo.title}</h1>
                                    
                                    <div class="flex items-center justify-between mt-3">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                                P
                                            </div>
                                            <div>
                                                <p class="text-white text-sm font-medium">{currentVideo.channel}</p>
                                                <p class="text-gray-400 text-xs">1.2K subscribers</p>
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
                                                    <span class="text-white text-sm">5.1K</span>
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
                                            <button class="flex items-center gap-2 bg-[#272727] px-4 py-2 rounded-full hover:bg-[#3f3f3f]">
                                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                                </svg>
                                                <span class="text-white text-sm">Download</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-4 bg-[#272727] rounded-xl p-3">
                                        <p class="text-white text-sm">
                                            <span class="font-medium">{currentVideo.views}</span>
                                            <span class="mx-1">•</span>
                                            <span>{currentVideo.time}</span>
                                        </p>
                                        <p class="text-white text-sm mt-2">
                                            This is a showcase of creative work from my portfolio. Thank you for watching!
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="w-96 overflow-y-auto p-4 border-l border-[#272727]">
                                <h3 class="text-white font-medium mb-4">Recommended</h3>
                                {#each videos.filter(v => v.id !== currentVideo.id) as video}
                                    <button 
                                        class="w-full flex gap-2 mb-3 hover:bg-[#272727] rounded-lg p-1 text-left"
                                        on:click={() => playVideo(video)}
                                    >
                                        <div class="relative w-40 shrink-0">
                                            <img src={video.thumbnail} alt={video.title} class="w-full aspect-video object-cover rounded-lg">
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
                                <button class="flex flex-col items-center gap-1 text-white hover:bg-[#272727] rounded-lg p-2 w-14">
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                    </svg>
                                    <span class="text-[10px]">Home</span>
                                </button>
                                <button class="flex flex-col items-center gap-1 text-gray-400 hover:bg-[#272727] rounded-lg p-2 w-14">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                    </svg>
                                    <span class="text-[10px]">Shorts</span>
                                </button>
                                <button class="flex flex-col items-center gap-1 text-gray-400 hover:bg-[#272727] rounded-lg p-2 w-14">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                    </svg>
                                    <span class="text-[10px]">Subs</span>
                                </button>
                                <button class="flex flex-col items-center gap-1 text-gray-400 hover:bg-[#272727] rounded-lg p-2 w-14">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    <span class="text-[10px]">You</span>
                                </button>
                            </div>
                            
                            <div class="flex-1 overflow-y-auto p-6">
                                <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
                                    <button class="px-3 py-1.5 bg-white text-black rounded-lg text-sm font-medium whitespace-nowrap">All</button>
                                    <button class="px-3 py-1.5 bg-[#272727] text-white rounded-lg text-sm whitespace-nowrap hover:bg-[#3f3f3f]">Music</button>
                                    <button class="px-3 py-1.5 bg-[#272727] text-white rounded-lg text-sm whitespace-nowrap hover:bg-[#3f3f3f]">Gaming</button>
                                    <button class="px-3 py-1.5 bg-[#272727] text-white rounded-lg text-sm whitespace-nowrap hover:bg-[#3f3f3f]">Live</button>
                                    <button class="px-3 py-1.5 bg-[#272727] text-white rounded-lg text-sm whitespace-nowrap hover:bg-[#3f3f3f]">Motion Graphics</button>
                                    <button class="px-3 py-1.5 bg-[#272727] text-white rounded-lg text-sm whitespace-nowrap hover:bg-[#3f3f3f]">Design</button>
                                    <button class="px-3 py-1.5 bg-[#272727] text-white rounded-lg text-sm whitespace-nowrap hover:bg-[#3f3f3f]">Creative</button>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {#each videos as video}
                                        <button 
                                            class="text-left group"
                                            on:click={() => playVideo(video)}
                                        >
                                            <div class="relative">
                                                <img 
                                                    src={video.thumbnail} 
                                                    alt={video.title}
                                                    class="w-full aspect-video object-cover rounded-xl group-hover:rounded-none transition-all"
                                                >
                                                <span class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                                                    {video.duration}
                                                </span>
                                            </div>
                                            <div class="flex gap-3 mt-3">
                                                <div class="w-9 h-9 bg-purple-600 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-medium">
                                                    P
                                                </div>
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
                            </div>
                        </div>
                    {/if}
                </div>
            {:else}
                <iframe bind:this={iframe} 
                    class="w-full h-full bg-slate-50 {window?.z_index == $zIndex ? 'pointer-events-auto' : 'pointer-events-none'}" 
                    src="{real_url}" 
                    on:load={(e) => iframe_loaded(e)} frameborder="0">
                </iframe>
            {/if}
        </div>
        <div class="bg-xp-yellow h-[20px] shrink-0 flex flex-row justify-between items-center px-2">
            <div class="flex flex-row">
                <img src="/images/xp/icons/URL.png" class="w-[15px] h-[15px]" alt="">
                {#if loading}
                    <ProgressBar style="width:100px;height:15px;margin-left:8px;" value={utils.random_int(50,80)}></ProgressBar>
                {:else}
                    <span class="ml-2 text-[11px]">Done</span>
                {/if}
            </div>
            <div class="flex flex-row">
                <img src="/images/xp/icons/InternetShortcut.png" class="w-[15px] h-[15px]" alt="">
                <span class="ml-2 text-[11px]">Internet</span>
            </div>
        </div>
    </div>
</Window>


<svelte:options accessors={true}></svelte:options>
