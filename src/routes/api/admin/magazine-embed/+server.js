import { initializeDatabase, query } from '$lib/server/db.js';
import { verifyToken } from '$lib/server/auth.js';

async function ensureDb() {
    await initializeDatabase();
    
    await query(`
        CREATE TABLE IF NOT EXISTS site_settings (
            key TEXT PRIMARY KEY,
            value TEXT,
            updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
        )
    `);
}

function isAuthenticated(request) {
    const cookieHeader = request.headers.get('cookie') || '';
    if (!cookieHeader.trim()) return null;
    
    const cookies = Object.fromEntries(
        cookieHeader.split(';')
            .map(c => c.trim())
            .filter(c => c.length > 0 && c.includes('='))
            .map(c => {
                const [key, ...val] = c.split('=');
                return [key.trim(), val.join('=')];
            })
    );
    
    const token = cookies.admin_token;
    if (!token) return null;
    
    return verifyToken(token);
}

export async function GET() {
    try {
        await ensureDb();
        
        const result = await query("SELECT value FROM site_settings WHERE key = 'magazine_embed_url'");
        
        const embedUrl = result.rows.length > 0 ? result.rows[0].value : '';
        
        return new Response(JSON.stringify({ success: true, embedUrl }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching magazine embed URL:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function POST({ request }) {
    try {
        const admin = isAuthenticated(request);
        if (!admin) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        await ensureDb();
        
        const { embedUrl } = await request.json();
        
        await query(`
            INSERT INTO site_settings (key, value, updated_at)
            VALUES ('magazine_embed_url', $1, $2)
            ON CONFLICT (key) DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = EXCLUDED.updated_at
        `, [embedUrl || '', Date.now()]);
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error saving magazine embed URL:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
