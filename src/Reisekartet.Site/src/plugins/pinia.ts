import piniaPersist from 'pinia-plugin-persist'
import {createPinia} from "pinia";

export const pinia = createPinia()
    .use(piniaPersist);
