import vuetify from '@/plugins/vuetify'
import { pinia } from '@/plugins/pinia'
import router from '@/plugins/router'
import { loadFonts } from '@/plugins/webfontloader'
import type { App } from 'vue'

export async function registerPlugins(app: App) {
  await loadFonts()
  app.use(pinia)
  app.use(router)
  app.use(vuetify)
}
