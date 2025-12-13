<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import AppInfo from '@/components/AppInfo.vue'
import SidebarOptions from '@/components/SidebarOptions.vue'
import SidebarUser from '@/components/SidebarUser.vue'
import {
  Map,
  MountainSnow,
  Route,
  Settings,
  TentTree,
  UserRound,
} from "lucide-vue-next"

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
      url: '/profile',
      icon: UserRound,
    },
    {
      title: "Settings",
      url: "/settings",
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
      <SidebarUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
