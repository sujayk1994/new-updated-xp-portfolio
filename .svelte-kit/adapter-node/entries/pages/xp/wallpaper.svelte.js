import{c as d,a as p,k as g,n as f,h as $}from"../../../_app/immutable/chunks/index-ff400fad.js";import{h as _,w}from"../../../_app/immutable/chunks/store-3e4ea696.js";import"../../../_app/immutable/chunks/system-eda41220.js";import{get as h}from"idb-keyval";import"../../../_app/immutable/chunks/index-2945f287.js";function v(l){return new Promise(s=>{let t=new Image;t.src=l,t.onload=()=>s()})}const j=d((l,s,t,k)=>{let o,i,n,u;i=p(_,e=>o=e),u=p(w,e=>n=e);let c="";async function m(e){let r=o[e];console.log(r);let a=null;if(r.storage_type=="remote")a=r.url;else if(r.storage_type=="local"){let b=await h(r.url);a=URL.createObjectURL(b)}return await v(a),c=a,a}return i(),u(),`${function(e){return g(e)?(e.then(null,f),`
    <div class="absolute inset-0 bg-cover bg-black"${$({"background-image":`url(${c})`})}></div>
`):function(r){return` 
    <div class="absolute inset-0 bg-cover"${$({"background-image":`url(${r})`})}></div>
`}(e)}(m(n))}`});export{j as default};
