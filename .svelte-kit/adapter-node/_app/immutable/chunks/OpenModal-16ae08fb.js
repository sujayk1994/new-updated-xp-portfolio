import{c as C,a as I,d as P,j as k,e as n,h as g,f as b,v as w}from"./index-ff400fad.js";import{T as z}from"./TitleBar-7840ae1a.js";import"lodash";import{c as T,h as L,p as O,i as M,d as R,m as V,b as A}from"./system-eda41220.js";import{t as E}from"./finder-762cc408.js";import{h as H}from"./store-3e4ea696.js";import"short-uuid";import"buffer";import{B as D}from"./Button-c9221fbd.js";import{P as U}from"./Previewable-3a8a83f0.js";import"./index-2945f287.js";/* empty css                                             */const q=C((v,t,l,j)=>{let u,x,i,m;m=I(H,e=>i=e),P();let o=[null],a=0,{id:d}=t,c=T.map(e=>i[e]),{selectingItems:s=[]}=t,{filetypes_desc:f}=t,{filetypes:p=[]}=t,{multiple:r=!0}=t;function F(){console.log(s),console.log("clear_selection"),s=[]}function B(e){return e.type!="file"||p.length==0?!0:p.includes(e.ext)}function S(e){F(),i[e]?.type=="file"?(s=[e],h()):(o=[...o.slice(0,a+1),e],a=o.length-1,d=o[a])}function y(e){return e==null?null:e.icon!=null?`url(${e.icon})`:M[e.ext]!=null?`url(/images/xp/icons/${M[e.ext]})`:null}let{on_open:h=()=>{}}=t,{on_cancel:_=()=>{}}=t;return t.id===void 0&&l.id&&d!==void 0&&l.id(d),t.selectingItems===void 0&&l.selectingItems&&s!==void 0&&l.selectingItems(s),t.filetypes_desc===void 0&&l.filetypes_desc&&f!==void 0&&l.filetypes_desc(f),t.filetypes===void 0&&l.filetypes&&p!==void 0&&l.filetypes(p),t.multiple===void 0&&l.multiple&&r!==void 0&&l.multiple(r),t.open===void 0&&l.open&&S!==void 0&&l.open(S),t.on_open===void 0&&l.on_open&&h!==void 0&&l.on_open(h),t.on_cancel===void 0&&l.on_cancel&&_!==void 0&&l.on_cancel(_),u=E(o[a])||"My Computer",x=i[d]==null?[]:i[d].children.map(e=>i[e]).filter(e=>e!=null).filter(e=>!L.includes(e.id)),m(),`<div class="absolute inset-0 overflow-auto bg-xp-yellow flex flex-col"><div class="h-6 mb-2 flex flex-row items-center text-[11px]"><div class="h-full w-[300px] relative"><input class="absolute inset-0 w-[300px] pl-7 border border-blue-300 outline-none" type="text"${k("value",u,0)}>
            <div class="${"w-[17px] h-[17px] absolute top-[4px] left-[4px] bg-no-repeat "+n(d==null?"bg-[url(/images/xp/icons/MyComputer.png)]":"bg-[url(/images/xp/icons/FolderClosed.png)]",!0)+" bg-contain"}"${g({"background-image":y(i[d])})}></div></div>
        <button class="mx-1.5 ml-4 w-4 h-4 bg-[url(/images/xp/icons/Back.png)] bg-contain disabled:grayscale" ${a==0?"disabled":""}></button>

        <button class="mx-1.5 w-4 h-4 bg-[url(/images/xp/icons/Forward.png)] bg-contain disabled:grayscale" ${a==o.length-1?"disabled":""}></button>

        <button class="mx-1.5 w-5 h-5 bg-[url(/images/xp/icons/Up.png)] bg-contain disabled:grayscale" ${o[a]==null?"disabled":""}></button></div>
    <div class="${["w-full bg-slate-50 grow border overflow-auto border-blue-300",d==null?"hidden":""].join(" ").trim()}">${b(x,e=>`<div${k("fs-id",e.id,0)} class="${"w-[100px] overflow-hidden m-2 inline-flex flex-row items-center font-MSSS relative "+n(B(e)?"":"opacity-50",!0)}">${O.includes(e.ext)?`${w(U,"Previewable").$$render(v,{size:30,default_icon:y(e),fs_id:e.id},{},{})}`:`<div class="${"w-[30px] h-[30px] shrink-0 bg-contain bg-no-repeat "+n(e.type=="folder"?"bg-[url(/images/xp/icons/FolderClosed.png)]":"bg-[url(/images/xp/icons/Default.png)]",!0)}"${g({"background-image":y(e)})}></div>`}
                <p class="${"px-1 text-[11px] break-words line-clamp-2 text-ellipsis leading-tight "+n(s?.includes(e.id)?"bg-blue-600 text-slate-50":"",!0)}">${n(e.name)}</p>
                
            </div>`)}</div>

    <div class="${["w-full bg-slate-50 grow border overflow-auto border-blue-300",d!=null?"hidden":""].join(" ").trim()}"><p class="ml-2 mt-0.5 font-MSSS text-black text-[11px] font-bold">Files Stored on This Computer</p>
        <div class="mb-4 w-[300px] h-[2px] bg-gradient-to-r from-blue-500 to-slate-50"></div>
        ${b(c.filter(e=>e.type=="folder"),e=>`<div class="w-[150px] ml-4 mr-8 overflow-hidden inline-flex flex-row items-center font-MSSS"><div class="w-[40px] h-[40px] shrink-0 bg-[url(/images/xp/icons/FolderClosed.png)] bg-contain"${g({"background-image":e.icon==null?"":`url(${e.icon})`})}></div>
                <div class="px-1 text-[11px] line-clamp-2 text-ellipsis leading-tight">${n(e.display_name!=null?e.display_name:e.name)}</div>
            </div>`)}

        <p class="ml-2 mt-4 font-MSSS text-black text-[11px] font-bold">Hard Disk Drives</p>
        <div class="mb-4 w-[300px] h-[2px] bg-gradient-to-r from-blue-500 to-slate-50"></div>
        ${b(c.filter(e=>e.type=="drive"),e=>`<div class="w-[150px] ml-4 mr-8 overflow-hidden inline-flex flex-row items-center font-MSSS"><div class="w-[50px] h-[50px] shrink-0 bg-[url(/images/xp/icons/LocalDisk.png)] bg-contain"></div>
                <div class="px-1 text-[11px] line-clamp-2 text-ellipsis leading-tight">${n(e.display_name!=null?e.display_name:e.name)}</div>
            </div>`)}

        <p class="ml-2 mt-4 font-MSSS text-black text-[11px] font-bold">Devices with Removable Storage</p>
        <div class="mb-4 w-[300px] h-[2px] bg-gradient-to-r from-blue-500 to-slate-50"></div>
        ${b(c.filter(e=>e.type=="removable_storage"),e=>`<div class="w-[150px] ml-4 mr-8 overflow-hidden inline-flex flex-row items-center font-MSSS"><div class="w-[50px] h-[50px] shrink-0 bg-[url(/images/xp/icons/RemovableMedia.png)] bg-contain"></div>
                <div class="px-1 text-[11px] line-clamp-2 text-ellipsis leading-tight">${n(e.display_name!=null?e.display_name:e.name)}</div>
            </div>`)}</div>

    <div class="shrink-0 w-full h-[70px] text-[11px] text-black"><div class="w-full flex flex-row items-center my-2"><div class="w-[100px] shrink-0">File name:</div>
            <div class="grow"><input disabled type="text"${k("value",s.map(e=>i[e].name).join(", "),0)} class="w-full h-6 text-[11px] outline-none border border-blue-300 disabled:bg-slate-50"></div>
            <div class="w-[100px] shrink-0 flex flex-row justify-end ">${w(D,"Button").$$render(v,{title:"Open",on_click:h,disabled:s.length==0},{},{})}</div></div>
        <div class="w-full flex flex-row items-center my-2"><div class="w-[100px] shrink-0">Files of type:</div>
            <div class="grow"><input disabled type="text" value="${n(f,!0)+" ("+n(p.join(", "),!0)+")"}" class="w-full h-6 p-0.5 text-[11px] outline-none border border-blue-300 disabled:bg-slate-50"></div>
            <div class="w-[100px] shrink-0 flex flex-row justify-end ">${w(D,"Button").$$render(v,{title:"Cancel",on_click:_},{},{})}</div></div></div></div>

`}),ie=C((v,t,l,j)=>{let{self:u}=t,{selected_items:x=[]}=t,{viewer:i}=t,{filetypes:m=[]}=t,{filetypes_desc:o="All Files"}=t,{multiple:a=!0}=t,d=[{id:R,name:"Desktop",icon:"/images/xp/icons/Desktop.png"},{id:V,name:"My Pictures",icon:"/images/xp/icons/MyPictures.png"},{id:A,name:"My Music",icon:"/images/xp/icons/MyMusic.png"},{id:null,name:"My Computer",icon:"/images/xp/icons/MyComputer.png"}];function c(){console.log(u),u.$destroy()}let{on_open:s=()=>{}}=t;t.self===void 0&&l.self&&u!==void 0&&l.self(u),t.selected_items===void 0&&l.selected_items&&x!==void 0&&l.selected_items(x),t.viewer===void 0&&l.viewer&&i!==void 0&&l.viewer(i),t.filetypes===void 0&&l.filetypes&&m!==void 0&&l.filetypes(m),t.filetypes_desc===void 0&&l.filetypes_desc&&o!==void 0&&l.filetypes_desc(o),t.multiple===void 0&&l.multiple&&a!==void 0&&l.multiple(a),t.destroy===void 0&&l.destroy&&c!==void 0&&l.destroy(c),t.on_open===void 0&&l.on_open&&s!==void 0&&l.on_open(s);let f,p;do f=!0,p=`<div class="absolute inset-0 bg-slate-50/40 rounded-t-lg z-10"><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col"${g({width:"600px",height:"500px"})}>${w(z,"TitleBar").$$render(v,{options:{title:"Open",maximize_btn:!1,minimize_btn:!1},on_click_close:c},{},{})}
        <div class="grow p-2 pb-1 bg-xp-yellow overflow-hidden flex flex-row shadow-lg border-t-0 border-2 border-blue-600"><div class="shrink-0 pt-1 pr-1 w-[100px]"><div class="h-7 mr-2 flex flex-row justify-end items-center"><span class="text-[11px] text-black">Look in:</span></div>
                <div class="bg-xp-yellow-light shadow rounded w-full">${b(d,r=>`<div class="w-full h-[80px] flex flex-col items-center p-2 hover:bg-slate-100 rounded"><div class="w-8 h-8 bg-contain bg-no-repeat"${g({"background-image":`url(${r.icon})`})}></div>
                            <span class="mt-1 text-[12px] text-black">${n(r.name)}</span>
                        </div>`)}</div></div>

            <div class="grow flex flex-col relative">${w(q,"Viewer2").$$render(v,{filetypes_desc:o,filetypes:m.map(r=>r.toLowerCase()),multiple:a,on_open:()=>{x=i.selectingItems,s()},on_cancel:c,this:i},{this:r=>{i=r,f=!1}},{})}</div></div></div></div>


`;while(!f);return p});export{ie as default};
