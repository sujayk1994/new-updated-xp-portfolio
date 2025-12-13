import { Resend } from 'resend';

let connectionSettings = null;

async function getCredentials() {
    if (process.env.RESEND_API_KEY) {
        return {
            apiKey: process.env.RESEND_API_KEY,
            fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@example.com'
        };
    }

    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    if (!hostname) {
        throw new Error('Resend not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL environment variables.');
    }

    const xReplitToken = process.env.REPL_IDENTITY 
        ? 'repl ' + process.env.REPL_IDENTITY 
        : process.env.WEB_REPL_RENEWAL 
        ? 'depl ' + process.env.WEB_REPL_RENEWAL 
        : null;

    if (!xReplitToken) {
        throw new Error('X_REPLIT_TOKEN not found for repl/depl');
    }

    connectionSettings = await fetch(
        'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
        {
            headers: {
                'Accept': 'application/json',
                'X_REPLIT_TOKEN': xReplitToken
            }
        }
    ).then(res => res.json()).then(data => data.items?.[0]);

    if (!connectionSettings || (!connectionSettings.settings.api_key)) {
        throw new Error('Resend not connected');
    }
    return {
        apiKey: connectionSettings.settings.api_key, 
        fromEmail: connectionSettings.settings.from_email
    };
}

export async function getResendClient() {
    const credentials = await getCredentials();
    return {
        client: new Resend(credentials.apiKey),
        fromEmail: credentials.fromEmail
    };
}

export async function sendContactNotification({ toEmail, fromEmail, subject, body }) {
    try {
        const { client, fromEmail: senderEmail } = await getResendClient();
        
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
                    New Contact Form Submission
                </h2>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>From:</strong> ${fromEmail}</p>
                    <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
                </div>
                <div style="padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 5px;">
                    <h3 style="color: #555; margin-top: 0;">Message:</h3>
                    <p style="white-space: pre-wrap; line-height: 1.6;">${body}</p>
                </div>
                <p style="color: #888; font-size: 12px; margin-top: 20px;">
                    This email was sent from your Windows XP Portfolio contact form.
                </p>
            </div>
        `;

        const result = await client.emails.send({
            from: senderEmail,
            to: toEmail,
            subject: `Contact Form: ${subject}`,
            html: emailHtml,
            replyTo: fromEmail
        });

        return { success: true, data: result };
    } catch (error) {
        console.error('Error sending email via Resend:', error);
        return { success: false, error: error.message };
    }
}

export function isResendConfigured() {
    return !!(process.env.RESEND_API_KEY || process.env.REPLIT_CONNECTORS_HOSTNAME);
}
