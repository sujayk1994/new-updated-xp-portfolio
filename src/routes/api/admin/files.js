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
        const result = await query('SELECT * FROM admin_files ORDER BY date_created ASC');
        
        const files = {};
        for (const row of result.rows) {
            files[row.id] = {
                id: row.id,
                type: row.type,
                name: row.name,
                basename: row.basename,
                ext: row.ext,
                parent: row.parent,
                icon: row.icon,
                storage_type: row.storage_type,
                url: row.url,
                size: row.size,
                children: JSON.parse(row.children || '[]'),
                date_created: parseInt(row.date_created),
                date_modified: parseInt(row.date_modified),
                sort_option: row.sort_option,
                sort_order: row.sort_order,
                starting_point: row.starting_point,
                executable: row.executable,
                is_admin: true
            };
        }
        
        return new Response(JSON.stringify({ success: true, files }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching admin files:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
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
        const { action, file } = body;
        
        if (action === 'create' || action === 'update') {
            const now = Date.now();
            
            await query(`
                INSERT INTO admin_files (id, type, name, basename, ext, parent, icon, storage_type, url, size, children, date_created, date_modified, sort_option, sort_order, starting_point, executable)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                ON CONFLICT (id) DO UPDATE SET
                    type = EXCLUDED.type,
                    name = EXCLUDED.name,
                    basename = EXCLUDED.basename,
                    ext = EXCLUDED.ext,
                    parent = EXCLUDED.parent,
                    icon = EXCLUDED.icon,
                    storage_type = EXCLUDED.storage_type,
                    url = EXCLUDED.url,
                    size = EXCLUDED.size,
                    children = EXCLUDED.children,
                    date_modified = EXCLUDED.date_modified,
                    sort_option = EXCLUDED.sort_option,
                    sort_order = EXCLUDED.sort_order,
                    starting_point = EXCLUDED.starting_point,
                    executable = EXCLUDED.executable
            `, [
                file.id,
                file.type,
                file.name,
                file.basename,
                file.ext || '',
                file.parent,
                file.icon || null,
                file.storage_type || 'admin',
                file.url || null,
                file.size || 0,
                JSON.stringify(file.children || []),
                file.date_created || now,
                now,
                file.sort_option || 0,
                file.sort_order || 0,
                file.starting_point || false,
                file.executable || false
            ]);
            
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (action === 'delete') {
            await query('DELETE FROM admin_files WHERE id = $1', [file.id]);
            
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (action === 'update_children') {
            await query('UPDATE admin_files SET children = $1, date_modified = $2 WHERE id = $3', [
                JSON.stringify(file.children),
                Date.now(),
                file.id
            ]);
            
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error managing admin file:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
