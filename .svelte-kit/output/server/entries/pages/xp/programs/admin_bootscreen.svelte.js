import{c as B,a as P,v,e as c,j as _}from"../../../../_app/immutable/chunks/index-ff400fad.js";import{W as C}from"../../../../_app/immutable/chunks/Window-e98aeb2f.js";import{B as k}from"../../../../_app/immutable/chunks/Button-c9221fbd.js";import{r as j,f as A}from"../../../../_app/immutable/chunks/store-3e4ea696.js";import{i as T}from"../../../../_app/immutable/chunks/admin-04ad1b95.js";import{e as W}from"../../../../_app/immutable/chunks/system-eda41220.js";import{a as G}from"../../../../_app/immutable/chunks/index-48511d2a.js";import"../../../../_app/immutable/chunks/TitleBar-7840ae1a.js";import"lodash";import"idb-keyval";/* empty css                                                                             */import"../../../../_app/immutable/chunks/index-2945f287.js";import"http";import"https";import"follow-redirects";import"url";import"zlib";import"form-data";const Z=B((n,o,t,D)=>{let p,h;h=P(T,s=>p=s);let{id:m}=o,{window:r}=o,{self:l}=o,{exec_path:u}=o,e={...W},w=null,b=!1,a="",$="";function i(){j.update(s=>s.filter(x=>x!=l)),l.$destroy()}async function S(){if(!p){d("You must be logged in as admin to save changes","error");return}b=!0;try{const s=await G.post("/api/admin/bootscreen",{settings:e});s.data.success?(A.set(e),d("Boot screen settings saved successfully!","success")):d(s.data.error||"Failed to save settings","error")}catch(s){console.error("Error saving boot screen settings:",s),d("Failed to save settings. Make sure you are logged in as admin.","error")}finally{b=!1}}function d(s,x){a=s,$=x,setTimeout(()=>{a=""},3e3)}let{options:f={title:"Boot Screen Settings (Admin)",min_width:450,min_height:600,width:450,height:600,icon:"/images/xp/icons/DisplayProperties.png",id:m,resizable:!1,maximize_btn:!1,minimize_btn:!0,exec_path:u}}=o;o.id===void 0&&t.id&&m!==void 0&&t.id(m),o.window===void 0&&t.window&&r!==void 0&&t.window(r),o.self===void 0&&t.self&&l!==void 0&&t.self(l),o.exec_path===void 0&&t.exec_path&&u!==void 0&&t.exec_path(u),o.destroy===void 0&&t.destroy&&i!==void 0&&t.destroy(i),o.options===void 0&&t.options&&f!==void 0&&t.options(f);let g,y;do g=!0,y=`${v(C,"Window").$$render(n,{options:f,on_click_close:i,this:r},{this:s=>{r=s,g=!1}},{content:()=>`<div slot="content" class="absolute inset-1 p-3 flex flex-col bg-[#ece9d8] overflow-hidden">${p?`<div class="flex flex-col gap-3 overflow-y-auto flex-1"><div class="border border-slate-400 bg-white p-3 rounded"><p class="font-bold text-sm mb-2">Boot Screen Preview</p>
                    <div class="w-full h-[120px] bg-black rounded flex items-center justify-center overflow-hidden" style="${"background-color: "+c(e.backgroundColor,!0)}">${e.type==="custom"&&w?`<img${_("src",w,0)} alt="Boot Screen Preview" class="max-w-full max-h-full object-contain">`:`<div class="text-center">${e.showLogo!==!1?'<img src="/images/xp_loading_logo.jpg" alt="" class="w-[100px] mx-auto">':""}
                                ${e.showProgress!==!1?'<div class="w-[60px] h-[10px] border border-gray-400 rounded mx-auto mt-6 overflow-hidden"><div class="h-full w-[30%] bg-blue-500 animate-pulse"></div></div>':""}</div>`}</div></div>

                <div class="border border-slate-400 bg-white p-3 rounded"><p class="font-bold text-sm mb-2">Boot Screen Type</p>
                    <div class="flex flex-col gap-2 text-sm"><label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="bootType" value="default" ${e.type==="default"?"checked":""}>
                            <span>Default Windows XP</span></label>
                        <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="bootType" value="custom" ${e.type==="custom"?"checked":""}>
                            <span>Custom Image/GIF</span></label></div></div>

                ${e.type==="custom"?`<div class="border border-slate-400 bg-white p-3 rounded"><p class="font-bold text-sm mb-2">Custom Loading Image</p>
                        <p class="text-xs text-slate-600 mb-2">Supported formats: GIF, PNG, JPG, JPEG, WEBP</p>
                        <div class="flex gap-2"><label class="inline-block px-3 py-1 bg-slate-200 border border-slate-400 cursor-pointer hover:bg-slate-300 text-center text-sm">Browse...
                                <input type="file" accept=".gif,.png,.jpg,.jpeg,.webp" class="hidden"></label>
                            </div>
                        <p class="text-xs text-slate-500 mt-2">No custom image selected</p></div>`:""}

                <div class="border border-slate-400 bg-white p-3 rounded"><p class="font-bold text-sm mb-2">Background Color</p>
                    <div class="flex items-center gap-2"><input type="color"${_("value",e.backgroundColor,0)} class="w-[40px] h-[30px] cursor-pointer">
                        <span class="text-xs">${c(e.backgroundColor)}</span></div></div>

                ${e.type==="default"?`<div class="border border-slate-400 bg-white p-3 rounded"><p class="font-bold text-sm mb-2">Default Screen Options</p>
                        <div class="flex flex-col gap-2 text-sm"><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" ${e.showLogo?"checked":""}>
                                <span>Show Windows Logo</span></label>
                            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" ${e.showProgress?"checked":""}>
                                <span>Show Progress Bar</span></label>
                            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" ${e.showCopyright?"checked":""}>
                                <span>Show Copyright Text</span></label></div></div>`:""}

                ${a?`<div class="${"p-2 rounded text-sm "+c($==="error"?"bg-red-100 text-red-700 border border-red-300":"bg-green-100 text-green-700 border border-green-300",!0)}">${c(a)}</div>`:""}</div>

            <div class="shrink-0 flex flex-row justify-between items-center px-1 pt-3 border-t border-slate-400 mt-2"><button class="px-3 py-1 bg-slate-200 border border-slate-400 hover:bg-slate-300 text-sm">Reset to Default
                </button>
                <div class="flex gap-2">${v(k,"Button").$$render(n,{title:b?"Saving...":"Apply & Save",style:"margin-right:10px;",on_click:S},{},{})}
                    ${v(k,"Button").$$render(n,{title:"Close",on_click:i},{},{})}</div></div>`:`<div class="flex items-center justify-center h-full"><div class="text-center p-4 bg-yellow-50 border border-yellow-300 rounded"><img src="/images/xp/icons/UserAccounts.png" alt="" class="w-12 h-12 mx-auto mb-2">
                    <p class="text-sm text-yellow-800">You must be logged in as admin to access this feature.</p></div></div>`}</div>`})}

`;while(!g);return h(),y});export{Z as default};
