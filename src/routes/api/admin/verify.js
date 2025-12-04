import { verifyToken } from '$lib/server/auth.js';
import { initializeDatabase } from '$lib/server/db.js';

let dbInitialized = false;

async function ensureDb() {
    if (!dbInitialized) {
        await initializeDatabase();
        dbInitialized = true;
    }
}

export async function GET({ request }) {
    await ensureDb();
    
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split(';').map(c => {
            const [key, ...val] = c.trim().split('=');
            return [key, val.join('=')];
        })
    );
    
    const token = cookies.admin_token;
    if (!token) {
        return new Response(JSON.stringify({ authenticated: false }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    const admin = verifyToken(token);
    if (!admin) {
        return new Response(JSON.stringify({ authenticated: false }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    return new Response(JSON.stringify({ 
        authenticated: true, 
        admin: { username: admin.username } 
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
