import { createAdmin, verifyAdmin, generateToken, adminExists } from '$lib/server/auth.js';
import { initializeDatabase } from '$lib/server/db.js';

let dbInitialized = false;

async function ensureDb() {
    if (!dbInitialized) {
        await initializeDatabase();
        dbInitialized = true;
    }
}

export async function POST({ request }) {
    await ensureDb();
    
    const body = await request.json();
    const { action, username, password } = body;
    
    if (action === 'login') {
        const admin = await verifyAdmin(username, password);
        if (!admin) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid credentials' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const token = generateToken(admin);
        return new Response(JSON.stringify({ success: true, token, admin: { username: admin.username } }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`
            }
        });
    }
    
    if (action === 'register') {
        const exists = await adminExists();
        if (exists) {
            return new Response(JSON.stringify({ success: false, error: 'Admin already exists' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const result = await createAdmin(username, password);
        if (!result.success) {
            return new Response(JSON.stringify({ success: false, error: result.error }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const admin = await verifyAdmin(username, password);
        const token = generateToken(admin);
        
        return new Response(JSON.stringify({ success: true, token, admin: { username: admin.username } }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`
            }
        });
    }
    
    if (action === 'logout') {
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': 'admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
            }
        });
    }
    
    return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
    });
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
    
    const exists = await adminExists();
    
    return new Response(JSON.stringify({ 
        adminExists: exists,
        hasToken: !!cookies.admin_token 
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
