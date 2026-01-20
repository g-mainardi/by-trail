import '@/assets/style.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { router } from './router';

import '@fontsource/quicksand/300.css';
import '@fontsource/quicksand/400.css';
import '@fontsource/quicksand/500.css';
import '@fontsource/quicksand/600.css';
import '@fontsource/quicksand/700.css';

import App from '@/App.vue';
import { i18n } from '@/i18n';

const app = createApp(App);
const pinia = createPinia();

// Install plugins
app.use(router);
app.use(pinia);
app.use(i18n);

app.mount('#app');
