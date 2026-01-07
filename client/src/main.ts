import '@/assets/style.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createRouter, createWebHistory } from 'vue-router';

import App from '@/App.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import Login from '@/pages/login/Login.vue';
import Maps from '@/pages/maps/Maps.vue';
import Profile from '@/pages/profile/Profile.vue';
import Admin from './pages/admin/Admin.vue';
import Bivouac from './pages/bivouac/Bivouac.vue';
import Bivouacs from './pages/bivouacs/Bivouacs.vue';
import Settings from './pages/settings/Settings.vue';
import Signup from './pages/signup/Signup.vue';

const savedLocale = localStorage.getItem('locale') || 'en';
const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
});

const routes = [
  {
    path: '/',
    component: MainLayout, // All the children routes will use this layout
    redirect: { name: 'Maps' },
    meta: { requiresAuth: true },
    children: [
      {
        path: 'maps',
        name: 'Maps',
        component: Maps,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
      },
      {
        path: 'bivouacs',
        name: 'Bivouacs',
        component: Bivouacs,
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
      },
      {
        path: 'admin',
        name: 'Admin',
        component: Admin,
      },
      {
        path: 'bivouac/:id',
        name: 'Bivouac',
        component: Bivouac,
        props: true,
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to protect routes that require authentication
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Apply the navigation guard
router.beforeEach((to, _from, next) => {
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated()
  ) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

const app = createApp(App);
const pinia = createPinia();

// Install plugins
app.use(router);
app.use(pinia);
app.use(i18n);

app.mount('#app');
