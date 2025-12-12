import{c as z,a as S,v as d,h as k,j as D,e as r}from"../../../../_app/immutable/chunks/index-ff400fad.js";import{W as T}from"../../../../_app/immutable/chunks/Window-e98aeb2f.js";import{B as g}from"../../../../_app/immutable/chunks/Button-c9221fbd.js";import{T as j}from"../../../../_app/immutable/chunks/Tab-945f1ef4.js";import{C as $}from"../../../../_app/immutable/chunks/CheckBox-734e15d0.js";import{h as F,r as L}from"../../../../_app/immutable/chunks/store-3e4ea696.js";import{i as B}from"../../../../_app/immutable/chunks/system-eda41220.js";import{f as b}from"../../../../_app/immutable/chunks/utils-a62a4de9.js";import W from"lodash";import"../../../../_app/immutable/chunks/finder-762cc408.js";import"../../../../_app/immutable/chunks/TitleBar-7840ae1a.js";import"idb-keyval";/* empty css                                                                             */import"../../../../_app/immutable/chunks/index-2945f287.js";const V=z((o,i,t,A)=>{let c,u;u=S(F,a=>c=a);let{id:x}=i,{window:n}=i,{self:f}=i,{fs_item:s}=i,{exec_path:m}=i,e={type:s.type=="drive"?"Local Disk":"Removable Storage",format:"FAT32",used_space:y(s.id)};e.used_space>e.capacity?e.capacity=e.used_space:e.capacity=s.capacity,e.free_space=e.capacity-e.used_space;function p(){L.update(a=>a.filter(v=>v!=f)),f.$destroy()}let{options:w={title:"Properties",min_width:370,min_height:570,width:370,height:570,icon:null,id:x,resizable:!1,maximize_btn:!1,minimize_btn:!1,exec_path:m}}=i;function y(a){let v=W.sum(c[a].children.map(l=>c[l]).filter(l=>l.type=="file").map(l=>l.size)),C=c[a].children.filter(l=>c[l].type=="folder");for(let l of C)v+=y(l);return v}i.id===void 0&&t.id&&x!==void 0&&t.id(x),i.window===void 0&&t.window&&n!==void 0&&t.window(n),i.self===void 0&&t.self&&f!==void 0&&t.self(f),i.fs_item===void 0&&t.fs_item&&s!==void 0&&t.fs_item(s),i.exec_path===void 0&&t.exec_path&&m!==void 0&&t.exec_path(m),i.destroy===void 0&&t.destroy&&p!==void 0&&t.destroy(p),i.options===void 0&&t.options&&w!==void 0&&t.options(w);let h,_;do h=!0,_=`${d(T,"Window").$$render(o,{options:w,on_click_close:p,this:n},{this:a=>{n=a,h=!1}},{content:()=>`<div slot="content" class="absolute inset-1 p-2 pb-1 bg-xp-yellow overflow-hidden">${d(j,"Tab").$$render(o,{size:"sm",items:["General","Tools","Hardware","Sharing","Quota"],selected:"General"},{},{})}
        <div class="w-full grow bg-[#fafaf9] shadow-sm -mt-[1px] overflow-hidden p-2"><div class="flex flex-row border-b-slate-300 border-b p-2 items-center my-3"><div class="shrink-0 w-[70px]">${s.type=="file"?`<div class="w-[50px] h-[50px] shrink-0 bg-[url(/images/xp/icons/Default.png)] bg-contain"${k({"background-image":B[s.ext]!=null?`url(/images/xp/icons/${B[s.ext]})`:""})}></div>`:`<div class="w-[50px] h-[50px] shrink-0 bg-[url(/images/xp/icons/FolderClosed.png)] bg-contain"${k({"background-image":s.icon==null?"":`url(${s.icon})`})}></div>`}</div>
                <div class="grow ml-2"><input disabled class="border w-full border-slate-400 outline-none text-[12px] pt-0.5 pl-0.5 pb-2"${D("value",s.name,0)}></div></div>

            
            <div class="flex flex-row px-2 my-3 text-[12px] text-slate-800"><div class="shrink-0 w-[70px]">Type
                </div>
                <div class="grow ml-2">${r(e.type)}</div></div>

            <div class="flex flex-row px-2 pb-2 my-3 text-[12px] text-slate-800 border-b border-slate-300"><div class="shrink-0 w-[70px]">File System
                </div>
                <div class="grow ml-2">${r(e.format)}</div></div>

            <div class="flex flex-row px-2 my-3 text-[12px] text-slate-800"><div class="shrink-0 w-[100px]"><div class="w-3 h-3 inline-block bg-blue-700 border border-slate-700 mr-1"></div>
                    <span class="text-[12px]">Used space</span></div>
                <div class="grow ml-2 flex justify-between"><p>${r((e.used_space*1024).toLocaleString())} bytes</p>
                    <p>${r(b(e.used_space*1024))}</p></div></div>

            <div class="flex flex-row px-2 pb-2 my-3 text-[12px] text-slate-800 border-b border-slate-300"><div class="shrink-0 w-[100px]"><div class="w-3 h-3 inline-block bg-pink-500 border border-slate-700 mr-1"></div>
                    <span class="text-[12px]">Free space</span></div>
                <div class="grow ml-2 flex justify-between"><p>${r((e.free_space*1024).toLocaleString())} bytes</p>
                    <p>${r(b(e.free_space*1024))}</p></div></div>

            <div class="flex flex-row px-2 pb-2 my-3 text-[12px] text-slate-800"><div class="shrink-0 w-[100px]"><div class="w-3 h-3 inline-block mr-1"></div>
                    <span class="text-[12px]">Capacity</span></div>
                <div class="grow ml-2 flex justify-between"><p>${r((e.capacity*1024).toLocaleString())} bytes</p>
                    <p>${r(b(e.capacity*1024))}</p></div></div>

            <div class="chart w-full h-[100px]"></div>


            <div class="px-2 my-3 mb-6 text-[12px] text-slate-800">${d($,"CheckBox").$$render(o,{checked:!1,label:"Compress drive to save disk space"},{},{})}
                ${d($,"CheckBox").$$render(o,{checked:!0,checkmark:!1,label:"Allow Indexing Service to index this disk for fast file searching",style:"margin-top:10px;"},{},{})}</div></div>
        <div class="flex flex-row justify-end items-center px-1 pt-2 mt-1">${d(g,"Button").$$render(o,{title:"OK",style:"margin-right:10px;",on_click:p},{},{})}
            ${d(g,"Button").$$render(o,{title:"Cancel",on_click:p},{},{})}</div></div>`})}


`;while(!h);return u(),_});export{V as default};
