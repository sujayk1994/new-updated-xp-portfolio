import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

/** @type {import('vite').UserConfig} */
const config = {
        plugins: [
                sveltekit(),
                // basicSsl()
        ],
        server: {
                host: '0.0.0.0',
                port: 5000,
                strictPort: true,
                allowedHosts: true
        }
};

export default config;
