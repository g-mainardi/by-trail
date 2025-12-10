import App from '@/App.vue'
import Hero from '@/pages/hero/Hero.vue'
import Login from '@/pages/login/Login.vue'
import Signup from '@/pages/register/Signup.vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import Settings from './pages/home-page/contents/settings/Settings.vue'
import HomePage from './pages/home-page/HomePage.vue'
import './style.css'

const i18n = createI18n({
  legacy: false,
  locale: 'it',
  fallbackLocale: 'en'
})

const routes = [
  { path: '/', component: Hero },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  {
    path: '/homepage',
    name: 'Homepage',
    component: HomePage,
    children: [
      {
        path: '/settings',
        name: 'Settings',
        component: Settings,
      }
    ]
  }
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
