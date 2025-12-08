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
        },
        build: {
                target: 'esnext',
                minify: 'esbuild',
                cssMinify: true,
                rollupOptions: {
                        output: {
                                manualChunks: {
                                        'vendor': ['svelte', 'axios', 'lodash'],
                                        'idb': ['idb-keyval']
                                }
                        }
                }
        },
        optimizeDeps: {
                include: ['svelte', 'axios', 'idb-keyval', 'lodash']
        }
};

export default config;
