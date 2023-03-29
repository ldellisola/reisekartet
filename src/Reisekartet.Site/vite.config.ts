import {fileURLToPath, URL} from 'url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from "vite-plugin-vuetify";


// https://vitejs.dev/config/
// @ts-ignore
export default ({mode}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
    const target = process.env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${process.env.ASPNETCORE_HTTPS_PORT}` :
        process.env.ASPNETCORE_URLS ? process.env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7288';
    return defineConfig({
        plugins: [
            vue(),
            vuetify({
                autoImport: true,
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
                '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
                '@store': fileURLToPath(new URL('./src/stores', import.meta.url)),
            }
        },
        server: {
            port: process.env.VITE_PORT ? Number.parseInt(process.env.VITE_PORT) : 3000,
            strictPort: true,
            https: {
                key: process.env.VITE_SSL_KEY_FILE,
                cert: process.env.VITE_SSL_CRT_FILE
            },
            proxy: {
                '/api': {
                    target: target,
                    secure: false,
                    headers: {
                        Connection: 'Keep-Alive'
                    },
                    ws: true,
                    configure: (proxy) => {
                        proxy.on('error', (err) => {
                            console.error(`${err.message}`);
                        });
                    }
                }
            }
        }
    })
}
