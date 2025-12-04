import { verifyToken } from '$lib/server/auth.js';
import { query, initializeDatabase } from '$lib/server/db.js';
import fs from 'fs';
import path from 'path';

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
        const formData = await request.formData();
        const file = formData.get('file');
        const fileId = formData.get('fileId');
        
        if (!file || !fileId) {
            return new Response(JSON.stringify({ success: false, error: 'Missing file or fileId' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const uploadDir = 'static/uploads/admin';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const fileName = `${fileId}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const filePath = path.join(uploadDir, fileName);
        
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filePath, buffer);
        
        const url = `/uploads/admin/${fileName}`;
        
        return new Response(JSON.stringify({ 
            success: true, 
            url,
            size: Math.ceil(buffer.length / 1024)
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error uploading file:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
