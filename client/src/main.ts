import App from '@/App.vue'
import Hero from '@/pages/hero/Hero.vue'
import Login from '@/pages/login/Login.vue'
import Signup from '@/pages/register/Signup.vue'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
<<<<<<< HEAD
import App from './App.vue'
import Hero from './pages/hero/Hero.vue'
import Login from './pages/login/Login.vue'
import Signup from './pages/register/Signup.vue'
import HomePage from './pages/home-page/HomePage.vue'
=======
>>>>>>> 6985da746fa010d174056980a0ae8813d9b96f34
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
  { path: '/homepage', component: HomePage}
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).use(i18n).mount('#app')
