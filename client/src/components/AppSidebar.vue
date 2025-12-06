<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  Map,
  MountainSnow,
  Route,
  Settings,
  TentTree,
  UserRound,
} from "lucide-vue-next"
import AppInfo from '@/components/AppInfo.vue'
import NavUser from '@/components/NavUser.vue'
import SidebarOptions from '@/components/SidebarOptions.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
      url: "#",
      icon: Map,
    },
    {
      title: "Percorsi",
      url: "#",
      icon: Route,
    },
    {
      title: "Bivacchi e Rifugi",
      url: "#",
      icon: TentTree,
    },
    {
      title: 'Profilo',
      url: '#',
      icon: UserRound,
    },
    {
      title: "Impostazioni",
      url: "#",
      icon: Settings,
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
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
