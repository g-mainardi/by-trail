import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import '@/assets/style.css'

import App from '@/App.vue'
import Hero from '@/pages/hero/Hero.vue'
import Login from '@/pages/login/Login.vue'
import Signup from '@/pages/register/Signup.vue'
import Profile from '@/pages/profile/Profile.vue'
import HomePage from '@/pages/home-page/HomePage.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'it',
  fallbackLocale: 'en'
})

const routes = [
  {
    path: '/',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: "Hero",
        component: Hero
      },
      {
        path: 'profile', 
        name: "Profile",
        component: Profile 
      },
      {
        path: 'homepage', 
        name: "HomePage",
        component: HomePage
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  }
];

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
