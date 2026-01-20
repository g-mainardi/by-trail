import MainLayout from '@/layouts/MainLayout.vue';
import Activities from '@/pages/activities/Activities.vue';
import Login from '@/pages/login/Login.vue';
import Maps from '@/pages/maps/Maps.vue';
import Profile from '@/pages/profile/Profile.vue';
import Notification from '@/pages/notifications/Notification.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Admin from './pages/admin/Admin.vue';
import Bivouac from './pages/bivouac/Bivouac.vue';
import Bivouacs from './pages/bivouacs/Bivouacs.vue';
import Route from './pages/route/Route.vue';
import Routes from './pages/routes/Routes.vue';
import Settings from './pages/settings/Settings.vue';
import Signup from './pages/signup/Signup.vue';
import { i18n } from '@/i18n';

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
        meta: { titleKey: 'maps' },
      },
      {
        path: 'routes',
        name: 'Routes',
        component: Routes,
        meta: { titleKey: 'routes' },
      },
      {
        path: 'bivouacs',
        name: 'Bivouacs',
        component: Bivouacs,
        meta: { titleKey: 'bivouacs' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: { titleKey: 'profile' },
      },
      {
        path: 'activities',
        name: 'Activities',
        component: Activities,
        meta: { titleKey: 'activities' },
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notification,
        meta: { titleKey: 'notifications' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        meta: { titleKey: 'settings' },
      },
      {
        path: 'admin',
        name: 'Admin',
        component: Admin,
        meta: { titleKey: 'admin' },
      },
      {
        path: 'bivouac/:id',
        name: 'Bivouac',
        component: Bivouac,
        props: true,
        meta: { titleKey: 'bivouacs' },
      },
      {
        path: 'route/:id',
        name: 'Route',
        component: Route,
        props: true,
        meta: { titleKey: 'routes' },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { titleKey: 'login' },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { titleKey: 'signup' },
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

// Apply the navigation guard and translations
router.beforeEach((to, _from, next) => {
  // Handle Title Translation
  const titleKey = to.meta.titleKey as string;
  if (titleKey) {
    // Access the global translation function
    document.title = `${i18n.global.t(titleKey)} | By Trail`;
  } else {
    document.title = 'By Trail';
  }

  // Handle Auth
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated()
  ) {
    next({ name: 'Login' });
  } else {
    next();
  }
});
