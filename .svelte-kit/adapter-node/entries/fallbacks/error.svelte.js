import{c as u,e as s}from"../../_app/immutable/chunks/index-ff400fad.js";function l({error:o,status:e}){return{props:{error:o,status:e}}}const m=u((o,e,t,c)=>{let{status:a}=e,{error:r}=e;return e.status===void 0&&t.status&&a!==void 0&&t.status(a),e.error===void 0&&t.error&&r!==void 0&&t.error(r),`<h1>${s(a)}</h1>

<pre>${s(r.message)}</pre>



${r.frame?`<pre>${s(r.frame)}</pre>`:""}
${r.stack?`<pre>${s(r.stack)}</pre>`:""}`});export{m as default,l as load};
