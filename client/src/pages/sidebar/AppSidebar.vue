<script setup lang="ts">
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
import { useAuthStore } from '@/stores/auth.ts'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})

const handleLogout = () => {
  const authStore = useAuthStore();
  authStore.logout();
}

// This is sample data.
const data = {
  appInfo: [
    {
      name: "By Trail",
      logo: MountainSnow,
      slogan: "You are what you discover",
    },
  ],
  sidebarOptions: [
    {
      title: "Mappe",
      url: "/maps",
      icon: Map,
      action: () => {}
    },
    {
      title: "Percorsi",
      url: "#",
      icon: Route,
      action: () => {}
    },
    {
      title: "Bivacchi e Rifugi",
      url: "/bivouacs",
      icon: TentTree,
      action: () => {}
    },
    {
      title: 'Profilo',
      url: '/profile',
      icon: UserRound,
      action: () => {}
    },
    {
      title: 'Notifiche',
      url: "#",
      icon: Bell,
      action: () => {}
    },
    {
      title: "Impostazioni",
      url: "/settings",
      icon: Settings,
      action: () => {}
    },
    {
      title: "Logout",
      url: "#",
      icon: LogOutIcon,
      action: handleLogout
    },
  ],
}
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
