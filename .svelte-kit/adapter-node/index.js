import{c as Ve,s as Ge,v as M,m as B}from"./_app/immutable/chunks/index-ff400fad.js";const Ye=Ve((e,t,r,n)=>{let{stores:s}=t,{page:o}=t,{components:i}=t,{props_0:l=null}=t,{props_1:a=null}=t,{props_2:c=null}=t;return Ge("__svelte__",s),s.page.notify,t.stores===void 0&&r.stores&&s!==void 0&&r.stores(s),t.page===void 0&&r.page&&o!==void 0&&r.page(o),t.components===void 0&&r.components&&i!==void 0&&r.components(i),t.props_0===void 0&&r.props_0&&l!==void 0&&r.props_0(l),t.props_1===void 0&&r.props_1&&a!==void 0&&r.props_1(a),t.props_2===void 0&&r.props_2&&c!==void 0&&r.props_2(c),s.page.set(o),`


${i[1]?`${M(i[0]||B,"svelte:component").$$render(e,Object.assign(l||{}),{},{default:()=>`${i[2]?`${M(i[1]||B,"svelte:component").$$render(e,Object.assign(a||{}),{},{default:()=>`${M(i[2]||B,"svelte:component").$$render(e,Object.assign(c||{}),{},{})}`})}`:`${M(i[1]||B,"svelte:component").$$render(e,Object.assign(a||{}),{},{})}`}`})}`:`${M(i[0]||B,"svelte:component").$$render(e,Object.assign(l||{}),{},{})}`}

`});function Ze(e){const t=new Headers;if(e)for(const r in e){const n=e[r];!n||(Array.isArray(n)?n.forEach(s=>{t.append(r,s)}):t.set(r,n))}return t}function Ae(e,t){const r=[];e.split(",").forEach((o,i)=>{const l=/([^/]+)\/([^;]+)(?:;q=([0-9.]+))?/.exec(o);if(l){const[,a,c,d="1"]=l;r.push({type:a,subtype:c,q:+d,i})}}),r.sort((o,i)=>o.q!==i.q?i.q-o.q:o.subtype==="*"!=(i.subtype==="*")?o.subtype==="*"?1:-1:o.type==="*"!=(i.type==="*")?o.type==="*"?1:-1:o.i-i.i);let n,s=1/0;for(const o of t){const[i,l]=o.split("/"),a=r.findIndex(c=>(c.type===i||c.type==="*")&&(c.subtype===l||c.subtype==="*"));a!==-1&&a<s&&(n=o,s=a)}return n}function Z(e){let t=5381,r=e.length;if(typeof e=="string")for(;r;)t=t*33^e.charCodeAt(--r);else for(;r;)t=t*33^e[--r];return(t>>>0).toString(36)}function Ke(e){const t={};for(const r in e)t[r.toLowerCase()]=e[r];return t}function Re(e){if(typeof e!="object")return!1;if(e){if(e instanceof Uint8Array||e instanceof ReadableStream)return!1;if(e._readableState&&typeof e.pipe=="function")throw new Error("Node streams are no longer supported \u2014 use a ReadableStream instead")}return!0}function pe(e,t){return JSON.stringify($e(e,t))}function $e(e,t){const{name:r,message:n,stack:s,cause:o,...i}=e,l={name:r,message:n,stack:t(e)};o&&(l.cause=$e(o,t));for(const a in i)l[a]=i[a];return l}function Ce(e){["get","post","put","patch","del"].forEach(t=>{if(t in e){const r=t==="del"?"DELETE":t.toUpperCase();throw Error(`Endpoint method "${t}" has changed to "${r}". See https://github.com/sveltejs/kit/discussions/5359 for more information.`)}})}const ae={id:"__error"};function me(e){return new Response(e,{status:500})}function Xe(e){return typeof e=="string"||e instanceof String}const Qe=new Set(["application/xml","application/json","application/x-www-form-urlencoded","multipart/form-data"]),et=new Set([101,204,205,304]);function tt(e){if(!e)return!0;const t=e.split(";")[0].toLowerCase();return t.startsWith("text/")||t.endsWith("+xml")||Qe.has(t)}async function ie(e,t,r){const{method:n}=e.request;Ce(t);let s=t[n];if(!s&&n==="HEAD"&&(s=t.GET),!s){const f=[];for(const y in["GET","POST","PUT","PATCH","DELETE"])t[y]&&f.push(y);return(t.GET||t.HEAD)&&f.push("HEAD"),e.request.headers.get("x-sveltekit-load")?new Response(void 0,{status:204}):new Response(`${n} method not allowed`,{status:405,headers:{allow:f.join(", ")}})}const o=await s(e),i=`Invalid response from route ${e.url.pathname}`;if(typeof o!="object")return me(`${i}: expected an object, got ${typeof o}`);if(o.fallthrough)throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");const{status:l=200,body:a={}}=o,c=o.headers instanceof Headers?new Headers(o.headers):Ze(o.headers),d=c.get("content-type");if(!tt(d)&&!(a instanceof Uint8Array||a instanceof ReadableStream||Xe(a)))return me(`${i}: body must be an instance of string, Uint8Array or ReadableStream if content-type is not a supported textual content-type`);let u;if(Re(a)&&(!d||d.startsWith("application/json"))?(c.set("content-type","application/json; charset=utf-8"),u=a instanceof Error?pe(a,r.get_stack):JSON.stringify(a)):u=a,(typeof u=="string"||u instanceof Uint8Array)&&!c.has("etag")){const f=c.get("cache-control");(!f||!/(no-store|immutable)/.test(f))&&c.set("etag",`"${Z(u)}"`)}return new Response(n!=="HEAD"&&!et.has(l)?u:void 0,{status:l,headers:c})}var re="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$",rt=/[<>\b\f\n\r\t\0\u2028\u2029]/g,nt=/^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/,ce={"<":"\\u003C",">":"\\u003E","/":"\\u002F","\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","	":"\\t","\0":"\\0","\u2028":"\\u2028","\u2029":"\\u2029"},st=Object.getOwnPropertyNames(Object.prototype).sort().join("\0");function Pe(e){var t=new Map;function r(c){if(typeof c=="function")throw new Error("Cannot stringify a function");if(t.has(c)){t.set(c,t.get(c)+1);return}if(t.set(c,1),!ne(c)){var d=se(c);switch(d){case"Number":case"String":case"Boolean":case"Date":case"RegExp":return;case"Array":c.forEach(r);break;case"Set":case"Map":Array.from(c).forEach(r);break;default:var u=Object.getPrototypeOf(c);if(u!==Object.prototype&&u!==null&&Object.getOwnPropertyNames(u).sort().join("\0")!==st)throw new Error("Cannot stringify arbitrary non-POJOs");if(Object.getOwnPropertySymbols(c).length>0)throw new Error("Cannot stringify POJOs with symbolic keys");Object.keys(c).forEach(function(f){return r(c[f])})}}}r(e);var n=new Map;Array.from(t).filter(function(c){return c[1]>1}).sort(function(c,d){return d[1]-c[1]}).forEach(function(c,d){n.set(c[0],ot(d))});function s(c){if(n.has(c))return n.get(c);if(ne(c))return ye(c);var d=se(c);switch(d){case"Number":case"String":case"Boolean":return"Object("+s(c.valueOf())+")";case"RegExp":return"new RegExp("+qe(c.source)+', "'+c.flags+'")';case"Date":return"new Date("+c.getTime()+")";case"Array":var u=c.map(function(m,p){return p in c?s(m):""}),f=c.length===0||c.length-1 in c?"":",";return"["+u.join(",")+f+"]";case"Set":case"Map":return"new "+d+"(["+Array.from(c).map(s).join(",")+"])";default:var y="{"+Object.keys(c).map(function(m){return it(m)+":"+s(c[m])}).join(",")+"}",j=Object.getPrototypeOf(c);return j===null?Object.keys(c).length>0?"Object.assign(Object.create(null),"+y+")":"Object.create(null)":y}}var o=s(e);if(n.size){var i=[],l=[],a=[];return n.forEach(function(c,d){if(i.push(c),ne(d)){a.push(ye(d));return}var u=se(d);switch(u){case"Number":case"String":case"Boolean":a.push("Object("+s(d.valueOf())+")");break;case"RegExp":a.push(d.toString());break;case"Date":a.push("new Date("+d.getTime()+")");break;case"Array":a.push("Array("+d.length+")"),d.forEach(function(f,y){l.push(c+"["+y+"]="+s(f))});break;case"Set":a.push("new Set"),l.push(c+"."+Array.from(d).map(function(f){return"add("+s(f)+")"}).join("."));break;case"Map":a.push("new Map"),l.push(c+"."+Array.from(d).map(function(f){var y=f[0],j=f[1];return"set("+s(y)+", "+s(j)+")"}).join("."));break;default:a.push(Object.getPrototypeOf(d)===null?"Object.create(null)":"{}"),Object.keys(d).forEach(function(f){l.push(""+c+ct(f)+"="+s(d[f]))})}}),l.push("return "+o),"(function("+i.join(",")+"){"+l.join(";")+"}("+a.join(",")+"))"}else return o}function ot(e){var t="";do t=re[e%re.length]+t,e=~~(e/re.length)-1;while(e>=0);return nt.test(t)?t+"_":t}function ne(e){return Object(e)!==e}function ye(e){if(typeof e=="string")return qe(e);if(e===void 0)return"void 0";if(e===0&&1/e<0)return"-0";var t=String(e);return typeof e=="number"?t.replace(/^(-)?0\./,"$1."):t}function se(e){return Object.prototype.toString.call(e).slice(8,-1)}function at(e){return ce[e]||e}function Te(e){return e.replace(rt,at)}function it(e){return/^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(e)?e:Te(JSON.stringify(e))}function ct(e){return/^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(e)?"."+e:"["+Te(JSON.stringify(e))+"]"}function qe(e){for(var t='"',r=0;r<e.length;r+=1){var n=e.charAt(r),s=n.charCodeAt(0);if(n==='"')t+='\\"';else if(n in ce)t+=ce[n];else if(s>=55296&&s<=57343){var o=e.charCodeAt(r+1);s<=56319&&o>=56320&&o<=57343?t+=n+e[++r]:t+="\\u"+s.toString(16).toUpperCase()}else t+=n}return t+='"',t}function oe(){}function lt(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}Promise.resolve();const L=[];function dt(e,t){return{subscribe:K(e,t).subscribe}}function K(e,t=oe){let r;const n=new Set;function s(l){if(lt(e,l)&&(e=l,r)){const a=!L.length;for(const c of n)c[1](),L.push(c,e);if(a){for(let c=0;c<L.length;c+=2)L[c][0](L[c+1]);L.length=0}}}function o(l){s(l(e))}function i(l,a=oe){const c=[l,a];return n.add(c),n.size===1&&(r=t(s)||oe),l(e),()=>{n.delete(c),n.size===0&&(r(),r=null)}}return{set:s,update:o,subscribe:i}}function q(e){return e instanceof Error||e&&e.name&&e.message?e:new Error(JSON.stringify(e))}const Ue={"<":"\\u003C","\u2028":"\\u2028","\u2029":"\\u2029"},ft=new RegExp(`[${Object.keys(Ue).join("")}]`,"g");function ge(e,t){const r=JSON.stringify(t).replace(ft,s=>Ue[s]);let n="";for(const[s,o]of Object.entries(e))o!==void 0&&(n+=` sveltekit:data-${s}=${ze(o)}`);return`<script type="application/json"${n}>${r}<\/script>`}const De={"&":"&amp;",'"':"&quot;"},ut=new RegExp(`[${Object.keys(De).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`,"g");function ze(e){return`"${e.replace(ut,r=>r.length===2?r:De[r]??`&#${r.charCodeAt(0)};`)}"`}const F=JSON.stringify,ht=new TextEncoder;function we(e){le[0]||pt();const t=Ne.slice(0),r=mt(e);for(let s=0;s<r.length;s+=16){const o=r.subarray(s,s+16);let i,l,a,c=t[0],d=t[1],u=t[2],f=t[3],y=t[4],j=t[5],m=t[6],p=t[7];for(let h=0;h<64;h++)h<16?i=o[h]:(l=o[h+1&15],a=o[h+14&15],i=o[h&15]=(l>>>7^l>>>18^l>>>3^l<<25^l<<14)+(a>>>17^a>>>19^a>>>10^a<<15^a<<13)+o[h&15]+o[h+9&15]|0),i=i+p+(y>>>6^y>>>11^y>>>25^y<<26^y<<21^y<<7)+(m^y&(j^m))+le[h],p=m,m=j,j=y,y=f+i|0,f=u,u=d,d=c,c=i+(d&u^f&(d^u))+(d>>>2^d>>>13^d>>>22^d<<30^d<<19^d<<10)|0;t[0]=t[0]+c|0,t[1]=t[1]+d|0,t[2]=t[2]+u|0,t[3]=t[3]+f|0,t[4]=t[4]+y|0,t[5]=t[5]+j|0,t[6]=t[6]+m|0,t[7]=t[7]+p|0}const n=new Uint8Array(t.buffer);return Le(n),He(n)}const Ne=new Uint32Array(8),le=new Uint32Array(64);function pt(){function e(r){return(r-Math.floor(r))*4294967296}let t=2;for(let r=0;r<64;t++){let n=!0;for(let s=2;s*s<=t;s++)if(t%s===0){n=!1;break}n&&(r<8&&(Ne[r]=e(t**(1/2))),le[r]=e(t**(1/3)),r++)}}function Le(e){for(let t=0;t<e.length;t+=4){const r=e[t+0],n=e[t+1],s=e[t+2],o=e[t+3];e[t+0]=o,e[t+1]=s,e[t+2]=n,e[t+3]=r}}function mt(e){const t=ht.encode(e),r=t.length*8,n=512*Math.ceil((r+65)/512),s=new Uint8Array(n/8);s.set(t),s[t.length]=128,Le(s);const o=new Uint32Array(s.buffer);return o[o.length-2]=Math.floor(r/4294967296),o[o.length-1]=r,o}const T="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");function He(e){const t=e.length;let r="",n;for(n=2;n<t;n+=3)r+=T[e[n-2]>>2],r+=T[(e[n-2]&3)<<4|e[n-1]>>4],r+=T[(e[n-1]&15)<<2|e[n]>>6],r+=T[e[n]&63];return n===t+1&&(r+=T[e[n-2]>>2],r+=T[(e[n-2]&3)<<4],r+="=="),n===t&&(r+=T[e[n-2]>>2],r+=T[(e[n-2]&3)<<4|e[n-1]>>4],r+=T[(e[n-1]&15)<<2],r+="="),r}const _e=new Uint8Array(16);function yt(){return crypto.getRandomValues(_e),He(_e)}const gt=new Set(["self","unsafe-eval","unsafe-hashes","unsafe-inline","none","strict-dynamic","report-sample"]),wt=/^(nonce|sha\d\d\d)-/;class Ie{#r;#n;#s;#o;#e;#t;#a;constructor(t,r,n,s){this.#r=t,this.#o=s?{...r}:r;const o=this.#o;if(s){const a=o["style-src"]||o["default-src"];a&&!a.includes("unsafe-inline")&&(o["style-src"]=[...a,"unsafe-inline"])}this.#e=[],this.#t=[];const i=o["script-src"]||o["default-src"],l=o["style-src"]||o["default-src"];this.#n=!!i&&i.filter(a=>a!=="unsafe-inline").length>0,this.#s=!s&&!!l&&l.filter(a=>a!=="unsafe-inline").length>0,this.script_needs_nonce=this.#n&&!this.#r,this.style_needs_nonce=this.#s&&!this.#r,this.#a=n}add_script(t){this.#n&&(this.#r?this.#e.push(`sha256-${we(t)}`):this.#e.length===0&&this.#e.push(`nonce-${this.#a}`))}add_style(t){this.#s&&(this.#r?this.#t.push(`sha256-${we(t)}`):this.#t.length===0&&this.#t.push(`nonce-${this.#a}`))}get_header(t=!1){const r=[],n={...this.#o};this.#t.length>0&&(n["style-src"]=[...n["style-src"]||n["default-src"]||[],...this.#t]),this.#e.length>0&&(n["script-src"]=[...n["script-src"]||n["default-src"]||[],...this.#e]);for(const s in n){if(t&&(s==="frame-ancestors"||s==="report-uri"||s==="sandbox"))continue;const o=n[s];if(!o)continue;const i=[s];Array.isArray(o)&&o.forEach(l=>{gt.has(l)||wt.test(l)?i.push(`'${l}'`):i.push(l)}),r.push(i.join(" "))}return r.join("; ")}}class _t extends Ie{get_meta(){return`<meta http-equiv="content-security-policy" content=${ze(this.get_header(!0))}>`}}class bt extends Ie{constructor(t,r,n,s){if(super(t,r,n,s),Object.values(r).filter(o=>!!o).length>0){const o=r["report-to"]?.length??0>0,i=r["report-uri"]?.length??0>0;if(!o&&!i)throw Error("`content-security-policy-report-only` must be specified with either the `report-to` or `report-uri` directives, or both")}}}class vt{nonce=yt();csp_provider;report_only_provider;constructor({mode:t,directives:r,reportOnly:n},{prerender:s,dev:o}){const i=t==="hash"||t==="auto"&&s;this.csp_provider=new _t(i,r,this.nonce,o),this.report_only_provider=new bt(i,n,this.nonce,o)}get script_needs_nonce(){return this.csp_provider.script_needs_nonce||this.report_only_provider.script_needs_nonce}get style_needs_nonce(){return this.csp_provider.style_needs_nonce||this.report_only_provider.style_needs_nonce}add_script(t){this.csp_provider.add_script(t),this.report_only_provider.add_script(t)}add_style(t){this.csp_provider.add_style(t),this.report_only_provider.add_style(t)}}const be=/^([a-z]+:)?\/?\//,kt=/^[a-z]+:/;function Et(e,t){if(kt.test(t))return t;const r=be.exec(e),n=be.exec(t);if(!r)throw new Error(`bad base path: "${e}"`);const s=n?[]:e.slice(r[0].length).split("/"),o=n?t.slice(n[0].length).split("/"):t.split("/");s.pop();for(let l=0;l<o.length;l+=1){const a=o[l];a!=="."&&(a===".."?s.pop():s.push(a))}return`${n&&n[0]||r&&r[0]||""}${s.join("/")}`}function xt(e){return e[0]==="/"&&e[1]!=="/"}function jt(e,t){return e==="/"||t==="ignore"?e:t==="never"?e.endsWith("/")?e.slice(0,-1):e:t==="always"&&!e.endsWith("/")?e+"/":e}function Ot(e){for(const t in e)e[t]=e[t].replace(/%23/g,"#").replace(/%3[Bb]/g,";").replace(/%2[Cc]/g,",").replace(/%2[Ff]/g,"/").replace(/%3[Ff]/g,"?").replace(/%3[Aa]/g,":").replace(/%40/g,"@").replace(/%26/g,"&").replace(/%3[Dd]/g,"=").replace(/%2[Bb]/g,"+").replace(/%24/g,"$");return e}class St extends URL{get hash(){throw new Error("url.hash is inaccessible from load. Consider accessing hash from the page store within the script tag of your component.")}}class We extends URL{get search(){throw new Error("Cannot access url.search on a page with prerendering enabled")}get searchParams(){throw new Error("Cannot access url.searchParams on a page with prerendering enabled")}}const At={...dt(!1),check:()=>!1};async function X({branch:e,options:t,state:r,$session:n,page_config:s,status:o,error:i=null,event:l,resolve_opts:a,stuff:c}){if(r.prerendering){if(t.csp.mode==="nonce")throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');if(t.template_contains_nonce)throw new Error("Cannot use prerendering if page template contains %sveltekit.nonce%")}const{entry:d}=t.manifest._,u=new Set(d.stylesheets),f=new Set(d.imports),y=new Map,j=[];let m,p,h=!1,g;const w=i?.stack;if(t.dev&&i&&(i.stack=t.get_stack(i)),a.ssr){const x=e.at(-1);x.loaded.status&&(o=x.loaded.status);for(const{node:E,props:D,loaded:$,fetched:C,uses_credentials:V}of e)E.imports&&E.imports.forEach(R=>f.add(R)),E.stylesheets&&E.stylesheets.forEach(R=>u.add(R)),E.inline_styles&&Object.entries(await E.inline_styles()).forEach(([R,te])=>y.set(R,te)),C&&s.hydrate&&j.push(...C),D&&(m=D),g=$?.cache,h=g?.private??V;const O=K(n);h=h||(g?.private??(!!n&&Object.keys(n).length>0));const N={stores:{page:K(null),navigating:K(null),session:O,updated:At},page:{error:i,params:l.params,routeId:l.routeId,status:o,stuff:c,url:r.prerendering?new We(l.url):l.url},components:e.map(({node:E})=>E.module.default)},k=(E,D)=>{Object.defineProperty(N.page,E,{get:()=>{throw new Error(`$page.${E} has been replaced by $page.url.${D}`)}})};k("origin","origin"),k("path","pathname"),k("query","searchParams");for(let E=0;E<e.length;E+=1)N[`props_${E}`]=await e[E].loaded.props;p=t.root.render(N)}else p={head:"",html:"",css:{code:"",map:null}};let{head:_,html:b}=p;const v=new vt(t.csp,{dev:t.dev,prerender:!!r.prerendering}),S=Z(b),A=`
		import { set_public_env, start } from ${F(t.prefix+d.file)};

		set_public_env(${F(t.public_env)});

		start({
			target: document.querySelector('[data-sveltekit-hydrate="${S}"]').parentNode,
			paths: ${F(t.paths)},
			session: ${Rt(n,x=>{throw new Error(`Failed to serialize session data: ${x.message}`)})},
			route: ${!!s.router},
			spa: ${!a.ssr},
			trailing_slash: ${F(t.trailing_slash)},
			hydrate: ${a.ssr&&s.hydrate?`{
				status: ${o},
				error: ${i&&pe(i,x=>x.stack)},
				nodes: [${e.map(({node:x})=>x.index).join(", ")}],
				params: ${Pe(l.params)},
				routeId: ${F(l.routeId)}
			}`:"null"}
		});
	`,P=`
		if ('serviceWorker' in navigator) {
			addEventListener('load', function () {
				navigator.serviceWorker.register('${t.service_worker}');
			});
		}
	`;if(y.size>0){const x=Array.from(y.values()).join(`
`),O=[];t.dev&&O.push(" data-sveltekit"),v.style_needs_nonce&&O.push(` nonce="${v.nonce}"`),v.add_style(x),_+=`
	<style${O.join("")}>${x}</style>`}if(_+=Array.from(u).map(x=>{const O=['rel="stylesheet"',`href="${t.prefix+x}"`];return v.style_needs_nonce&&O.push(`nonce="${v.nonce}"`),y.has(x)&&O.push("disabled",'media="(max-width: 0)"'),`
	<link ${O.join(" ")}>`}).join(""),s.router||s.hydrate){_+=Array.from(f).map(O=>`
	<link rel="modulepreload" href="${t.prefix+O}">`).join("");const x=['type="module"',`data-sveltekit-hydrate="${S}"`];v.add_script(A),v.script_needs_nonce&&x.push(`nonce="${v.nonce}"`),b+=`
		<script ${x.join(" ")}>${A}<\/script>`,b+=j.map(({url:O,body:N,response:k})=>ge({type:"data",url:O,body:typeof N=="string"?Z(N):void 0},k)).join(`
	`),m&&(b+=ge({type:"props"},m))}if(t.service_worker&&(v.add_script(P),_+=`
			<script${v.script_needs_nonce?` nonce="${v.nonce}"`:""}>${P}<\/script>`),r.prerendering){const x=[],O=v.csp_provider.get_meta();O&&x.push(O),g&&x.push(`<meta http-equiv="cache-control" content="max-age=${g.maxage}">`),x.length>0&&(_=x.join(`
`)+_)}const I=l.url.pathname.slice(t.paths.base.length).split("/").slice(2),z=t.paths.assets||(I.length>0?I.map(()=>"..").join("/"):"."),W=await a.transformPageChunk({html:t.template({head:_,body:b,assets:z,nonce:v.nonce}),done:!0})||"",U=new Headers({"content-type":"text/html",etag:`"${Z(W)}"`});if(g&&U.set("cache-control",`${h?"private":"public"}, max-age=${g.maxage}`),!r.prerendering){const x=v.csp_provider.get_header();x&&U.set("content-security-policy",x);const O=v.report_only_provider.get_header();O&&U.set("content-security-policy-report-only",O)}return t.dev&&i&&(i.stack=w),new Response(W,{status:o,headers:U})}function Rt(e,t){try{return Pe(e)}catch(r){return t&&t(q(r)),null}}/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */var $t=Tt,Ct=qt,Pt=Object.prototype.toString,G=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;function Tt(e,t){if(typeof e!="string")throw new TypeError("argument str must be a string");for(var r={},n=t||{},s=n.decode||Ut,o=0;o<e.length;){var i=e.indexOf("=",o);if(i===-1)break;var l=e.indexOf(";",o);if(l===-1)l=e.length;else if(l<i){o=e.lastIndexOf(";",i-1)+1;continue}var a=e.slice(o,i).trim();if(r[a]===void 0){var c=e.slice(i+1,l).trim();c.charCodeAt(0)===34&&(c=c.slice(1,-1)),r[a]=Nt(c,s)}o=l+1}return r}function qt(e,t,r){var n=r||{},s=n.encode||Dt;if(typeof s!="function")throw new TypeError("option encode is invalid");if(!G.test(e))throw new TypeError("argument name is invalid");var o=s(t);if(o&&!G.test(o))throw new TypeError("argument val is invalid");var i=e+"="+o;if(n.maxAge!=null){var l=n.maxAge-0;if(isNaN(l)||!isFinite(l))throw new TypeError("option maxAge is invalid");i+="; Max-Age="+Math.floor(l)}if(n.domain){if(!G.test(n.domain))throw new TypeError("option domain is invalid");i+="; Domain="+n.domain}if(n.path){if(!G.test(n.path))throw new TypeError("option path is invalid");i+="; Path="+n.path}if(n.expires){var a=n.expires;if(!zt(a)||isNaN(a.valueOf()))throw new TypeError("option expires is invalid");i+="; Expires="+a.toUTCString()}if(n.httpOnly&&(i+="; HttpOnly"),n.secure&&(i+="; Secure"),n.priority){var c=typeof n.priority=="string"?n.priority.toLowerCase():n.priority;switch(c){case"low":i+="; Priority=Low";break;case"medium":i+="; Priority=Medium";break;case"high":i+="; Priority=High";break;default:throw new TypeError("option priority is invalid")}}if(n.sameSite){var d=typeof n.sameSite=="string"?n.sameSite.toLowerCase():n.sameSite;switch(d){case!0:i+="; SameSite=Strict";break;case"lax":i+="; SameSite=Lax";break;case"strict":i+="; SameSite=Strict";break;case"none":i+="; SameSite=None";break;default:throw new TypeError("option sameSite is invalid")}}return i}function Ut(e){return e.indexOf("%")!==-1?decodeURIComponent(e):e}function Dt(e){return encodeURIComponent(e)}function zt(e){return Pt.call(e)==="[object Date]"||e instanceof Date}function Nt(e,t){try{return t(e)}catch{return e}}var ee={exports:{}},H={decodeValues:!0,map:!1,silent:!1};function de(e){return typeof e=="string"&&!!e.trim()}function fe(e,t){var r=e.split(";").filter(de),n=r.shift().split("="),s=n.shift(),o=n.join("=");t=t?Object.assign({},H,t):H;try{o=t.decodeValues?decodeURIComponent(o):o}catch(l){console.error("set-cookie-parser encountered an error while decoding a cookie with value '"+o+"'. Set options.decodeValues to false to disable this feature.",l)}var i={name:s,value:o};return r.forEach(function(l){var a=l.split("="),c=a.shift().trimLeft().toLowerCase(),d=a.join("=");c==="expires"?i.expires=new Date(d):c==="max-age"?i.maxAge=parseInt(d,10):c==="secure"?i.secure=!0:c==="httponly"?i.httpOnly=!0:c==="samesite"?i.sameSite=d:i[c]=d}),i}function Me(e,t){if(t=t?Object.assign({},H,t):H,!e)return t.map?{}:[];if(e.headers&&e.headers["set-cookie"])e=e.headers["set-cookie"];else if(e.headers){var r=e.headers[Object.keys(e.headers).find(function(s){return s.toLowerCase()==="set-cookie"})];!r&&e.headers.cookie&&!t.silent&&console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."),e=r}if(Array.isArray(e)||(e=[e]),t=t?Object.assign({},H,t):H,t.map){var n={};return e.filter(de).reduce(function(s,o){var i=fe(o,t);return s[i.name]=i,s},n)}else return e.filter(de).map(function(s){return fe(s,t)})}function Lt(e){if(Array.isArray(e))return e;if(typeof e!="string")return[];var t=[],r=0,n,s,o,i,l;function a(){for(;r<e.length&&/\s/.test(e.charAt(r));)r+=1;return r<e.length}function c(){return s=e.charAt(r),s!=="="&&s!==";"&&s!==","}for(;r<e.length;){for(n=r,l=!1;a();)if(s=e.charAt(r),s===","){for(o=r,r+=1,a(),i=r;r<e.length&&c();)r+=1;r<e.length&&e.charAt(r)==="="?(l=!0,r=i,t.push(e.substring(n,o)),n=r):r=o+1}else r+=1;(!l||r>=e.length)&&t.push(e.substring(n,e.length))}return t}ee.exports=Me;ee.exports.parse=Me;var ve=ee.exports.parseString=fe,Ht=ee.exports.splitCookiesString=Lt;function It(e){if(!e)return{};if(e.fallthrough)throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");if("maxage"in e)throw new Error("maxage should be replaced with cache: { maxage }");const t=e.status&&e.status>=400&&e.status<=599&&!e.redirect;if(e.error||t){const r=e.status;if(!e.error&&t)return{status:r||500,error:new Error(`${r}`)};const n=typeof e.error=="string"?new Error(e.error):e.error;return n instanceof Error?!r||r<400||r>599?(console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500'),{status:500,error:n}):{status:r,error:n}:{status:500,error:new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof n}"`)}}if(e.redirect){if(!e.status||Math.floor(e.status/100)!==3)throw new Error('"redirect" property returned from load() must be accompanied by a 3xx status code');if(typeof e.redirect!="string")throw new Error('"redirect" property returned from load() must be a string')}if(e.dependencies&&(!Array.isArray(e.dependencies)||e.dependencies.some(r=>typeof r!="string")))throw new Error('"dependencies" property returned from load() must be of type string[]');if(e.context)throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');return e}function Wt(e,t){if(!t)return!0;const r=t[0]==="."?t.slice(1):t;return e===r?!0:e.endsWith("."+r)}function Mt(e,t){if(!t)return!0;const r=t.endsWith("/")?t.slice(0,-1):t;return e===r?!0:e.startsWith(r+"/")}async function Q({event:e,options:t,state:r,route:n,node:s,$session:o,stuff:i,is_error:l,is_leaf:a,status:c,error:d}){const{module:u}=s;let f=!1;const y=[],j=$t(e.request.headers.get("cookie")||""),m=[];let p;const h=s.module.prerender??t.prerender.default,g=a?await Bt(n,e,t,h):{};if(g.cookies&&g.cookies.forEach(w=>{m.push(ve(w))}),g.error)p={error:g.error};else if(g.redirect)p={redirect:g.redirect};else if(u.load){const w={url:r.prerendering?new We(e.url):new St(e.url),params:e.params,props:g.body||{},routeId:e.routeId,get session(){if(s.module.prerender??t.prerender.default)throw Error("Attempted to access session from a prerendered page. Session would never be populated.");return f=!0,o},fetch:async(_,b={})=>{let v;typeof _=="string"?v=_:(v=_.url,b={method:_.method,headers:_.headers,body:_.body,mode:_.mode,credentials:_.credentials,cache:_.cache,redirect:_.redirect,referrer:_.referrer,integrity:_.integrity,...b}),b.headers=new Headers(b.headers);for(const[k,E]of e.request.headers)k!=="authorization"&&k!=="connection"&&k!=="cookie"&&k!=="host"&&k!=="if-none-match"&&!b.headers.has(k)&&b.headers.set(k,E);const S=Et(e.url.pathname,v.split("?")[0]);let A,P;const I=t.paths.assets||t.paths.base,z=decodeURIComponent(S.startsWith(I)?S.slice(I.length):S).slice(1),W=`${z}/index.html`,U=t.manifest.assets.has(z),x=t.manifest.assets.has(W);if(U||x){const k=U?z:W;if(t.read){const E=U?t.manifest.mimeTypes[z.slice(z.lastIndexOf("."))]:"text/html";A=new Response(t.read(k),{headers:E?{"content-type":E}:{}})}else A=await fetch(`${e.url.origin}/${k}`,b)}else if(xt(S)){if(b.credentials!=="omit"){f=!0;const k=e.request.headers.get("authorization"),E={...j};for(const $ of m)!Wt(e.url.hostname,$.domain)||!Mt(S,$.path)||(E[$.name]=$.value);const D=Object.entries(E).map(([$,C])=>`${$}=${C}`).join("; ");D&&b.headers.set("cookie",D),k&&!b.headers.has("authorization")&&b.headers.set("authorization",k)}if(b.body&&typeof b.body!="string")throw new Error("Request body must be a string");A=await Be(new Request(new URL(v,e.url).href,{...b}),t,{...r,initiator:n}),r.prerendering&&(P={response:A,body:null},r.prerendering.dependencies.set(S,P))}else{if(S.startsWith("//")&&(v=e.url.protocol+v),`.${new URL(v).hostname}`.endsWith(`.${e.url.hostname}`)&&b.credentials!=="omit"){f=!0;const E=e.request.headers.get("cookie");E&&b.headers.set("cookie",E)}b.headers.delete("connection");const k=new Request(v,b);A=await t.hooks.externalFetch.call(null,k)}const O=A.headers.get("set-cookie");return O&&m.push(...Ht(O).map(k=>ve(k))),new Proxy(A,{get(k,E,D){async function $(){const C=await k.text(),V={};for(const[R,te]of k.headers)R!=="set-cookie"&&R!=="etag"&&(V[R]=te);if(!b.body||typeof b.body=="string"){const R=Number(k.status);if(isNaN(R))throw new Error(`response.status is not a number. value: "${k.status}" type: ${typeof k.status}`);y.push({url:v,body:b.body,response:{status:R,statusText:k.statusText,headers:V,body:C}})}return P&&(P.body=C),C}return E==="arrayBuffer"?async()=>{const C=await k.arrayBuffer();return P&&(P.body=new Uint8Array(C)),C}:E==="text"?$:E==="json"?async()=>JSON.parse(await $()):Reflect.get(k,E,k)}})},stuff:{...i},status:(l?c:g.status)??null,error:l?d??null:null};t.dev&&Object.defineProperty(w,"page",{get:()=>{throw new Error("`page` in `load` functions has been replaced by `url` and `params`")}}),p=It(await u.load.call(null,w))}else g.body?p={props:g.body}:p={};if(p.status=p.status??g.status,g.body&&r.prerendering){const w=`${e.url.pathname.replace(/\/$/,"")}/__data.json`,_={response:new Response(void 0),body:JSON.stringify(g.body)};r.prerendering.dependencies.set(w,_)}return{node:s,props:g.body,loaded:p,stuff:p.stuff||i,fetched:y,set_cookie_headers:m.map(w=>{const{name:_,value:b,...v}=w;return Ct(_,b,v)}),uses_credentials:f}}async function Bt(e,t,r,n){if(!e.shadow)return{};try{const s=await e.shadow();if(Ce(s),n&&(s.POST||s.PUT||s.DELETE||s.PATCH))throw new Error("Cannot prerender pages that have endpoints with mutative methods");const{method:o}=t.request,i=o==="HEAD"||o==="GET",l=o==="HEAD"?s.HEAD||s.GET:s[o];if(!l&&!i)return{status:405,error:new Error(`${o} method not allowed`)};const a={status:void 0,cookies:[],body:{}};if(!i){const{status:d,headers:u,body:f}=Ee(await l(t));if(ke(a.cookies,u),a.status=d,f instanceof Error)return d<400?(a.status=500,a.error=new Error("A non-error status code was returned with an error body")):a.error=f,a;if(d>=300&&d<400)return a.redirect=u instanceof Headers?u.get("location"):u.location,a;a.body=f}const c=o==="HEAD"&&s.HEAD||s.GET;if(c){const{status:d,headers:u,body:f}=Ee(await c(t));if(ke(a.cookies,u),f instanceof Error)return d<400?(a.status=500,a.error=new Error("A non-error status code was returned with an error body")):(a.status=d,a.error=f),a;if(d>=400)return a.status=d,a.error=new Error("Failed to load data"),a;if(d>=300)return a.status=d,a.redirect=u instanceof Headers?u.get("location"):u.location,a;a.body={...f,...a.body}}return a}catch(s){const o=q(s);return r.handle_error(o,t),{status:500,error:o}}}function ke(e,t){const r=t["set-cookie"];r&&(Array.isArray(r)?e.push(...r):e.push(r))}function Ee(e){if(e.fallthrough)throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");const{status:t=200,body:r={}}=e;let n=e.headers||{};if(n instanceof Headers){if(n.has("set-cookie"))throw new Error("Endpoint request handler cannot use Headers interface with Set-Cookie headers")}else n=Ke(n);if(!Re(r))throw new Error("Body returned from endpoint request handler must be a plain object or an Error");return{status:t,headers:n,body:r}}async function J({event:e,options:t,state:r,$session:n,status:s,error:o,resolve_opts:i}){try{const l=[];let a={};if(i.ssr){const c=await t.manifest._.nodes[0](),d=await t.manifest._.nodes[1](),u=await Q({event:e,options:t,state:r,route:ae,node:c,$session:n,stuff:{},is_error:!1,is_leaf:!1});if(u.loaded.error)throw u.loaded.error;const f=await Q({event:e,options:t,state:r,route:ae,node:d,$session:n,stuff:u?u.stuff:{},is_error:!0,is_leaf:!1,status:s,error:o});l.push(u,f),a=f.stuff}return await X({options:t,state:r,$session:n,page_config:{hydrate:t.hydrate,router:t.router},stuff:a,status:s,error:o,branch:l,event:e,resolve_opts:i})}catch(l){const a=q(l);return t.handle_error(a,e),new Response(a.stack,{status:500})}}async function Ft(e){const{event:t,options:r,state:n,$session:s,route:o,resolve_opts:i}=e;let l;if(!i.ssr)return await X({...e,branch:[],page_config:{hydrate:!0,router:!0},status:200,error:null,event:t,stuff:{}});try{l=await Promise.all(o.a.map(m=>m==null?m:r.manifest._.nodes[m]()))}catch(m){const p=q(m);return r.handle_error(p,t),await J({event:t,options:r,state:n,$session:s,status:500,error:p,resolve_opts:i})}const a=l[l.length-1].module;let c=xe(a,r);if(n.prerendering&&!(a.prerender??r.prerender.default))return new Response(void 0,{status:204});let d=[],u=200,f=null,y=[],j={};e:for(let m=0;m<l.length;m+=1){const p=l[m];let h;if(p){try{if(h=await Q({...e,node:p,stuff:j,is_error:!1,is_leaf:m===l.length-1}),y=y.concat(h.set_cookie_headers),h.loaded.redirect)return Y(new Response(void 0,{status:h.loaded.status,headers:{location:h.loaded.redirect}}),y);h.loaded.error&&(f=h.loaded.error,u=h.loaded.status??500)}catch(g){const w=q(g);r.handle_error(w,t),u=500,f=w}if(h&&!f&&d.push(h),f){for(;m--;)if(o.b[m]){const g=o.b[m],w=await r.manifest._.nodes[g]();let _,b=m;for(;!(_=d[b]);)b-=1;try{const v=await Q({...e,node:w,stuff:_.stuff,is_error:!0,is_leaf:!1,status:u,error:f});if(v.loaded.error)continue;c=xe(w.module,r),d=d.slice(0,b+1).concat(v),j={..._.stuff,...v.stuff};break e}catch(v){const S=q(v);r.handle_error(S,t);continue}}return Y(await J({event:t,options:r,state:n,$session:s,status:u,error:f,resolve_opts:i}),y)}}h&&h.loaded.stuff&&(j={...j,...h.loaded.stuff})}try{return Y(await X({...e,stuff:j,event:t,page_config:c,status:u,error:f,branch:d.filter(Boolean)}),y)}catch(m){const p=q(m);return r.handle_error(p,t),Y(await J({...e,status:500,error:p}),y)}}function xe(e,t){if("ssr"in e)throw new Error("`export const ssr` has been removed \u2014 use the handle hook instead: https://kit.svelte.dev/docs/hooks#handle");return{router:"router"in e?!!e.router:t.router,hydrate:"hydrate"in e?!!e.hydrate:t.hydrate}}function Y(e,t){return t.length&&t.forEach(r=>{e.headers.append("set-cookie",r)}),e}async function Jt(e,t,r,n,s){if(n.initiator===t)return new Response(`Not found: ${e.url.pathname}`,{status:404});if(t.shadow&&Ae(e.request.headers.get("accept")||"text/html",["text/html","application/json"])==="application/json")return ie(e,await t.shadow(),r);const o=await r.hooks.getSession(e);return Ft({event:e,options:r,state:n,$session:o,resolve_opts:s,route:t})}function Vt(e,t,r,n){const s={};for(let o=0;o<t.length;o+=1){const i=t[o],l=r[o],a=e[o+1]||"";if(l){const c=n[l];if(!c)throw new Error(`Missing "${l}" param matcher`);if(!c(a))return}s[i]=a}return s}const je="/__data.json",Oe=({html:e})=>e;async function Be(e,t,r){let n=new URL(e.url);const{parameter:s,allowed:o}=t.method_override,i=n.searchParams.get(s)?.toUpperCase();if(i)if(e.method==="POST")if(o.includes(i))e=new Proxy(e,{get:(p,h,g)=>h==="method"?i:Reflect.get(p,h,p)});else{const p=o.length===0?"enabled":"allowed",h=`${s}=${i} is not ${p}. See https://kit.svelte.dev/docs/configuration#methodoverride`;return new Response(h,{status:400})}else throw new Error(`${s}=${i} is only allowed with POST requests`);let l;try{l=decodeURI(n.pathname)}catch{return new Response("Malformed URI",{status:400})}let a=null,c={};if(t.paths.base&&!r.prerendering?.fallback){if(!l.startsWith(t.paths.base))return new Response("Not found",{status:404});l=l.slice(t.paths.base.length)||"/"}const d=l.endsWith(je);if(d){const p=je.length-(t.trailing_slash==="always"?1:0);l=l.slice(0,-p)||"/",n=new URL(n.origin+n.pathname.slice(0,-p)+n.search)}if(!r.prerendering?.fallback){const p=await t.manifest._.matchers();for(const h of t.manifest._.routes){const g=h.pattern.exec(l);if(!g)continue;const w=Vt(g,h.names,h.types,p);if(w){a=h,c=Ot(w);break}}}if(a){if(a.type==="page"){const p=jt(n.pathname,t.trailing_slash);if(p!==n.pathname&&!r.prerendering?.fallback)return new Response(void 0,{status:301,headers:{"x-sveltekit-normalize":"1",location:(p.startsWith("//")?n.origin+p:p)+(n.search==="?"?"":n.search)}})}else if(d)return new Response(void 0,{status:404})}const u={get clientAddress(){if(!r.getClientAddress)throw new Error("@sveltejs/adapter-node does not specify getClientAddress. Please raise an issue");return Object.defineProperty(u,"clientAddress",{value:r.getClientAddress()}),u.clientAddress},locals:{},params:c,platform:r.platform,request:e,routeId:a&&a.id,url:n},f=(p,h,g="")=>({get:()=>{throw new Error(`event.${p} has been replaced by event.${h}`+g)}}),y=". See https://github.com/sveltejs/kit/pull/3384 for details",j={get:()=>{throw new Error("To access the request body use the text/json/arrayBuffer/formData methods, e.g. `body = await request.json()`"+y)}};Object.defineProperties(u,{method:f("method","request.method",y),headers:f("headers","request.headers",y),origin:f("origin","url.origin"),path:f("path","url.pathname"),query:f("query","url.searchParams"),body:j,rawBody:j});let m={ssr:!0,transformPageChunk:Oe};try{const p=await t.hooks.handle({event:u,resolve:async(h,g)=>{if(g){if(g.transformPage)throw new Error("transformPage has been replaced by transformPageChunk \u2014 see https://github.com/sveltejs/kit/pull/5657 for more information");m={ssr:g.ssr!==!1,transformPageChunk:g.transformPageChunk||Oe}}if(r.prerendering?.fallback)return await X({event:h,options:t,state:r,$session:await t.hooks.getSession(h),page_config:{router:!0,hydrate:!0},stuff:{},status:200,error:null,branch:[],resolve_opts:{...m,ssr:!1}});if(a){let w;if(d&&a.type==="page"&&a.shadow){if(w=await ie(h,await a.shadow(),t),e.headers.has("x-sveltekit-load")&&w.status>=300&&w.status<400){const _=w.headers.get("location");if(_){const b=new Headers(w.headers);b.set("x-sveltekit-location",_),w=new Response(void 0,{status:204,headers:b})}}}else w=a.type==="endpoint"?await ie(h,await a.load(),t):await Jt(h,a,t,r,m);if(w){if(w.status===200&&w.headers.has("etag")){let _=e.headers.get("if-none-match");_?.startsWith('W/"')&&(_=_.substring(2));const b=w.headers.get("etag");if(_===b){const v=new Headers({etag:b});for(const S of["cache-control","content-location","date","expires","vary"]){const A=w.headers.get(S);A&&v.set(S,A)}return new Response(void 0,{status:304,headers:v})}}return w}}if(r.initiator===ae)return new Response("Internal Server Error",{status:500});if(!r.initiator){const w=await t.hooks.getSession(h);return await J({event:h,options:t,state:r,$session:w,status:404,error:new Error(`Not found: ${h.url.pathname}`),resolve_opts:m})}return r.prerendering?new Response("not found",{status:404}):await fetch(e)},get request(){throw new Error("request in handle has been replaced with event"+y)}});if(p&&!(p instanceof Response))throw new Error("handle must return a Response object"+y);return p}catch(p){const h=q(p);t.handle_error(h,u);const g=Ae(u.request.headers.get("accept")||"text/html",["text/html","application/json"]);if(d||g==="application/json")return new Response(pe(h,t.get_stack),{status:500,headers:{"content-type":"application/json; charset=utf-8"}});try{const w=await t.hooks.getSession(u);return await J({event:u,options:t,state:r,$session:w,status:500,error:h,resolve_opts:m})}catch(w){const _=q(w);return new Response(t.dev?_.stack:_.message,{status:500})}}}let ue="",he="";function Fe(e){ue=e.base,he=e.assets||ue}const Gt=({head:e,body:t,assets:r,nonce:n})=>`<!DOCTYPE html>
<html lang="en" data-theme="" style="background:black">
        <head>
                <meta charset="utf-8" />
                <title>Sujay's Portfolio</title>
                <link rel="icon" href="`+r+`/favicon.png" />
                <link rel="stylesheet" id="theme" href=""/>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <meta name="description" content="Yet another Windows XP in the browser, but with a File System and comes with it, Programs."/>
                
                <link rel="preload" href="/images/xp_loading_logo.jpg" as="image" />
                <link rel="preload" href="/images/xp_loading_mslogo.jpg" as="image" />
                <link rel="preload" href="/fonts/ms_sans_serif.ttf" as="font" type="font/ttf" crossorigin />
                <link rel="preload" href="/fonts/ms_sans_serif_bold.ttf" as="font" type="font/ttf" crossorigin />
                <link rel="preload" href="/json/hard_drive.json" as="fetch" crossorigin />
                
                <link rel="prefetch" href="/images/xp/icons/Desktop.png" />
                <link rel="prefetch" href="/images/xp/icons/MyComputer.png" />
                <link rel="prefetch" href="/images/xp/icons/RecycleBin.png" />
                
                `+e+`

                <style>
                        html, body {
                        margin: 0;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        }

                        section {
                        width: 100vw;
                        height: 100vh;
                        }

                        p {
                        margin: 0;
                        line-height: 1.5em;
                        }

                        .blink {
                        animation: blink-animation 1s steps(5, start) infinite;
                        -webkit-animation: blink-animation 1s steps(5, start) infinite;
                        }

                        @keyframes blink-animation {
                        to {
                                visibility: hidden;
                        }
                        }
                        @-webkit-keyframes blink-animation {
                        to {
                                visibility: hidden;
                        }
                        }
                        .actions {
                        position: fixed;
                        bottom: 0;
                        width: 100%;
                        }

                        .float-right {
                        position: fixed;
                        bottom: 0;
                        right: 0;
                        padding-right: 2em;
                        }

                        #bios {
                        display: block;
                        background: #000;
                        color: #ccc;
                        font-family: monospace;
                        }

                        #loader {
                        display: none;
                        background: #000;
                        color: #ccc;
                        }

                        .loader {
                        position: relative;
                        padding-top: 100px;
                        width: 40px;
                        margin: auto;
                        }
                        .loader .circle {
                        position: absolute;
                        width: 38px;
                        height: 38px;
                        opacity: 0;
                        transform: rotate(225deg);
                        animation-iteration-count: infinite;
                        animation-name: orbit;
                        animation-duration: 5.5s;
                        }
                        .loader .circle:after {
                        content: "";
                        position: absolute;
                        width: 5px;
                        height: 5px;
                        border-radius: 5px;
                        background: #fff;
                        /* Pick a color */
                        }
                        .loader .circle:nth-child(2) {
                        animation-delay: 240ms;
                        }
                        .loader .circle:nth-child(3) {
                        animation-delay: 480ms;
                        }
                        .loader .circle:nth-child(4) {
                        animation-delay: 720ms;
                        }
                        .loader .circle:nth-child(5) {
                        animation-delay: 960ms;
                        }

                        @keyframes orbit {
                        0% {
                                transform: rotate(225deg);
                                opacity: 1;
                                animation-timing-function: ease-out;
                        }
                        7% {
                                transform: rotate(345deg);
                                animation-timing-function: linear;
                        }
                        30% {
                                transform: rotate(455deg);
                                animation-timing-function: ease-in-out;
                        }
                        39% {
                                transform: rotate(690deg);
                                animation-timing-function: linear;
                        }
                        70% {
                                transform: rotate(815deg);
                                opacity: 1;
                                animation-timing-function: ease-out;
                        }
                        75% {
                                transform: rotate(945deg);
                                animation-timing-function: ease-out;
                        }
                        76% {
                                transform: rotate(945deg);
                                opacity: 0;
                        }
                        100% {
                                transform: rotate(945deg);
                                opacity: 0;
                        }
                        }
                </style>
                
        </head>
        <body>

                <div id="iframe-preload" style="position: absolute;inset: 0;display: none;"></div>
                
                <div style="position:absolute;inset:0;">`+t+`</div>

                <div id="pos_loader" style="position:absolute;inset:0;padding:10px;background-color:black;font-size: 18px;">
                        <!-- Bootup by Kyle Stephens -->
                        <!-- https://codepen.io/kylestephens/pen/zYOgLrr -->
                        <section id="bios">
                                <p>PhoenixBIOS 1.4 Release 6.0</p>
                                <p>Copyright 1985-2001 Phoenix Technologies Ltd.</p>
                                <p>All Rights Reserved</p>
                                <p>Copyright 2001-2003 VMware. Inc.</p>
                                <p>VMware BIOS build 314</p>
                                <br />
                                <p>ATAPI CD-ROM: VMware Virtual IDECDROM Drive</p>
                                <p>Initializing <span class="blink">...</span></p>
                          
                          </section>
                          
                        <section id="loader">
                                <div class='loader'>
                                        <div class='circle'></div>
                                        <div class='circle'></div>
                                        <div class='circle'></div>
                                        <div class='circle'></div>
                                        <div class='circle'></div>
                                </div>
                        </section>
                </div>

                <script>
                        window.addEventListener('contextmenu', (event) => {
                                event.preventDefault();
                        })
                <\/script>
                
                <script src="//unpkg.com/loadjs@latest/dist/loadjs.min.js"><\/script>

                <script>
                        function load_assets(assets, completion){
                                Promise
                                .all(assets.map(asset=>fetch(asset)))
                                .then(responses =>
                                        Promise.all(responses.map(res => res.blob()))
                                ).then(completion);
                        }

                        load_assets([
                                '/images/xp_loading_logo.jpg',
                                '/images/xp_loading_mslogo.jpg',
                                '/images/xp_logo_horizontal.png',
                                '/images/xp_logo.png',
                                '/fonts/levi.ttf', 
                                '/fonts/ms_sans_serif_bold.ttf', 
                                '/fonts/ms_sans_serif.ttf'], () => {
                                document.querySelector('#pos_loader').style.display = 'none';
                        })

                <\/script>

                <script>

                        document.addEventListener('dragover', function(e){
                                e.preventDefault();
                                console.log('dragover');
                        })
                
                        document.addEventListener('drop', function(e){
                                e.preventDefault();
                                console.log('drop');
                        })
                <\/script>

        </body>
</html>

`;let Je=null;Fe({base:"",assets:""});let Se="https";function Zt(e){Se=e.protocol||Se,Fe(e.paths),e.prerendering,Je=e.read}class Kt{constructor(t){this.options={csp:{mode:"auto",directives:{"upgrade-insecure-requests":!1,"block-all-mixed-content":!1},reportOnly:{"upgrade-insecure-requests":!1,"block-all-mixed-content":!1}},dev:!1,get_stack:r=>String(r),handle_error:(r,n)=>{this.options.hooks.handleError({error:r,event:n,get request(){throw new Error("request in handleError has been replaced with event. See https://github.com/sveltejs/kit/pull/3384 for details")}}),r.stack=this.options.get_stack(r)},hooks:null,hydrate:!0,manifest:t,method_override:{parameter:"_method",allowed:[]},paths:{base:ue,assets:he},prefix:he+"/",prerender:{default:!1,enabled:!0},public_env:{},read:Je,root:Ye,service_worker:null,router:!0,template:Gt,template_contains_nonce:!1,trailing_slash:"never"}}init({env:t}){Object.fromEntries(Object.entries(t).filter(([n])=>!n.startsWith("PUBLIC_")));const r=Object.fromEntries(Object.entries(t).filter(([n])=>n.startsWith("PUBLIC_")));this.options.public_env=r}async respond(t,r={}){if(!(t instanceof Request))throw new Error("The first argument to server.respond must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details");if(!this.options.hooks){const n=await import("./_app/immutable/chunks/hooks-88b6e47b.js");this.options.hooks={getSession:n.getSession||(()=>({})),handle:n.handle||(({event:s,resolve:o})=>o(s)),handleError:n.handleError||(({error:s})=>console.error(s.stack)),externalFetch:n.externalFetch||fetch}}return Be(t,this.options,r)}}export{Kt as Server,Zt as override};
