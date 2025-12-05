import { query, initializeDatabase } from '$lib/server/db.js';
import { sendContactNotification } from '$lib/server/resend.js';

let dbInitialized = false;

async function ensureDb() {
    if (!dbInitialized) {
        await initializeDatabase();
        
        await query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id SERIAL PRIMARY KEY,
                to_email VARCHAR(255) NOT NULL,
                from_email VARCHAR(255) NOT NULL,
                subject VARCHAR(500) NOT NULL,
                body TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                read BOOLEAN DEFAULT FALSE,
                email_sent BOOLEAN DEFAULT FALSE
            )
        `);
        
        dbInitialized = true;
    }
}

export async function POST({ request }) {
    await ensureDb();
    
    try {
        const data = await request.json();
        const { to, from, subject, body } = data;
        
        if (!from || !from.trim()) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'From email is required' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (!subject || !subject.trim()) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Subject is required' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (!body || !body.trim()) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Message body is required' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(from)) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Please enter a valid email address' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const toEmail = to || 'owner@example.com';
        
        await query(
            `INSERT INTO contact_messages (to_email, from_email, subject, body) 
             VALUES ($1, $2, $3, $4)`,
            [toEmail, from.trim(), subject.trim(), body.trim()]
        );
        
        let emailSent = false;
        try {
            const emailResult = await sendContactNotification({
                toEmail: toEmail,
                fromEmail: from.trim(),
                subject: subject.trim(),
                body: body.trim()
            });
            emailSent = emailResult.success;
            if (!emailResult.success) {
                console.error('Email notification failed:', emailResult.error);
            }
        } catch (emailError) {
            console.error('Error sending email notification:', emailError);
        }
        
        return new Response(JSON.stringify({ 
            success: true, 
            message: 'Message sent successfully',
            emailNotification: emailSent
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error saving contact message:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to send message. Please try again.' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function GET({ request }) {
    await ensureDb();
    
    try {
        const result = await query(
            'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 50'
        );
        
        return new Response(JSON.stringify({ 
            success: true, 
            messages: result.rows 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
