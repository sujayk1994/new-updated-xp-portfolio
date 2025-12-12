import{c as p,d,f as m,v as c,e as a}from"../../../../_app/immutable/chunks/index-ff400fad.js";import{S as u}from"../../../../_app/immutable/chunks/status_bar-91529af5.js";import"@faker-js/faker";const x=p((l,h,$,f)=>{d();let s,o=0,n=["Format the partition using the NTFS file system (Quick)","Format the partition using the FAT file system (Quick)","Format the partition using the NTFS file system","Format the partition using the FAT file system"],t,i;do t=!0,i=`<div class="absolute inset-0 bg-[rgb(2,7,176)] overflow-hidden font-Levi"><div class="mt-4 text-xl font-bold text-slate-400 inline-block"><p class="px-2">Windows XP Professional Setup</p>
        <div class="w-full h-[1px] mb-1 bg-slate-400"></div>
        <div class="w-full h-[1px] bg-slate-400"></div></div>
    <div class="ml-12 mt-8 text-xl text-slate-300"><p>A new partition for Windows XP has been created on 10237 MB Disk 0 at Id 0 on bus 0 on atapi [MBR].</p>
        <p class="mt-2">This partition must be now formatted.</p>
        <p class="mt-2">From the list below, select a file system for the new partition.</p>
        <p>Use the UP and DOWN ARROW key to select the file system you want to use, then press ENTER.</p>
        <ul class="ml-4 mt-4">${m(n,(e,r)=>`<div><li class="${"inline-block px-1 "+a(o==r?"bg-slate-300 text-[rgb(2,7,176)]":"",!0)}">${a(e)}</li>
                </div>`)}</ul></div></div>

${c(u,"StatusBar").$$render(l,{l_message:"ENTER=Continue\xA0\xA0\xA0 ESC=Cancel",this:s},{this:e=>{s=e,t=!1}},{})}

`;while(!t);return i});export{x as default};
