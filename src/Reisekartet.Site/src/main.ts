import { createApp } from 'vue'

import App from './App.vue'

import {registerPlugins} from "@/plugins";

const app = createApp(App)

await registerPlugins(app);

app.mount('#app')
