import { initializeDatabase, query } from '$lib/server/db.js';
import { verifyToken } from '$lib/server/auth.js';

async function ensureDb() {
    await initializeDatabase();
    
    await query(`
        CREATE TABLE IF NOT EXISTS magazines (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            cover_url TEXT,
            pages TEXT,
            created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
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
        
        const result = await query('SELECT * FROM magazines ORDER BY created_at DESC');
        
        const magazines = result.rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            coverUrl: row.cover_url,
            pages: row.pages ? JSON.parse(row.pages) : [],
            createdAt: parseInt(row.created_at)
        }));
        
        return new Response(JSON.stringify({ success: true, magazines }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching magazines:', error);
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
        
        const { magazine } = await request.json();
        
        if (!magazine || !magazine.title) {
            return new Response(JSON.stringify({ success: false, error: 'Title is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const id = magazine.id.startsWith('new_') ? 'mag_' + Date.now() : magazine.id;
        const pagesJson = JSON.stringify(magazine.pages || []);
        
        await query(`
            INSERT INTO magazines (id, title, description, cover_url, pages, created_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                cover_url = EXCLUDED.cover_url,
                pages = EXCLUDED.pages
        `, [id, magazine.title, magazine.description || '', magazine.coverUrl || '', pagesJson, magazine.createdAt || Date.now()]);
        
        return new Response(JSON.stringify({ success: true, id }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error saving magazine:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function DELETE({ request }) {
    try {
        const admin = isAuthenticated(request);
        if (!admin) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        await ensureDb();
        
        const { id } = await request.json();
        
        if (!id) {
            return new Response(JSON.stringify({ success: false, error: 'ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        await query('DELETE FROM magazines WHERE id = $1', [id]);
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error deleting magazine:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
