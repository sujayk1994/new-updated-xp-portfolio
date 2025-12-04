import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { query } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const SALT_ROUNDS = 10;

if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET not set in environment. Using randomly generated secret. Sessions will be invalidated on server restart.');
}

export async function createAdmin(username, password) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    try {
        await query(
            'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
            [username, passwordHash]
        );
        return { success: true };
    } catch (error) {
        if (error.code === '23505') {
            return { success: false, error: 'Admin already exists' };
        }
        throw error;
    }
}

export async function verifyAdmin(username, password) {
    const result = await query(
        'SELECT * FROM admin_users WHERE username = $1',
        [username]
    );
    
    if (result.rows.length === 0) {
        return null;
    }
    
    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    
    if (!valid) {
        return null;
    }
    
    return {
        id: admin.id,
        username: admin.username
    };
}

export function generateToken(admin) {
    return jwt.sign(
        { id: admin.id, username: admin.username },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

export async function adminExists() {
    const result = await query('SELECT COUNT(*) as count FROM admin_users');
    return parseInt(result.rows[0].count) > 0;
}
