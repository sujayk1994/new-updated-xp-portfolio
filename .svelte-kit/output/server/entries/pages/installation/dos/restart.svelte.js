import{c as o,d as i,o as p,e as d,h as c,v as n}from"../../../../_app/immutable/chunks/index-ff400fad.js";import{S as m}from"../../../../_app/immutable/chunks/status_bar-91529af5.js";import"@faker-js/faker";const h=o((a,$,u,v)=>{i();let e,s=15;p(()=>{});let t,l;do t=!0,l=`<div class="absolute inset-0 bg-[rgb(2,7,176)] overflow-hidden font-Levi"><div class="mt-4 text-xl font-bold text-slate-400 inline-block"><p class="px-2">Windows XP Professional Setup</p>
        <div class="w-full h-[1px] mb-1 bg-slate-400"></div>
        <div class="w-full h-[1px] bg-slate-400"></div></div>
    <div class="ml-8 mt-12 text-xl text-slate-400"><p class="">This portion of Setup has completed successfully.</p>
        <p class="mt-2">If there is a floppy disk in drive A:, remove it.</p>
        <p class="mt-2">To restart you computer, press ENTER.<br>
            When your computer restarts, Setup will continue.
        </p>
        
        

        <div class="absolute bottom-[150px] left-0 right-0"><div class="border-double border-4 border-slate-400 pt-8 mx-auto max-w-[700px]"><p class="text-slate-400 ml-4 my-2"></p>
                <p class="my-2 text-center">Your computer will reboot in ${d(s+" seconds")}...</p>
                <div class="mx-auto w-[500px] border-2 border-slate-400 h-[40px] mb-4 pt-[8px] pb-[4px] px-[4px]"><div class="transition-all h-full bg-red-500"${c({width:`${100*(15-s)/15}%`})}></div></div></div></div></div></div>

${n(m,"StatusBar").$$render(a,{l_message:"ENTER=Restart Computer",this:e},{this:r=>{e=r,t=!1}},{})}

`;while(!t);return l});export{h as default};
