import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
// @ts-ignore
export default ({ mode }) => {
  return defineConfig({
    esbuild: {
      supported: {
        'top-level-await': true
      }
    },
    plugins: [
      vue(),
      vuetify({
        autoImport: true
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@store': fileURLToPath(new URL('./src/stores', import.meta.url))
      }
    },
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          secure: false,
          headers: {
            Connection: 'Keep-Alive'
          },
          ws: true,
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.error(`${err.message}`)
            })
          }
        }
      }
    }
  })
}
