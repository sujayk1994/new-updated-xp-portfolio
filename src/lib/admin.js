import { writable, get } from 'svelte/store';
import { hardDrive } from './store';

export const isAdmin = writable(false);
export const adminUser = writable(null);
export const adminLoading = writable(false);
export const showAdminLogin = writable(false);

export async function checkAdminStatus() {
    try {
        const response = await fetch('/api/admin/verify');
        const data = await response.json();
        
        if (data.authenticated) {
            isAdmin.set(true);
            adminUser.set(data.admin);
        } else {
            isAdmin.set(false);
            adminUser.set(null);
        }
        
        return data.authenticated;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

export async function adminLogin(username, password) {
    adminLoading.set(true);
    try {
        const response = await fetch('/api/admin/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            isAdmin.set(true);
            adminUser.set(data.admin);
            showAdminLogin.set(false);
            return { success: true };
        }
        
        return { success: false, error: data.error || 'Login failed' };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Connection error' };
    } finally {
        adminLoading.set(false);
    }
}

export async function adminRegister(username, password) {
    adminLoading.set(true);
    try {
        const response = await fetch('/api/admin/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'register', username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            isAdmin.set(true);
            adminUser.set(data.admin);
            showAdminLogin.set(false);
            return { success: true };
        }
        
        return { success: false, error: data.error || 'Registration failed' };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: 'Connection error' };
    } finally {
        adminLoading.set(false);
    }
}

export async function adminLogout() {
    try {
        await fetch('/api/admin/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'logout' })
        });
        
        isAdmin.set(false);
        adminUser.set(null);
        
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

export async function checkAdminExists() {
    try {
        const response = await fetch('/api/admin/auth');
        const data = await response.json();
        return data.adminExists;
    } catch (error) {
        console.error('Error checking admin exists:', error);
        return false;
    }
}

export async function loadAdminFiles() {
    try {
        const response = await fetch('/api/admin/files');
        const data = await response.json();
        
        if (data.success && data.files) {
            return data.files;
        }
        
        return {};
    } catch (error) {
        console.error('Error loading admin files:', error);
        return {};
    }
}

export async function saveAdminFile(file) {
    if (!get(isAdmin)) return { success: false, error: 'Not authenticated' };
    
    try {
        const response = await fetch('/api/admin/files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create', file })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error saving admin file:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteAdminFile(fileId) {
    if (!get(isAdmin)) return { success: false, error: 'Not authenticated' };
    
    try {
        const response = await fetch('/api/admin/files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', file: { id: fileId } })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting admin file:', error);
        return { success: false, error: error.message };
    }
}

export async function updateAdminChildren(fileId, children) {
    if (!get(isAdmin)) return { success: false, error: 'Not authenticated' };
    
    try {
        const response = await fetch('/api/admin/files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                action: 'update_children', 
                file: { id: fileId, children } 
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error updating admin children:', error);
        return { success: false, error: error.message };
    }
}

export async function uploadAdminFile(file, fileId) {
    if (!get(isAdmin)) return { success: false, error: 'Not authenticated' };
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileId', fileId);
        
        const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error uploading admin file:', error);
        return { success: false, error: error.message };
    }
}

export async function updateAdminFile(file) {
    if (!get(isAdmin)) return { success: false, error: 'Not authenticated' };
    
    try {
        const response = await fetch('/api/admin/files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update', file })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error updating admin file:', error);
        return { success: false, error: error.message };
    }
}
