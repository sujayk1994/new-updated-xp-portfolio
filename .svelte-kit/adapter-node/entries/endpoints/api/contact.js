import{q as l,i as f}from"../../../_app/immutable/chunks/db-aae5410a.js";import{Resend as E}from"resend";import"pg";let i=null;async function g(){const s=process.env.REPLIT_CONNECTORS_HOSTNAME,e=process.env.REPL_IDENTITY?"repl "+process.env.REPL_IDENTITY:process.env.WEB_REPL_RENEWAL?"depl "+process.env.WEB_REPL_RENEWAL:null;if(!e)throw new Error("X_REPLIT_TOKEN not found for repl/depl");if(i=await fetch("https://"+s+"/api/v2/connection?include_secrets=true&connector_names=resend",{headers:{Accept:"application/json",X_REPLIT_TOKEN:e}}).then(r=>r.json()).then(r=>r.items?.[0]),!i||!i.settings.api_key)throw new Error("Resend not connected");return{apiKey:i.settings.api_key,fromEmail:i.settings.from_email}}async function y(){const s=await g();return{client:new E(s.apiKey),fromEmail:s.fromEmail}}async function T({toEmail:s,fromEmail:e,subject:r,body:n}){try{const{client:t,fromEmail:o}=await y(),p=`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
                    New Contact Form Submission
                </h2>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>From:</strong> ${e}</p>
                    <p style="margin: 5px 0;"><strong>Subject:</strong> ${r}</p>
                </div>
                <div style="padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 5px;">
                    <h3 style="color: #555; margin-top: 0;">Message:</h3>
                    <p style="white-space: pre-wrap; line-height: 1.6;">${n}</p>
                </div>
                <p style="color: #888; font-size: 12px; margin-top: 20px;">
                    This email was sent from your Windows XP Portfolio contact form.
                </p>
            </div>
        `,c=await t.emails.send({from:o,to:s,subject:`Contact Form: ${r}`,html:p,replyTo:e});return{success:!0,data:c}}catch(t){return console.error("Error sending email via Resend:",t),{success:!1,error:t.message}}}let d=!1;async function u(){d||(await f(),await l(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id SERIAL PRIMARY KEY,
                to_email VARCHAR(255) NOT NULL,
                from_email VARCHAR(255) NOT NULL,
                subject VARCHAR(500) NOT NULL,
                body TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                read BOOLEAN DEFAULT FALSE,
                email_sent BOOLEAN DEFAULT FALSE
            )
        `),d=!0)}async function h({request:s}){await u();try{const e=await s.json(),{to:r,from:n,subject:t,body:o}=e;if(!n||!n.trim())return new Response(JSON.stringify({success:!1,error:"From email is required"}),{status:400,headers:{"Content-Type":"application/json"}});if(!t||!t.trim())return new Response(JSON.stringify({success:!1,error:"Subject is required"}),{status:400,headers:{"Content-Type":"application/json"}});if(!o||!o.trim())return new Response(JSON.stringify({success:!1,error:"Message body is required"}),{status:400,headers:{"Content-Type":"application/json"}});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n))return new Response(JSON.stringify({success:!1,error:"Please enter a valid email address"}),{status:400,headers:{"Content-Type":"application/json"}});const c=r||"owner@example.com";await l(`INSERT INTO contact_messages (to_email, from_email, subject, body) 
             VALUES ($1, $2, $3, $4)`,[c,n.trim(),t.trim(),o.trim()]);let m=!1;try{const a=await T({toEmail:c,fromEmail:n.trim(),subject:t.trim(),body:o.trim()});m=a.success,a.success||console.error("Email notification failed:",a.error)}catch(a){console.error("Error sending email notification:",a)}return new Response(JSON.stringify({success:!0,message:"Message sent successfully",emailNotification:m}),{status:200,headers:{"Content-Type":"application/json"}})}catch(e){return console.error("Error saving contact message:",e),new Response(JSON.stringify({success:!1,error:"Failed to send message. Please try again."}),{status:500,headers:{"Content-Type":"application/json"}})}}async function L({request:s}){await u();try{const e=await l("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 50");return new Response(JSON.stringify({success:!0,messages:e.rows}),{status:200,headers:{"Content-Type":"application/json"}})}catch(e){return console.error("Error fetching contact messages:",e),new Response(JSON.stringify({success:!1,error:e.message}),{status:500,headers:{"Content-Type":"application/json"}})}}export{L as GET,h as POST};
