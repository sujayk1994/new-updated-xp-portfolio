export const handle = async ({ event, resolve }) => {
    const response = await resolve(event, {
      ssr: false
    });
    
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
};