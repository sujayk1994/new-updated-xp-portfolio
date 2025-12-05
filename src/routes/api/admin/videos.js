import { query, initializeDatabase } from '$lib/server/db.js';
import { verifyToken } from '$lib/server/auth.js';

let dbInitialized = false;

async function ensureDb() {
    if (!dbInitialized) {
        await initializeDatabase();
        dbInitialized = true;
    }
}

function getAdminToken(request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split(';').map(c => {
            const [key, ...val] = c.trim().split('=');
            return [key, val.join('=')];
        })
    );
    return cookies.admin_token;
}

function extractYouTubeId(url) {
    if (!url) return null;
    
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    return null;
}

export async function GET({ request }) {
    await ensureDb();
    
    const token = getAdminToken(request);
    const admin = verifyToken(token);
    
    if (!admin) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const result = await query(
            'SELECT * FROM admin_videos ORDER BY display_order ASC, created_at DESC'
        );
        
        return new Response(JSON.stringify({
            success: true,
            videos: result.rows
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching videos:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch videos' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function POST({ request }) {
    await ensureDb();
    
    const token = getAdminToken(request);
    const admin = verifyToken(token);
    
    if (!admin) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const body = await request.json();
        const { title, youtubeUrl, channel, description, duration, views, thumbnailUrl, isPublic, displayOrder } = body;
        
        if (!title || !youtubeUrl) {
            return new Response(JSON.stringify({ error: 'Title and YouTube URL are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const youtubeId = extractYouTubeId(youtubeUrl);
        if (!youtubeId) {
            return new Response(JSON.stringify({ error: 'Invalid YouTube URL' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const result = await query(
            `INSERT INTO admin_videos (title, youtube_id, channel, description, duration, views, thumbnail_url, is_public, display_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [
                title,
                youtubeId,
                channel || 'Portfolio Channel',
                description || '',
                duration || '0:00',
                views || '0 views',
                thumbnailUrl || null,
                isPublic !== false,
                displayOrder || 0
            ]
        );
        
        return new Response(JSON.stringify({
            success: true,
            video: result.rows[0]
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating video:', error);
        return new Response(JSON.stringify({ error: 'Failed to create video' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function PUT({ request, url }) {
    await ensureDb();
    
    const token = getAdminToken(request);
    const admin = verifyToken(token);
    
    if (!admin) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const body = await request.json();
        const { id, title, youtubeUrl, channel, description, duration, views, thumbnailUrl, isPublic, displayOrder } = body;
        
        if (!id) {
            return new Response(JSON.stringify({ error: 'Video ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        let youtubeId = null;
        if (youtubeUrl) {
            youtubeId = extractYouTubeId(youtubeUrl);
            if (!youtubeId) {
                return new Response(JSON.stringify({ error: 'Invalid YouTube URL' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
        
        const updates = [];
        const values = [];
        let paramIndex = 1;
        
        if (title !== undefined) {
            updates.push(`title = $${paramIndex++}`);
            values.push(title);
        }
        if (youtubeId) {
            updates.push(`youtube_id = $${paramIndex++}`);
            values.push(youtubeId);
        }
        if (channel !== undefined) {
            updates.push(`channel = $${paramIndex++}`);
            values.push(channel);
        }
        if (description !== undefined) {
            updates.push(`description = $${paramIndex++}`);
            values.push(description);
        }
        if (duration !== undefined) {
            updates.push(`duration = $${paramIndex++}`);
            values.push(duration);
        }
        if (views !== undefined) {
            updates.push(`views = $${paramIndex++}`);
            values.push(views);
        }
        if (thumbnailUrl !== undefined) {
            updates.push(`thumbnail_url = $${paramIndex++}`);
            values.push(thumbnailUrl);
        }
        if (isPublic !== undefined) {
            updates.push(`is_public = $${paramIndex++}`);
            values.push(isPublic);
        }
        if (displayOrder !== undefined) {
            updates.push(`display_order = $${paramIndex++}`);
            values.push(displayOrder);
        }
        
        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);
        
        const result = await query(
            `UPDATE admin_videos SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );
        
        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Video not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify({
            success: true,
            video: result.rows[0]
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating video:', error);
        return new Response(JSON.stringify({ error: 'Failed to update video' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function DELETE({ request, url }) {
    await ensureDb();
    
    const token = getAdminToken(request);
    const admin = verifyToken(token);
    
    if (!admin) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const body = await request.json();
        const { id } = body;
        
        if (!id) {
            return new Response(JSON.stringify({ error: 'Video ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const result = await query(
            'DELETE FROM admin_videos WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Video not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Video deleted successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error deleting video:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete video' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
