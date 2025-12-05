import { verifyToken } from '$lib/server/auth.js';
import { query, initializeDatabase } from '$lib/server/db.js';

let dbInitialized = false;

async function ensureDb() {
    if (!dbInitialized) {
        await initializeDatabase();
        
        await query(`
            CREATE TABLE IF NOT EXISTS about_me_content (
                id SERIAL PRIMARY KEY,
                content JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        dbInitialized = true;
    }
}

function getAdminFromRequest(request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split(';').map(c => {
            const [key, ...val] = c.trim().split('=');
            return [key, val.join('=')];
        })
    );
    
    const token = cookies.admin_token;
    if (!token) return null;
    
    return verifyToken(token);
}

export async function GET() {
    await ensureDb();
    
    try {
        const result = await query('SELECT content FROM about_me_content ORDER BY id DESC LIMIT 1');
        
        if (result.rows.length > 0) {
            return new Response(JSON.stringify({ 
                success: true, 
                content: result.rows[0].content 
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify({ 
            success: true, 
            content: null 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching about me content:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function POST({ request }) {
    await ensureDb();
    
    const admin = getAdminFromRequest(request);
    if (!admin) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: 'Unauthorized - Admin access required' 
        }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const body = await request.json();
        const { content } = body;
        
        if (!content) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Content is required' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const existingResult = await query('SELECT id FROM about_me_content LIMIT 1');
        
        if (existingResult.rows.length > 0) {
            await query(
                'UPDATE about_me_content SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [content, existingResult.rows[0].id]
            );
        } else {
            await query(
                'INSERT INTO about_me_content (content) VALUES ($1)',
                [content]
            );
        }
        
        return new Response(JSON.stringify({ 
            success: true, 
            message: 'About Me content saved successfully' 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error saving about me content:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
