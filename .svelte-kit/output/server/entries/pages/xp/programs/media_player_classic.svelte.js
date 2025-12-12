import{c as H,a as u,v as p,j as $,e as w}from"../../../../_app/immutable/chunks/index-ff400fad.js";import{W as k}from"../../../../_app/immutable/chunks/Window-e98aeb2f.js";import{R as V}from"../../../../_app/immutable/chunks/RangeSlider-a327887b.js";import{h as B,z as P,s as R,r as j}from"../../../../_app/immutable/chunks/store-3e4ea696.js";import"../../../../_app/immutable/chunks/system-eda41220.js";import"short-uuid";import"../../../../_app/immutable/chunks/finder-762cc408.js";import"buffer";import"srt-webvtt";import"lodash";import"../../../../_app/immutable/chunks/TitleBar-7840ae1a.js";import"idb-keyval";import"../../../../_app/immutable/chunks/index-2945f287.js";const U=H((a,t,e,I)=>{let v,f,h;v=u(B,l=>l),f=u(P,l=>l),h=u(R,l=>l);let{id:d}=t,{window:s}=t,{self:o}=t,{parentNode:m}=t,{fs_item:g}=t,{exec_path:r}=t,x,_,y,z=.8,M,L,C;function c(){j.update(l=>l.filter(S=>S!=o)),o.$destroy(),clearTimeout(M)}let{options:n={title:"Media Player Classic",min_width:500,min_height:400,width:700,height:500,icon:"/images/xp/icons/MPC.png",id:d,exec_path:r}}=t;t.id===void 0&&e.id&&d!==void 0&&e.id(d),t.window===void 0&&e.window&&s!==void 0&&e.window(s),t.self===void 0&&e.self&&o!==void 0&&e.self(o),t.parentNode===void 0&&e.parentNode&&m!==void 0&&e.parentNode(m),t.fs_item===void 0&&e.fs_item&&g!==void 0&&e.fs_item(g),t.exec_path===void 0&&e.exec_path&&r!==void 0&&e.exec_path(r),t.destroy===void 0&&e.destroy&&c!==void 0&&e.destroy(c),t.options===void 0&&e.options&&n!==void 0&&e.options(n);let i,b;do i=!0,b=`${p(k,"Window").$$render(a,{options:n,on_click_close:c,this:s},{this:l=>{s=l,i=!1}},{content:()=>`<div slot="content" class="absolute inset-0 flex flex-col bg-xp-yellow overflow-hidden"${$("this",L,0)}><p class="z-10 absolute top-2 left-1/2 -translate-x-1/2 p-2 text-center hidden rounded bg-black/70 text-white font-sans"${$("this",C,0)}></p>

        
        

        <div class="grow bg-black w-full flex flex-col items-center justify-center"><img src="/images/xp/icons/MPC.png" class="invert opacity-30" style="" width="150px" height="auto" alt="">
            <button class="outline-none bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 rounded mt-8 text-slate-100 text-sm py-2 px-4">Open files...
            </button></div>

        <div class="${w("shrink-0 w-full",!0)+" "+w("",!0)+" flex flex-col bg-xp-yellow"}"><div class="shrink-0 w-full">${p(V,"RangeSlider").$$render(a,{max:parseInt(y),values:[parseInt(_)],id:"wmp-slider",springValues:{stiffness:.3,damping:1},this:x},{this:l=>{x=l,i=!1}},{})}</div>
            <div class="shrink-0 w-full flex flex-row justify-between items-center"><div class="flex flex-row items-center">
                    <button tooltip="Play/Pause [Space]" disabled class="w-5 h-5 p-1 m-1 group outline-none">
                            <svg class="w-full h-full fill-slate-900 group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg></button>
    
    
                    
                    <button tooltip="Close" disabled class="w-5 h-5 p-1 m-1 group outline-none"><svg class="w-full h-full fill-slate-900 group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"></path></svg></button>
    
                    
                    <button tooltip="Rewind 15s" disabled class="w-5 h-5 p-1 m-1 group outline-none"><svg class="w-full h-full fill-slate-900 group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M493.6 445c-11.2 5.3-24.5 3.6-34.1-4.4L288 297.7V416c0 12.4-7.2 23.7-18.4 29s-24.5 3.6-34.1-4.4L64 297.7V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V96C0 78.3 14.3 64 32 64s32 14.3 32 32V214.3L235.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S288 83.6 288 96V214.3L459.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S512 83.6 512 96V416c0 12.4-7.2 23.7-18.4 29z"></path></svg></button>
    
                    
                    <button tooltip="Rewind 5s [\u2190]" disabled class="w-5 h-5 p-1 m-1 group outline-none"><svg class="w-full h-full fill-slate-900 group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z"></path></svg></button>
    
                    
                    <button tooltip="Forward 5s [\u2192]" disabled class="w-5 h-5 p-1 m-1 group outline-none"><svg class="w-full h-full fill-slate-900 group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z"></path></svg></button>
    
                    
                    <button tooltip="Forward 15s" disabled class="w-5 h-5 p-1 m-1 group outline-none"><svg class="w-full h-full fill-slate-900 group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M18.4 445c11.2 5.3 24.5 3.6 34.1-4.4L224 297.7V416c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4L448 297.7V416c0 17.7 14.3 32 32 32s32-14.3 32-32V96c0-17.7-14.3-32-32-32s-32 14.3-32 32V214.3L276.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S224 83.6 224 96V214.3L52.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S0 83.6 0 96V416c0 12.4 7.2 23.7 18.4 29z"></path></svg></button>
    
                    
                    <button tooltip="Loop" disabled class="w-5 h-5 p-1 m-1 group outline-none"><svg class="${"w-full h-full fill-slate-900 "+w("",!0)+" group-disabled:fill-slate-400"}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z"></path></svg></button>

                    
                    <button tooltip="Fullscreen" disabled class="w-5 h-5 p-1 m-1 group outline-none"><svg class="w-full h-full fill-slate-900 group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"></path></svg></button></div>
                <div class="flex flex-row items-end"><div class="w-4 h-4 mb-1 "></div>
                    <div class="w-[80px] h-[20px] mr-5 mb-1 relative"><div class="absolute top-0 left-0" style="width: 0px; height: 0px; border-style: solid; border-width: 0px 0px 20px 80px; border-color: transparent transparent rgb(215, 218, 218);"></div>
                        <div class="absolute left-1 bottom-0 right-1">${p(V,"RangeSlider").$$render(a,{max:1,step:.01,values:[z],springValues:{stiffness:.9,damping:1},id:"wmp-volume-slider"},{},{})}</div></div></div></div>
    
            <div class="shrink-0 bg-black flex flex-row justify-between items-center p-2 basis-8"><div class="text-[12px] text-slate-50">Closed</div></div></div></div>`})}




`;while(!i);return v(),f(),h(),b});export{U as default};
