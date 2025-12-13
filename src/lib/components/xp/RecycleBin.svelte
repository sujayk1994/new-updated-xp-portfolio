<script>
    import { onMount } from 'svelte';
    import { hardDrive, queueProgram, contextMenu } from '../../store';
    import { recycle_bin_id} from '../../system';
    export let style;
    export let classes;

    // Mobile detection
    let isMobile = false;
    function checkMobile() {
        isMobile = window.innerWidth <= 768 || 
            ('ontouchstart' in window) || 
            (navigator.maxTouchPoints > 0);
    }

    // Touch handling for mobile tap-to-open
    let lastTapTime = 0;
    function handleTouchEnd(e) {
        if (!isMobile) return;
        
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        
        // Double-tap detection (within 300ms)
        if (tapLength < 300 && tapLength > 0) {
            e.preventDefault();
            on_dbclick();
            lastTapTime = 0;
        } else {
            lastTapTime = currentTime;
        }
    }

    onMount(() => {
        checkMobile();
        window.addEventListener('resize', checkMobile);
    });

    $: icon = $hardDrive[recycle_bin_id]?.children.length > 0 || $hardDrive[recycle_bin_id]?.children.length > 0 ? 
    'url(/images/xp/icons/RecycleBinfull.png)' : 'url(/images/xp/icons/RecycleBinempty.png)';

    function on_dbclick(){
        let fs_item = $hardDrive[recycle_bin_id];
        queueProgram.set({
            path: './programs/my_computer.svelte',
            fs_item: fs_item
        })
    }

    function on_rightclick(ev){
        contextMenu.set(null);
        contextMenu.set({x: ev.x, y: ev.y, type: 'RecycleBin', originator: null});
    }

</script>

<div class="flex flex-col items-center absolute bottom-2 right-2 {classes}"
    style="{style}"
    on:dblclick={on_dbclick}
    on:contextmenu={on_rightclick}
    on:touchend={handleTouchEnd}
    >
    <div class="w-[40px] h-[40px] bg-contain" style:background-image="{icon}"></div>
    <p class="text-center text-[11px] font-MSSS text-white" style="text-shadow: 1px 1px 2px black;">Recycle Bin</p>

</div>