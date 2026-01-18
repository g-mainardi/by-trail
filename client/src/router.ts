import MainLayout from '@/layouts/MainLayout.vue';
import Activities from '@/pages/activities/Activities.vue';
import Login from '@/pages/login/Login.vue';
import Maps from '@/pages/maps/Maps.vue';
import Profile from '@/pages/profile/Profile.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Admin from './pages/admin/Admin.vue';
import Bivouac from './pages/bivouac/Bivouac.vue';
import Bivouacs from './pages/bivouacs/Bivouacs.vue';
import Route from './pages/route/Route.vue';
import Routes from './pages/routes/Routes.vue';
import Settings from './pages/settings/Settings.vue';
import Signup from './pages/signup/Signup.vue';

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
        path: 'routes',
        name: 'Routes',
        component: Routes,
      },
      {
        path: 'bivouacs',
        name: 'Bivouacs',
        component: Bivouacs,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
      },
      {
        path: 'activities',
        name: 'Activities',
        component: Activities,
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
      {
        path: 'route/:id',
        name: 'Route',
        component: Route,
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
