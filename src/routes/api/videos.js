import { query } from '$lib/server/db.js';
import { initializeDatabase } from '$lib/server/db.js';

let dbInitialized = false;

async function ensureDb() {
    if (!dbInitialized) {
        await initializeDatabase();
        dbInitialized = true;
    }
}

export async function GET({ url }) {
    await ensureDb();
    
    try {
        const videoId = url.searchParams.get('id');
        
        if (videoId) {
            const result = await query(
                'SELECT * FROM admin_videos WHERE id = $1 AND is_public = TRUE',
                [videoId]
            );
            
            if (result.rows.length === 0) {
                return new Response(JSON.stringify({ error: 'Video not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            const video = result.rows[0];
            return new Response(JSON.stringify({
                success: true,
                video: formatVideo(video)
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const result = await query(
            'SELECT * FROM admin_videos WHERE is_public = TRUE ORDER BY display_order ASC, created_at DESC'
        );
        
        const videos = result.rows.map(formatVideo);
        
        return new Response(JSON.stringify({
            success: true,
            videos
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

function formatVideo(row) {
    return {
        id: row.id.toString(),
        title: row.title,
        youtubeId: row.youtube_id,
        channel: row.channel,
        description: row.description || '',
        duration: row.duration,
        views: row.views,
        thumbnail: row.thumbnail_url || `https://img.youtube.com/vi/${row.youtube_id}/maxresdefault.jpg`,
        youtubeUrl: `https://www.youtube.com/embed/${row.youtube_id}`,
        time: getTimeAgo(row.created_at),
        createdAt: row.created_at
    };
}

function getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}
