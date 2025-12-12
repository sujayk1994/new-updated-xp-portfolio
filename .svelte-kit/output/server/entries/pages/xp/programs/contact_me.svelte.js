import{c as u,v as y,j as c}from"../../../../_app/immutable/chunks/index-ff400fad.js";import{W as w}from"../../../../_app/immutable/chunks/Window-e98aeb2f.js";import{r as _}from"../../../../_app/immutable/chunks/store-3e4ea696.js";import"../../../../_app/immutable/chunks/TitleBar-7840ae1a.js";import"lodash";import"idb-keyval";import"../../../../_app/immutable/chunks/index-2945f287.js";import"../../../../_app/immutable/chunks/system-eda41220.js";const S={code:".contact-container.svelte-pdg4os.svelte-pdg4os{font-family:'Tahoma', 'MS Sans Serif', Arial, sans-serif}.contact-container.svelte-pdg4os input.svelte-pdg4os::-moz-placeholder,.contact-container.svelte-pdg4os textarea.svelte-pdg4os::-moz-placeholder{color:#999}.contact-container.svelte-pdg4os input.svelte-pdg4os::placeholder,.contact-container.svelte-pdg4os textarea.svelte-pdg4os::placeholder{color:#999}",map:null},F=u((p,t,e,M)=>{let{id:a}=t,{window:o}=t,{self:r}=t,{parentNode:x}=t,{exec_path:s}=t,b="",g="",f="",{options:l={title:"Contact Me",min_width:400,min_height:350,width:550,height:480,icon:"/images/xp/icons/ContactMe.webp",id:a,exec_path:s}}=t;async function n(){h()}function h(){_.update(i=>i.filter(m=>m!=r)),r.$destroy()}t.id===void 0&&e.id&&a!==void 0&&e.id(a),t.window===void 0&&e.window&&o!==void 0&&e.window(o),t.self===void 0&&e.self&&r!==void 0&&e.self(r),t.parentNode===void 0&&e.parentNode&&x!==void 0&&e.parentNode(x),t.exec_path===void 0&&e.exec_path&&s!==void 0&&e.exec_path(s),t.options===void 0&&e.options&&l!==void 0&&e.options(l),t.destroy===void 0&&e.destroy&&n!==void 0&&e.destroy(n),p.css.add(S);let d,v;do d=!0,v=`



${y(w,"Window").$$render(p,{options:l,on_click_close:n,this:o},{this:i=>{o=i,d=!1}},{content:()=>`<div slot="content" class="contact-container absolute inset-0 top-0 flex flex-col bg-[#ece9d8] svelte-pdg4os"><div class="menu-bar flex items-center gap-1 px-1 py-0.5 bg-[#ece9d8] border-b border-gray-300 text-xs"><span class="px-2 py-0.5 hover:bg-blue-600 hover:text-white cursor-pointer">File</span>
            <span class="px-2 py-0.5 hover:bg-blue-600 hover:text-white cursor-pointer">Edit</span>
            <span class="px-2 py-0.5 hover:bg-blue-600 hover:text-white cursor-pointer">View</span>
            <span class="px-2 py-0.5 hover:bg-blue-600 hover:text-white cursor-pointer">Tools</span>
            <span class="px-2 py-0.5 hover:bg-blue-600 hover:text-white cursor-pointer">Help</span></div>

        <div class="toolbar flex items-center gap-2 px-2 py-1.5 bg-gradient-to-b from-[#f6f4ec] to-[#ece9d8] border-b border-gray-300"><button  class="flex items-center gap-1 px-2 py-1 text-xs bg-transparent hover:bg-blue-100 rounded border border-transparent hover:border-blue-300 disabled:opacity-50"><img src="/images/xp/icons/OESend.png" alt="" class="w-4 h-4">
                <span>Send Message</span></button>
            <button class="flex items-center gap-1 px-2 py-1 text-xs bg-transparent hover:bg-blue-100 rounded border border-transparent hover:border-blue-300"><img src="/images/xp/icons/OECreateMail.png" alt="" class="w-4 h-4">
                <span>New Message</span></button>
            <div class="border-l border-gray-400 h-5 mx-1"></div>
            </div>

        <div class="form-area flex-1 flex flex-col p-2 gap-1.5 overflow-auto"><div class="field flex items-center gap-2 bg-white border border-gray-400 px-2 py-1.5"><label class="text-xs font-bold text-gray-700 w-14 shrink-0">To:</label>
                <input type="text" readonly class="flex-1 text-xs border-none outline-none bg-gray-100 text-gray-600 svelte-pdg4os"${c("value",b,0)}></div>

            <div class="field flex items-center gap-2 bg-white border border-gray-400 px-2 py-1.5"><label class="text-xs font-bold text-gray-700 w-14 shrink-0">From:</label>
                <input type="email" placeholder="Your email address" class="flex-1 text-xs border-none outline-none bg-transparent svelte-pdg4os"${c("value",g,0)}></div>

            <div class="field flex items-center gap-2 bg-white border border-gray-400 px-2 py-1.5"><label class="text-xs font-bold text-gray-700 w-14 shrink-0">Subject:</label>
                <input type="text" placeholder="Subject of your message" class="flex-1 text-xs border-none outline-none bg-transparent svelte-pdg4os"${c("value",f,0)}></div>

            <div class="body-area flex-1 flex flex-col mt-1"><textarea placeholder="Write your message here" class="flex-1 w-full p-2 text-sm border border-gray-400 outline-none resize-none bg-white svelte-pdg4os"></textarea></div>

            </div>

        <div class="status-bar px-2 py-1.5 bg-[#ece9d8] border-t border-gray-300 text-xs text-gray-600">Compose a message to the owner
        </div></div>`})}`;while(!d);return v});export{F as default};
