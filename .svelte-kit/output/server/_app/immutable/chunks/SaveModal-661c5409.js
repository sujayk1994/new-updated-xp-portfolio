import{c as D,j as w,e as r,h as u,i as P,f as g,a as T,d as L,v as _}from"./index-ff400fad.js";import{T as O}from"./TitleBar-7840ae1a.js";import"lodash";import{c as R,h as V,p as E,i as j,d as H,m as U,b as q}from"./system-eda41220.js";import{t as A}from"./finder-762cc408.js";import{h as G}from"./store-3e4ea696.js";import"short-uuid";import"buffer";import{B as F}from"./Button-c9221fbd.js";import{P as I}from"./Previewable-3a8a83f0.js";import"./index-2945f287.js";/* empty css                                             */let z=24;const J=D((f,t,l,B)=>{let{items:s=[]}=t,{selected_index:n=0}=t,{style:i=""}=t,{direction:c}=t,o,a="";return t.items===void 0&&l.items&&s!==void 0&&l.items(s),t.selected_index===void 0&&l.selected_index&&n!==void 0&&l.selected_index(n),t.style===void 0&&l.style&&i!==void 0&&l.style(i),t.direction===void 0&&l.direction&&c!==void 0&&l.direction(c),`<div class="bg-slate-50 h-6 text-slate-800 border border-blue-300 p-1 text-[11px] absolute"${w("style",i,0)}${w("this",o,0)}><div class="${"absolute bg-slate-50 w-full left-0 max-h-[100px] overflow-y-auto box-content border border-slate-300 "+r("hidden",!0)}"${u(P(r(a,!0),{height:`${0}px`}))}>${g(s,(d,m)=>`<div class="${"box-border w-full flex flex-row p-0.5 pl-2 items-center hover:bg-blue-600 hover:text-slate-50 "+r(m!=0?"border-t":"",!0)+" border-slate-300"}"${u({height:`${z}px`})}>${r(d.name)}
            </div>`)}</div>  

    <div class="absolute inset-0 flex flex-row items-center pl-2">${r(s[n]?.name)}</div>
    ${s.length>1?`<div class="absolute right-[1px] top-[1px] bottom-[1px] p-1 rounded bg-blue-200 border-2 border-slate-50 box-border"${u({width:`${z-2}px`})}><svg class="w-full h-full fill-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg></div>`:""}</div>

`}),K=D((f,t,l,B)=>{let s,n,i,c;c=T(G,e=>i=e),L();let{id:o}=t,a=[o],d=0,m=R.map(e=>i[e]),{selected_filetype:v}=t,{filetypes:x=[]}=t,{filename:p=""}=t,{select_box:b}=t;function h(e){i[e]?.type=="file"||(a=[...a.slice(0,d+1),e],d=a.length-1,o=a[d])}function y(e){return e==null?null:e.icon!=null?`url(${e.icon})`:j[e.ext]!=null?`url(/images/xp/icons/${j[e.ext]})`:null}let{on_save:k=()=>{}}=t,{on_cancel:S=()=>{}}=t;t.id===void 0&&l.id&&o!==void 0&&l.id(o),t.selected_filetype===void 0&&l.selected_filetype&&v!==void 0&&l.selected_filetype(v),t.filetypes===void 0&&l.filetypes&&x!==void 0&&l.filetypes(x),t.filename===void 0&&l.filename&&p!==void 0&&l.filename(p),t.select_box===void 0&&l.select_box&&b!==void 0&&l.select_box(b),t.open===void 0&&l.open&&h!==void 0&&l.open(h),t.on_save===void 0&&l.on_save&&k!==void 0&&l.on_save(k),t.on_cancel===void 0&&l.on_cancel&&S!==void 0&&l.on_cancel(S);let M,C;do M=!0,s=A(a[d])||"My Computer",n=i[o]==null?[]:i[o].children.map(e=>i[e]).filter(e=>e!=null).filter(e=>!V.includes(e.id)),C=`<div class="absolute inset-0 bg-xp-yellow"><div class="absolute inset-1 top-0.5 h-6 mb-2 flex flex-row items-center text-[11px]"><div class="h-full w-[300px] relative"><input class="absolute inset-0 w-[300px] pl-7 border border-blue-300 outline-none" type="text"${w("value",s,0)}>
            <div class="${"w-[17px] h-[17px] absolute top-[4px] left-[4px] bg-no-repeat "+r(o==null?"bg-[url(/images/xp/icons/MyComputer.png)]":"bg-[url(/images/xp/icons/FolderClosed.png)]",!0)+" bg-contain"}"${u({"background-image":y(i[o])})}></div></div>
        <button class="mx-1.5 ml-4 w-4 h-4 bg-[url(/images/xp/icons/Back.png)] bg-contain disabled:grayscale" ${d==0?"disabled":""}></button>

        <button class="mx-1.5 w-4 h-4 bg-[url(/images/xp/icons/Forward.png)] bg-contain disabled:grayscale" ${d==a.length-1?"disabled":""}></button>

        <button class="mx-1.5 w-5 h-5 bg-[url(/images/xp/icons/Up.png)] bg-contain disabled:grayscale" ${a[d]==null?"disabled":""}></button></div>
    <div class="${["absolute top-7 left-1 right-1 h-[360px] overflow-auto bg-slate-50 border border-blue-300",o==null?"hidden":""].join(" ").trim()}">${g(n,e=>`<div${w("fs-id",e.id,0)} class="${"w-[100px] overflow-hidden m-2 inline-flex flex-row items-center font-MSSS relative "+r("",!0)}">${E.includes(e.ext)?`${_(I,"Previewable").$$render(f,{size:30,default_icon:y(e),fs_id:e.id},{},{})}`:`<div class="${"w-[30px] h-[30px] shrink-0 bg-contain bg-no-repeat "+r(e.type=="folder"?"bg-[url(/images/xp/icons/FolderClosed.png)]":"bg-[url(/images/xp/icons/Default.png)]",!0)}"${u({"background-image":y(e)})}></div>`}
                <p class="px-1 text-[11px] break-words line-clamp-2 text-ellipsis leading-tight">${r(e.name)}</p>
                
            </div>`)}</div>

    <div class="${["absolute top-7 left-1 right-1 h-[360px] overflow-auto bg-slate-50 border border-blue-300",o!=null?"hidden":""].join(" ").trim()}"><p class="ml-2 mt-0.5 font-MSSS text-black text-[11px] font-bold">Files Stored on This Computer</p>
        <div class="mb-4 w-[300px] h-[2px] bg-gradient-to-r from-blue-500 to-slate-50"></div>
        ${g(m.filter(e=>e.type=="folder"),e=>`<div class="w-[150px] ml-4 mr-8 overflow-hidden inline-flex flex-row items-center font-MSSS"><div class="w-[40px] h-[40px] shrink-0 bg-[url(/images/xp/icons/FolderClosed.png)] bg-contain"${u({"background-image":e.icon==null?"":`url(${e.icon})`})}></div>
                <div class="px-1 text-[11px] line-clamp-2 text-ellipsis leading-tight">${r(e.display_name!=null?e.display_name:e.name)}</div>
            </div>`)}

        <p class="ml-2 mt-4 font-MSSS text-black text-[11px] font-bold">Hard Disk Drives</p>
        <div class="mb-4 w-[300px] h-[2px] bg-gradient-to-r from-blue-500 to-slate-50"></div>
        ${g(m.filter(e=>e.type=="drive"),e=>`<div class="w-[150px] ml-4 mr-8 overflow-hidden inline-flex flex-row items-center font-MSSS"><div class="w-[50px] h-[50px] shrink-0 bg-[url(/images/xp/icons/LocalDisk.png)] bg-contain"></div>
                <div class="px-1 text-[11px] line-clamp-2 text-ellipsis leading-tight">${r(e.display_name!=null?e.display_name:e.name)}</div>
            </div>`)}

        <p class="ml-2 mt-4 font-MSSS text-black text-[11px] font-bold">Devices with Removable Storage</p>
        <div class="mb-4 w-[300px] h-[2px] bg-gradient-to-r from-blue-500 to-slate-50"></div>
        ${g(m.filter(e=>e.type=="removable_storage"),e=>`<div class="w-[150px] ml-4 mr-8 overflow-hidden inline-flex flex-row items-center font-MSSS"><div class="w-[50px] h-[50px] shrink-0 bg-[url(/images/xp/icons/RemovableMedia.png)] bg-contain"></div>
                <div class="px-1 text-[11px] line-clamp-2 text-ellipsis leading-tight">${r(e.display_name!=null?e.display_name:e.name)}</div>
            </div>`)}</div>

    <div class="absolute bottom-1 right-1 left-1 h-[70px] text-[11px] text-black"><div class="absolute top-0 right-0 left-0 h-[35px] flex flex-row items-center"><div class="w-[100px] shrink-0">File name:</div>
            <div class="grow"><input type="text" class="w-full h-6 text-[11px] outline-none border border-blue-300 disabled:bg-slate-50"${w("value",p,0)}></div>
            <div class="w-[100px] shrink-0 flex flex-row justify-end ">${_(F,"Button").$$render(f,{title:"Save",on_click:k,disabled:p.length==0||o==null},{},{})}</div></div>
        <div class="absolute bottom-0 right-0 left-0 h-[35px] flex flex-row items-center justify-between"><div class="w-[100px] shrink-0">Save as type:</div>
            ${_(J,"SelectBox").$$render(f,{style:"left:100px;right:100px;bottom:5px;",items:x,selected_index:x.indexOf(v)>=0?x.indexOf(v):0,this:b},{this:e=>{b=e,M=!1}},{})}
            <div class="w-[100px] shrink-0 flex flex-row justify-end ">${_(F,"Button").$$render(f,{title:"Cancel",on_click:S},{},{})}</div></div></div></div>



`;while(!M);return c(),C}),ae=D((f,t,l,B)=>{let{self:s}=t,{id:n}=t,{viewer:i}=t,{filetypes:c=[]}=t,{selected_filetype:o}=t,{filename:a}=t,{parent_id:d}=t,m=[{id:H,name:"Desktop",icon:"/images/xp/icons/Desktop.png"},{id:U,name:"My Pictures",icon:"/images/xp/icons/MyPictures.png"},{id:q,name:"My Music",icon:"/images/xp/icons/MyMusic.png"},{id:null,name:"My Computer",icon:"/images/xp/icons/MyComputer.png"}];function v(){console.log(s),s.$destroy()}let{on_save:x=()=>{}}=t;t.self===void 0&&l.self&&s!==void 0&&l.self(s),t.id===void 0&&l.id&&n!==void 0&&l.id(n),t.viewer===void 0&&l.viewer&&i!==void 0&&l.viewer(i),t.filetypes===void 0&&l.filetypes&&c!==void 0&&l.filetypes(c),t.selected_filetype===void 0&&l.selected_filetype&&o!==void 0&&l.selected_filetype(o),t.filename===void 0&&l.filename&&a!==void 0&&l.filename(a),t.parent_id===void 0&&l.parent_id&&d!==void 0&&l.parent_id(d),t.destroy===void 0&&l.destroy&&v!==void 0&&l.destroy(v),t.on_save===void 0&&l.on_save&&x!==void 0&&l.on_save(x);let p,b;do p=!0,b=`<div class="absolute inset-0 bg-slate-50/40 rounded-t-lg z-10"><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col"${u({width:"600px",height:"500px"})}>${_(O,"TitleBar").$$render(f,{options:{title:"Save",maximize_btn:!1,minimize_btn:!1},on_click_close:v},{},{})}
        <div class="absolute inset-0 top-[28px] bg-xp-yellow shadow-lg border-t-0 border-2 border-blue-600"><div class="absolute top-1 left-1 bottom-0 w-[100px]"><div class="h-7 mr-2 flex flex-row justify-end items-center"><span class="text-[11px] text-black">Look in:</span></div>
                <div class="bg-xp-yellow-light shadow rounded w-full">${g(m,h=>`<div class="w-full h-[80px] flex flex-col items-center p-2 hover:bg-slate-100 rounded"><div class="w-8 h-8 bg-contain bg-no-repeat"${u({"background-image":`url(${h.icon})`})}></div>
                            <span class="mt-1 text-[12px] text-black">${r(h.name)}</span>
                        </div>`)}</div></div>

            <div class="absolute top-1 left-[110px] right-1 bottom-1">${_(K,"Viewer3").$$render(f,{id:n,filetypes:c,selected_filetype:o,on_save:()=>{d=i.id,a=i.filename,o=i.select_box.items[i.select_box.selected_index],console.log(o),x()},on_cancel:v,this:i},{this:h=>{i=h,p=!1}},{})}</div></div></div></div>


`;while(!p);return b});export{ae as default};
