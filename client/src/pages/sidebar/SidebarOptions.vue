<script setup lang="ts">
import type { LucideIcon } from "lucide-vue-next";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

defineProps<{
  items: {
    title: string
    url: string
    icon?: LucideIcon
    action?: () => void
  }[]
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <div v-for="item in items" :key="item.title">
        <RouterLink :to="item.url">
          <SidebarMenuItem>
            <SidebarMenuButton :tooltip="item.title" @click="item.action && item.action()">
              <component 
                :is="item.icon" 
                v-if="item.icon"
                :class="[item.title === 'Logout' ? 'text-red-500' : 'text-black']"
              />
              <span
                :class="[item.title === 'Logout' ? 'text-red-500' : 'text-black']"
              >{{ item.title }}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </RouterLink>
      </div>
    </SidebarMenu>
  </SidebarGroup>
</template>
