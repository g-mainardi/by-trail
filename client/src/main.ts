import '@/assets/style.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { router } from './router';

import '@fontsource/quicksand/300.css';
import '@fontsource/quicksand/400.css';
import '@fontsource/quicksand/500.css';
import '@fontsource/quicksand/600.css';
import '@fontsource/quicksand/700.css';

import App from '@/App.vue';

const savedLocale = localStorage.getItem('locale') || 'en';
const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
});

const app = createApp(App);
const pinia = createPinia();

// Install plugins
app.use(router);
app.use(pinia);
app.use(i18n);

app.mount('#app');
