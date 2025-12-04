import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Hero from './pages/hero/Hero.vue'
import Login from './pages/login/Login.vue'
import Signup from './pages/register/Signup.vue'
import HomePage from './pages/home-page/HomePage.vue'
import './style.css'

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

createApp(App).use(router).mount('#app')
