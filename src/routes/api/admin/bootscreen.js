import { query } from '../../../lib/server/db.js';
import { verifyToken } from '../../../lib/server/auth.js';

export async function get({ request }) {
    try {
        const result = await query(
            'SELECT * FROM boot_screen_settings ORDER BY id DESC LIMIT 1'
        );
        
        if (result.rows.length > 0) {
            const settings = result.rows[0];
            return {
                status: 200,
                body: {
                    success: true,
                    settings: {
                        type: settings.type,
                        customGif: settings.custom_gif,
                        showLogo: settings.show_logo,
                        showProgress: settings.show_progress,
                        showCopyright: settings.show_copyright,
                        backgroundColor: settings.background_color
                    }
                }
            };
        }
        
        return {
            status: 200,
            body: {
                success: true,
                settings: {
                    type: 'default',
                    customGif: null,
                    showLogo: true,
                    showProgress: true,
                    showCopyright: true,
                    backgroundColor: '#000000'
                }
            }
        };
    } catch (error) {
        console.error('Error fetching boot screen settings:', error);
        return {
            status: 500,
            body: { success: false, error: 'Failed to fetch boot screen settings' }
        };
    }
}

export async function post({ request, locals }) {
    try {
        const cookies = request.headers.get('cookie') || '';
        const tokenMatch = cookies.match(/admin_token=([^;]+)/);
        const token = tokenMatch ? tokenMatch[1] : null;
        
        if (!token) {
            return {
                status: 401,
                body: { success: false, error: 'Not authenticated' }
            };
        }
        
        const admin = verifyToken(token);
        if (!admin) {
            return {
                status: 401,
                body: { success: false, error: 'Invalid token' }
            };
        }
        
        const body = await request.json();
        const { settings } = body;
        
        if (!settings) {
            return {
                status: 400,
                body: { success: false, error: 'Settings required' }
            };
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
        
        return {
            status: 200,
            body: { success: true, message: 'Boot screen settings saved' }
        };
    } catch (error) {
        console.error('Error saving boot screen settings:', error);
        return {
            status: 500,
            body: { success: false, error: 'Failed to save boot screen settings' }
        };
    }
}
