import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import '@/assets/style.css'

import App from '@/App.vue'
import MainLayout from '@/layouts/MainLayout.vue'
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
    component: MainLayout, // All the children routes will use this layout
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


// Navigation guard to protect routes that require authentication
const isAuthenticated = (): boolean => { return !!localStorage.getItem('token')};

// Apply the navigation guard
router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated()) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

const app = createApp(App)
const pinia = createPinia()

// Install plugins
app.use(router)
app.use(pinia) 
app.use(i18n)

app.mount('#app')
