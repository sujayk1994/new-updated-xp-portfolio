import{v as p}from"../../../../_app/immutable/chunks/auth-e33c57ab.js";import{q as a,i as l}from"../../../../_app/immutable/chunks/db-aae5410a.js";import"bcrypt";import"jsonwebtoken";import"crypto";import"pg";let o=!1;async function c(){o||(await l(),o=!0)}function u(r){const s=r.headers.get("cookie")||"",e=Object.fromEntries(s.split(";").map(t=>{const[i,...d]=t.trim().split("=");return[i,d.join("=")]})).admin_token;return e?p(e):null}async function g({request:r}){await c();try{const s=await a("SELECT * FROM admin_files ORDER BY date_created ASC"),n={};for(const e of s.rows)n[e.id]={id:e.id,type:e.type,name:e.name,basename:e.basename,ext:e.ext,parent:e.parent,icon:e.icon,storage_type:e.storage_type,url:e.url,size:e.size,children:JSON.parse(e.children||"[]"),date_created:parseInt(e.date_created),date_modified:parseInt(e.date_modified),sort_option:e.sort_option,sort_order:e.sort_order,starting_point:e.starting_point,executable:e.executable,is_admin:!0};return new Response(JSON.stringify({success:!0,files:n}),{status:200,headers:{"Content-Type":"application/json"}})}catch(s){return console.error("Error fetching admin files:",s),new Response(JSON.stringify({success:!1,error:s.message}),{status:500,headers:{"Content-Type":"application/json"}})}}async function C({request:r}){if(await c(),!u(r))return new Response(JSON.stringify({success:!1,error:"Unauthorized"}),{status:401,headers:{"Content-Type":"application/json"}});try{const n=await r.json(),{action:e,file:t}=n;if(e==="create"||e==="update"){const i=Date.now();return await a(`
                INSERT INTO admin_files (id, type, name, basename, ext, parent, icon, storage_type, url, size, children, date_created, date_modified, sort_option, sort_order, starting_point, executable)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                ON CONFLICT (id) DO UPDATE SET
                    type = EXCLUDED.type,
                    name = EXCLUDED.name,
                    basename = EXCLUDED.basename,
                    ext = EXCLUDED.ext,
                    parent = EXCLUDED.parent,
                    icon = EXCLUDED.icon,
                    storage_type = EXCLUDED.storage_type,
                    url = EXCLUDED.url,
                    size = EXCLUDED.size,
                    children = EXCLUDED.children,
                    date_modified = EXCLUDED.date_modified,
                    sort_option = EXCLUDED.sort_option,
                    sort_order = EXCLUDED.sort_order,
                    starting_point = EXCLUDED.starting_point,
                    executable = EXCLUDED.executable
            `,[t.id,t.type,t.name,t.basename,t.ext||"",t.parent,t.icon||null,t.storage_type||"admin",t.url||null,t.size||0,JSON.stringify(t.children||[]),t.date_created||i,i,t.sort_option||0,t.sort_order||0,t.starting_point||!1,t.executable||!1]),new Response(JSON.stringify({success:!0}),{status:200,headers:{"Content-Type":"application/json"}})}return e==="delete"?(await a("DELETE FROM admin_files WHERE id = $1",[t.id]),new Response(JSON.stringify({success:!0}),{status:200,headers:{"Content-Type":"application/json"}})):e==="update_children"?(await a("UPDATE admin_files SET children = $1, date_modified = $2 WHERE id = $3",[JSON.stringify(t.children),Date.now(),t.id]),new Response(JSON.stringify({success:!0}),{status:200,headers:{"Content-Type":"application/json"}})):new Response(JSON.stringify({success:!1,error:"Invalid action"}),{status:400,headers:{"Content-Type":"application/json"}})}catch(n){return console.error("Error managing admin file:",n),new Response(JSON.stringify({success:!1,error:n.message}),{status:500,headers:{"Content-Type":"application/json"}})}}export{g as GET,C as POST};
