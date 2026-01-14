<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import AppInfo from '@/pages/sidebar/AppInfo.vue';
import SidebarOptions from '@/pages/sidebar/SidebarOptions.vue';
import SidebarUser from '@/pages/sidebar/SidebarUser.vue';
import { useAuthStore } from '@/stores/auth.ts';
import {
  Activity,
  Bell,
  LogOutIcon,
  Map,
  MountainSnow,
  Route,
  Settings,
  ShieldUser,
  TentTree,
  UserRound,
} from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
});

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};

const isAdmin = computed(() => authStore.user?.type === 'admin');

// This is sample data.
const data = computed(() => ({
  appInfo: [
    {
      name: 'By Trail',
      logo: MountainSnow,
      slogan: 'You are what you discover',
    },
  ],
  sidebarOptions: [
    {
      title: t('maps'),
      url: '/maps',
      icon: Map,
    },
    {
      title: t('routes'),
      url: '#',
      icon: Route,
    },
    {
      title: t('bivouacs'),
      url: '/bivouacs',
      icon: TentTree,
    },
    {
      title: t('profile'),
      url: '/profile',
      icon: UserRound,
    },
    {
      title: t('activities'),
      url: '/activities',
      icon: Activity,
    },
    {
      title: t('notifications'),
      url: '#',
      icon: Bell,
    },
    {
      title: t('settings'),
      url: '/settings',
      icon: Settings,
    },
    {
      title: t('admin'),
      url: '/admin',
      icon: ShieldUser,
      condition: isAdmin.value,
    },
    {
      title: t('logout'),
      url: '#',
      icon: LogOutIcon,
      color: 'text-red-500',
      action: handleLogout,
    },
  ],
}));
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <AppInfo :appInfo="data.appInfo" />
    </SidebarHeader>

    <SidebarContent>
      <SidebarOptions :items="data.sidebarOptions" />
    </SidebarContent>

    <SidebarFooter>
      <SidebarUser />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>

<i18n>
{
  "en": {
    "maps": "Maps",
    "routes": "Routes",
    "bivouacs": "Bivouacs & Shelters",
    "profile": "Profile",
    "activities": "Activities",
    "notifications": "Notifications",
    "settings": "Settings",
    "admin": "Admin",
    "logout": "Logout"
  },
  "it": {
    "maps": "Mappe",
    "routes": "Percorsi",
    "bivouacs": "Bivacchi e Rifugi",
    "profile": "Profilo",
    "activities": "Attività",
    "notifications": "Notifiche",
    "settings": "Impostazioni",
    "admin": "Amministratore",
    "logout": "Esci"
  },
  "es": {
    "maps": "Mapas",
    "routes": "Rutas",
    "bivouacs": "Vivacs & Refugios",
    "profile": "Perfil",
    "activities": "Actividades",
    "notifications": "Notificaciones",
    "settings": "Ajustes",
    "admin": "Administrador",
    "logout": "Cerrar sesión"
  }
}
</i18n>
