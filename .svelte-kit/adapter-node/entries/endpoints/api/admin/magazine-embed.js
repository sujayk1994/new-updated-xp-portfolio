import{q as s,i as u}from"../../../../_app/immutable/chunks/db-aae5410a.js";import{v as p}from"../../../../_app/immutable/chunks/auth-e33c57ab.js";import"pg";import"bcrypt";import"jsonwebtoken";import"crypto";async function i(){await u(),await s(`
        CREATE TABLE IF NOT EXISTS site_settings (
            key TEXT PRIMARY KEY,
            value TEXT,
            updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
        )
    `)}function l(e){const t=e.headers.get("cookie")||"";if(!t.trim())return null;const a=Object.fromEntries(t.split(";").map(n=>n.trim()).filter(n=>n.length>0&&n.includes("=")).map(n=>{const[o,...c]=n.split("=");return[o.trim(),c.join("=")]})).admin_token;return a?p(a):null}async function g(){try{await i();const e=await s("SELECT value FROM site_settings WHERE key = 'magazine_embed_url'"),t=e.rows.length>0?e.rows[0].value:"";return new Response(JSON.stringify({success:!0,embedUrl:t}),{headers:{"Content-Type":"application/json"}})}catch(e){return console.error("Error fetching magazine embed URL:",e),new Response(JSON.stringify({success:!1,error:e.message}),{status:500,headers:{"Content-Type":"application/json"}})}}async function O({request:e}){try{if(!l(e))return new Response(JSON.stringify({success:!1,error:"Unauthorized"}),{status:401,headers:{"Content-Type":"application/json"}});await i();const{embedUrl:r}=await e.json();return await s(`
            INSERT INTO site_settings (key, value, updated_at)
            VALUES ('magazine_embed_url', $1, $2)
            ON CONFLICT (key) DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = EXCLUDED.updated_at
        `,[r||"",Date.now()]),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json"}})}catch(t){return console.error("Error saving magazine embed URL:",t),new Response(JSON.stringify({success:!1,error:t.message}),{status:500,headers:{"Content-Type":"application/json"}})}}export{g as GET,O as POST};
