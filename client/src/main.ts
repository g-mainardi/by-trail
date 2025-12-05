import App from '@/App.vue'
import Hero from '@/pages/hero/Hero.vue'
import Login from '@/pages/login/Login.vue'
import Signup from '@/pages/register/Signup.vue'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import './style.css'

const i18n = createI18n({
  legacy: false,
  locale: 'it',
  fallbackLocale: 'en'
})

const routes = [
  { path: '/', component: Hero },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
const pinia = createPinia()

// Install plugins
app.use(router)
app.use(pinia) 
app.use(i18n)

app.mount('#app')
