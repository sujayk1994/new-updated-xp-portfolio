import{c as n,d as i,f as l,e as t}from"../../_app/immutable/chunks/index-ff400fad.js";const v=n((r,c,p,d)=>{i();let o=0,a=["Start Windows Normally","Install Windows","Onboard NIC (IPV4)","Onboard NIC (IPV6","BIOS Setup","Device Configuration","BIOS Flash Update","Change Boot Mode Settings"];return`<div class="w-screen h-screen bg-black overflow-hidden font-MSSS"><div class="mt-12 ml-8 text-lg"><p class="text-slate-100">Use the \u2191(Up) and \u2193(Down) key to move the pointer to desired boot device.</p>
        <p class="text-slate-100">Press (Enter) to attempt to boot or ESC to cancel.</p>
        

        <p class="text-slate-100 uppercase mt-4 mb-2">boot options:</p>
        ${l(a.slice(0,4),(e,s)=>`<div><div class="${"ml-8 p-2 inline-block "+t(s==o?"text-slate-900 bg-slate-200":"text-slate-300",!0)}">${t(e)}</div>
            </div>`)}

        <p class="text-slate-100 uppercase mt-4 mb-2">other options:</p>
        ${l(a.slice(4),(e,s)=>`<div><div class="${"ml-8 p-2 inline-block "+t(s+4==o?"text-slate-900 bg-slate-200":"text-slate-300",!0)}">${t(e)}</div>
            </div>`)}</div></div>


`});export{v as default};
