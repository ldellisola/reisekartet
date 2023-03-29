import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import {createVuetify} from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import {md2, md3} from "vuetify/blueprints";

export default createVuetify({
    // blueprint: md2,
    components,
    directives,
    theme: {
        themes: {
            light: {
                colors: {
                    primary: '#3f51b5',
                    secondary: '#b0bec5',
                    accent: '#8c9eff',
                    error: '#b71c1c',
                },
            },
        },
    }
});
