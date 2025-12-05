import { verifyToken } from '$lib/server/auth.js';
import { query, initializeDatabase } from '$lib/server/db.js';

let dbInitialized = false;

async function ensureDb() {
    if (!dbInitialized) {
        await initializeDatabase();
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

export async function GET({ request }) {
    await ensureDb();
    
    try {
        const result = await query(
            'SELECT * FROM boot_screen_settings ORDER BY id DESC LIMIT 1'
        );
        
        if (result.rows.length > 0) {
            const settings = result.rows[0];
            return new Response(JSON.stringify({
                success: true,
                settings: {
                    type: settings.type,
                    customGif: settings.custom_gif,
                    showLogo: settings.show_logo,
                    showProgress: settings.show_progress,
                    showCopyright: settings.show_copyright,
                    backgroundColor: settings.background_color
                }
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify({
            success: true,
            settings: {
                type: 'default',
                customGif: null,
                showLogo: true,
                showProgress: true,
                showCopyright: true,
                backgroundColor: '#000000'
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching boot screen settings:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to fetch boot screen settings',
            settings: {
                type: 'default',
                customGif: null,
                showLogo: true,
                showProgress: true,
                showCopyright: true,
                backgroundColor: '#000000'
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function POST({ request }) {
    await ensureDb();
    
    const admin = getAdminFromRequest(request);
    if (!admin) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const body = await request.json();
        const { settings } = body;
        
        if (!settings) {
            return new Response(JSON.stringify({ success: false, error: 'Settings required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (settings.customGif) {
            const maxSizeBytes = 5 * 1024 * 1024;
            const base64Size = settings.customGif.length * 0.75;
            if (base64Size > maxSizeBytes) {
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: 'Image too large. Maximum size is 5MB.' 
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
        
        const existingResult = await query(
            'SELECT id FROM boot_screen_settings ORDER BY id DESC LIMIT 1'
        );
        
        if (existingResult.rows.length > 0) {
            await query(
                `UPDATE boot_screen_settings 
                 SET type = $1, custom_gif = $2, show_logo = $3, show_progress = $4, 
                     show_copyright = $5, background_color = $6, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $7`,
                [
                    settings.type || 'default',
                    settings.customGif || null,
                    settings.showLogo !== false,
                    settings.showProgress !== false,
                    settings.showCopyright !== false,
                    settings.backgroundColor || '#000000',
                    existingResult.rows[0].id
                ]
            );
        } else {
            await query(
                `INSERT INTO boot_screen_settings (type, custom_gif, show_logo, show_progress, show_copyright, background_color)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    settings.type || 'default',
                    settings.customGif || null,
                    settings.showLogo !== false,
                    settings.showProgress !== false,
                    settings.showCopyright !== false,
                    settings.backgroundColor || '#000000'
                ]
            );
        }
        
        return new Response(JSON.stringify({ success: true, message: 'Boot screen settings saved' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error saving boot screen settings:', error);
        return new Response(JSON.stringify({ success: false, error: 'Failed to save boot screen settings' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
