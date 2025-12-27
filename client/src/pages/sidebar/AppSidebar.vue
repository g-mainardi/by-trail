<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth.ts'
import { useI18n } from 'vue-i18n';

import type { SidebarProps } from '@/components/ui/sidebar'

import AppInfo from '@/pages/sidebar/AppInfo.vue'
import SidebarOptions from '@/pages/sidebar/SidebarOptions.vue'
import SidebarUser from '@/pages/sidebar/SidebarUser.vue'
import {
  Bell,
  LogOutIcon,
  Map,
  MountainSnow,
  Route,
  Settings,
  TentTree,
  UserRound
} from "lucide-vue-next"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const { t } = useI18n();

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})

const handleLogout = () => {
  const authStore = useAuthStore();
  authStore.logout();
}

// This is sample data.
const data = computed(() => ({
  appInfo: [
    {
      name: "By Trail",
      logo: MountainSnow,
      slogan: "You are what you discover",
    },
  ],
  sidebarOptions: [
    {
      title: t("maps"),
      url: "/maps",
      icon: Map,
      action: () => {}
    },
    {
      title: t("routes"),
      url: "#",
      icon: Route,
      action: () => {}
    },
    {
      title: t("bivouacs"),
      url: "/bivouacs",
      icon: TentTree,
      action: () => {}
    },
    {
      title: t("profile"),
      url: '/profile',
      icon: UserRound,
      action: () => {}
    },
    {
      title: t("notifications"),
      url: "#",
      icon: Bell,
      action: () => {}
    },
    {
      title: t("settings"),
      url: "/settings",
      icon: Settings,
      action: () => {}
    },
    {
      title: t("logout"),
      url: "#",
      icon: LogOutIcon,
      color: "text-red-500",
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
    "notifications": "Notifications",
    "settings": "Settings",
    "logout": "Logout"
  },
  "it": {
    "maps": "Mappe",
    "routes": "Percorsi",
    "bivouacs": "Bivacchi e Rifugi",
    "profile": "Profilo",
    "notifications": "Notifiche",
    "settings": "Impostazioni",
    "logout": "Esci"
  },
  "es": {
    "maps": "Mapas",
    "routes": "Rutas",
    "bivouacs": "Vivacs y Refugios",
    "profile": "Perfil",
    "notifications": "Notificaciones",
    "settings": "Ajustes",
    "logout": "Cerrar sesión"
  }
}
</i18n>
