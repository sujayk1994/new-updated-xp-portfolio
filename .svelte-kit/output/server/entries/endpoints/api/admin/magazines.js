import{q as i,i as u}from"../../../../_app/immutable/chunks/db-aae5410a.js";import{v as l}from"../../../../_app/immutable/chunks/auth-e33c57ab.js";import"pg";import"bcrypt";import"jsonwebtoken";import"crypto";async function a(){await u(),await i(`
        CREATE TABLE IF NOT EXISTS magazines (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            cover_url TEXT,
            pages TEXT,
            embed_url TEXT,
            created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
        )
    `);try{await i("ALTER TABLE magazines ADD COLUMN IF NOT EXISTS embed_url TEXT")}catch{}}function o(t){const s=t.headers.get("cookie")||"";if(!s.trim())return null;const n=Object.fromEntries(s.split(";").map(r=>r.trim()).filter(r=>r.length>0&&r.includes("=")).map(r=>{const[c,...p]=r.split("=");return[c.trim(),p.join("=")]})).admin_token;return n?l(n):null}async function y(){try{await a();const s=(await i("SELECT * FROM magazines ORDER BY created_at DESC")).rows.map(e=>({id:e.id,title:e.title,description:e.description,coverUrl:e.cover_url,embedUrl:e.embed_url||"",pages:e.pages?JSON.parse(e.pages):[],createdAt:parseInt(e.created_at)}));return new Response(JSON.stringify({success:!0,magazines:s}),{headers:{"Content-Type":"application/json"}})}catch(t){return console.error("Error fetching magazines:",t),new Response(JSON.stringify({success:!1,error:t.message}),{status:500,headers:{"Content-Type":"application/json"}})}}async function O({request:t}){try{if(!o(t))return new Response(JSON.stringify({success:!1,error:"Unauthorized"}),{status:401,headers:{"Content-Type":"application/json"}});await a();const{magazine:e}=await t.json();if(!e||!e.title)return new Response(JSON.stringify({success:!1,error:"Title is required"}),{status:400,headers:{"Content-Type":"application/json"}});const n=e.id.startsWith("new_")?"mag_"+Date.now():e.id,r=JSON.stringify(e.pages||[]);return await i(`
            INSERT INTO magazines (id, title, description, cover_url, pages, embed_url, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                cover_url = EXCLUDED.cover_url,
                pages = EXCLUDED.pages,
                embed_url = EXCLUDED.embed_url
        `,[n,e.title,e.description||"",e.coverUrl||"",r,e.embedUrl||"",e.createdAt||Date.now()]),new Response(JSON.stringify({success:!0,id:n}),{headers:{"Content-Type":"application/json"}})}catch(s){return console.error("Error saving magazine:",s),new Response(JSON.stringify({success:!1,error:s.message}),{status:500,headers:{"Content-Type":"application/json"}})}}async function D({request:t}){try{if(!o(t))return new Response(JSON.stringify({success:!1,error:"Unauthorized"}),{status:401,headers:{"Content-Type":"application/json"}});await a();const{id:e}=await t.json();return e?(await i("DELETE FROM magazines WHERE id = $1",[e]),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json"}})):new Response(JSON.stringify({success:!1,error:"ID is required"}),{status:400,headers:{"Content-Type":"application/json"}})}catch(s){return console.error("Error deleting magazine:",s),new Response(JSON.stringify({success:!1,error:s.message}),{status:500,headers:{"Content-Type":"application/json"}})}}export{D as DELETE,y as GET,O as POST};
