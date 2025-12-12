import{c as e,v as t}from"../../../_app/immutable/chunks/index-ff400fad.js";import o from"./system_tray.svelte.js";import a from"./program_tray.svelte.js";import"../../../_app/immutable/chunks/store-3e4ea696.js";import"../../../_app/immutable/chunks/index-2945f287.js";import"../../../_app/immutable/chunks/system-eda41220.js";import"sortablejs";const c=e((r,s,i,m)=>`<div class="z-10 absolute bottom-0 left-0 right-0 w-full h-[30px] bg-[linear-gradient(var(--xp-gradient))] flex flex-row items-center"><div id="start-menu-btn" class="w-[100px] h-full bg-[url(/images/xp/start_btn_normal.png)] bg-cover hover:brightness-110 shrink-0"></div>

    ${t(a,"ProgramTray").$$render(r,{},{},{})}
    ${t(o,"SystemTray").$$render(r,{},{},{})}</div>`);export{c as default};
