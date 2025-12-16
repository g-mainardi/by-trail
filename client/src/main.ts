import '@/assets/style.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'

import App from '@/App.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import Login from '@/pages/login/Login.vue'
import Profile from '@/pages/profile/Profile.vue'
import Bivouacs from './pages/bivouacs/Bivouacs.vue'
import Settings from './pages/settings/Settings.vue'
import Signup from './pages/signup/Signup.vue'

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
        path: 'profile',
        name: "Profile",
        component: Profile
      },
      {
        path: 'bivouacs',
        name: "Bivouacs",
        component: Bivouacs
      },
      {
        path: 'settings',
        name: "Settings",
        component: Settings
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
const isAuthenticated = (): boolean => { return !!localStorage.getItem('token') };

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
