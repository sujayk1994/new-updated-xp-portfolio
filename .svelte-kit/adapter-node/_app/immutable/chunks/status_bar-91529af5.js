import{c as m,e as v}from"./index-ff400fad.js";function c(f){return new Promise(e=>{setTimeout(e,f)})}const w=m((f,e,s,h)=>{let{l_message:a=""}=e,{r_message:t=""}=e,{show_separator:l=!1}=e;async function d(_){for(let{l:o,r,d:i}of _)o||(o=""),r||(r=""),i||(i=1e3),a=o,t=r,await c(i)}return e.l_message===void 0&&s.l_message&&a!==void 0&&s.l_message(a),e.r_message===void 0&&s.r_message&&t!==void 0&&s.r_message(t),e.show_separator===void 0&&s.show_separator&&l!==void 0&&s.show_separator(l),e.display===void 0&&s.display&&d!==void 0&&s.display(d),`<div class="absolute bottom-0 left-0 right-0 h-8 bg-slate-200 text-slate-900 flex flex-row overflow-hidden font-MSSS"><div class="grow h-full pb-1 font-bold px-4">${v(a)}</div>
    ${l?'<div class="w-1 h-full bg-slate-900"></div>':""}
    <div class="basis-1/4 shrink-0 pb-1 font-bold px-4">${v(t)}</div></div>

`});export{w as S};
