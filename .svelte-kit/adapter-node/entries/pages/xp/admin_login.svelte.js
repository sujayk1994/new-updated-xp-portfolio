import{c as v,a,e as i,j as x}from"../../../_app/immutable/chunks/index-ff400fad.js";import{i as g,a as $,b as m}from"../../../_app/immutable/chunks/admin-04ad1b95.js";import"../../../_app/immutable/chunks/index-2945f287.js";import"../../../_app/immutable/chunks/system-eda41220.js";const y={code:`.xp-window.svelte-1yf006q{border:1px solid #0054e3;border-radius:8px 8px 0 0;overflow:hidden}.xp-titlebar.svelte-1yf006q{background:linear-gradient(180deg, 
            #0058e6 0%, 
            #3a93ff 3%, 
            #288eff 6%,
            #0054e3 90%,
            #0048c8 100%
        );border-bottom:1px solid #0048c8}.xp-close-btn.svelte-1yf006q{background:linear-gradient(180deg, #e35f5f 0%, #c83232 50%, #d14848 100%);border:1px solid #3d3d3d;border-radius:3px;color:white;font-weight:bold}.xp-close-btn.svelte-1yf006q:hover{background:linear-gradient(180deg, #ff7070 0%, #e04040 50%, #f05050 100%)}.xp-close-btn.svelte-1yf006q:active{background:linear-gradient(180deg, #c83232 0%, #a02828 50%, #b83030 100%)}.xp-button.svelte-1yf006q{background:linear-gradient(180deg, #fff 0%, #ece9d8 89%, #d8d4c4 100%);border:1px solid #003c74;border-radius:3px;font-size:11px;min-width:75px}.xp-button.svelte-1yf006q:hover{background:linear-gradient(180deg, #fff 0%, #e3dfce 89%, #ccc8b8 100%)}.xp-button.svelte-1yf006q:active{background:linear-gradient(180deg, #d8d4c4 0%, #c0bcac 50%, #d8d4c4 100%)}.xp-button.svelte-1yf006q:disabled{opacity:0.6;cursor:not-allowed}.xp-input.svelte-1yf006q{border:1px solid #7f9db9;border-radius:0;background:white}.xp-input.svelte-1yf006q:focus{outline:none;border-color:#316ac5}`,map:null},A=v((b,l,d,w)=>{let t,n,r,o,s,c;n=a(g,e=>t=e),o=a($,e=>r=e),c=a(m,e=>s=e);let{self:p=null}=l,f="",u="";return l.self===void 0&&d.self&&p!==void 0&&d.self(p),b.css.add(y),n(),o(),c(),`<div class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"><div class="xp-window w-[380px] shadow-2xl svelte-1yf006q"><div class="xp-titlebar flex items-center justify-between px-1 h-[26px] select-none svelte-1yf006q" style="background: linear-gradient(180deg, #0a246a 0%, #0a246a 3%, #a6caf0 4%, #0a246a 5%, #0a246a 100%);"><div class="flex items-center gap-1"><img src="/images/xp/icons/UserAccounts.png" alt="" class="w-4 h-4">
                <span class="text-white text-xs font-bold drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]">${i(t?"Admin Panel":"Admin Login")}</span></div>
            <button class="xp-close-btn w-5 h-[18px] flex items-center justify-center text-[10px] svelte-1yf006q">\u2715
            </button></div>

        <div class="bg-[#ece9d8] p-4">${t?`<div class="text-center"><div class="flex items-center justify-center gap-2 mb-4"><img src="/images/xp/icons/UserAccounts.png" alt="" class="w-12 h-12">
                        <div class="text-left"><div class="text-sm font-bold">Logged in as:</div>
                            <div class="text-lg text-blue-800">${i(r?.username)}</div></div></div>
                    <p class="text-xs text-gray-600 mb-4">You are currently logged in as admin. Any files or folders you create will be saved permanently and visible to all visitors.
                    </p>
                    <button class="xp-button px-6 py-1 svelte-1yf006q">Log Out
                    </button></div>`:`<div class="flex gap-4"><img src="/images/xp/icons/UserAccounts.png" alt="" class="w-12 h-12 shrink-0">
                    <div class="flex-1"><p class="text-xs text-gray-600 mb-3">Enter your credentials to access admin mode and make permanent changes.
                            </p>

                        <div class="space-y-2"><div class="flex items-center gap-2"><label class="text-xs w-20 text-right">User name:</label>
                                <input type="text" class="xp-input flex-1 px-1 py-0.5 text-xs svelte-1yf006q" placeholder="admin"${x("value",f,0)}></div>
                            <div class="flex items-center gap-2"><label class="text-xs w-20 text-right">Password:</label>
                                <input type="password" class="xp-input flex-1 px-1 py-0.5 text-xs svelte-1yf006q"${x("value",u,0)}></div></div>

                        </div></div>

                <div class="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-300">
                    <button class="xp-button px-4 py-1 text-xs svelte-1yf006q" ${s?"disabled":""}>${i(s?"Please wait...":"OK")}</button>
                    <button class="xp-button px-4 py-1 text-xs svelte-1yf006q">Cancel
                    </button></div>`}</div></div>
</div>`});export{A as default};
