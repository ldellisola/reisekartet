import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
// https://vitejs.dev/config/
// @ts-ignore
export default () => {
  return defineConfig({
    optimizeDeps: {
      exclude: ['oh-vue-icons/icons']
    },
    base: '',
    plugins: [
      vue(),
      vuetify({
        autoImport: true
      }),
      ReactivityTransform()
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
