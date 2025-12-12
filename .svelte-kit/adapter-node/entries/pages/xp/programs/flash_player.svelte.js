import{c as p,a as x,v as u,j as y}from"../../../../_app/immutable/chunks/index-ff400fad.js";import{W as P}from"../../../../_app/immutable/chunks/Window-e98aeb2f.js";import{h as D,r as k}from"../../../../_app/immutable/chunks/store-3e4ea696.js";import{D as N}from"../../../../_app/immutable/chunks/DumbProgress-1d1763f5.js";import"../../../../_app/immutable/chunks/TitleBar-7840ae1a.js";import"lodash";import"idb-keyval";import"../../../../_app/immutable/chunks/index-2945f287.js";import"../../../../_app/immutable/chunks/system-eda41220.js";import"../../../../_app/immutable/chunks/ProgressBar-89c89d51.js";const q=p((h,e,t,W)=>{let n;n=x(D,a=>a);let{id:s}=e,{window:i}=e,{self:l}=e,{parentNode:m}=e,{fs_item:o}=e,{exec_path:r}=e,_;async function d(){k.update(a=>a.filter(w=>w!=l)),l.$destroy()}let{options:f={title:o==null?"Flash Player":o.name,min_width:300,min_height:200,width:600,height:400,icon:"/images/xp/icons/FlashPlayer.png",id:s,exec_path:r}}=e;e.id===void 0&&t.id&&s!==void 0&&t.id(s),e.window===void 0&&t.window&&i!==void 0&&t.window(i),e.self===void 0&&t.self&&l!==void 0&&t.self(l),e.parentNode===void 0&&t.parentNode&&m!==void 0&&t.parentNode(m),e.fs_item===void 0&&t.fs_item&&o!==void 0&&t.fs_item(o),e.exec_path===void 0&&t.exec_path&&r!==void 0&&t.exec_path(r),e.destroy===void 0&&t.destroy&&d!==void 0&&t.destroy(d),e.options===void 0&&t.options&&f!==void 0&&t.options(f);let c,v;do c=!0,o&&i&&i.update_title(o.name),v=`${u(P,"Window").$$render(h,{options:f,on_click_close:d,this:i},{this:a=>{i=a,c=!1}},{content:()=>`<div slot="content" class="absolute inset-1 flex flex-col bg-xp-yellow-light overflow-hidden">${`<div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-slate-500 text-sm p-2 rounded font-mono">${u(N,"DumbProgress").$$render(h,{style:"width:150px;height:15px;"},{},{})}</div>`}

        ${o?`<div class="absolute inset-0"${y("this",_,0)}></div>`:`<div class="my-4 p-2 font-Trebuchet"><p>You can run flash .swf files on this version of Windows XP. Thanks to 
                <a class="text-blue-600 cursor-pointer">Ruffle.
                </a></p>
            <p class="mt-2">Supports for ActionScript 3.0 is limited at the moment.
            </p>
            <p class="mt-2">If you don&#39;t have a flash .swf file, checkout out this 
                <a class="text-blue-600 cursor-pointer" href="https://archive.org/details/softwarelibrary_flash" target="_blank">nostalgic archive
                </a>.
            </p></div>`}</div>`})}

`;while(!c);return n(),v});export{q as default};
