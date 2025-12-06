<script setup lang="ts">
import type { Component } from "vue"

import { ref } from "vue"

import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const props = defineProps<{
  appInfo: {
    name: string
    logo: Component
    slogan: string
  }[]
}>()

const { isMobile } = useSidebar()
const appInfo = ref(props.appInfo[0])
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <div 
        v-if="appInfo"
        class="flex w-full items-center gap-3 rounded-lg p-3 text-sidebar-foreground" 
        size="lg"
      >
        <div class="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <component :is="appInfo.logo" class="size-7" />
        </div>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-medium">{{ appInfo.name }}</span>
          <span class="truncate text-xs">{{ appInfo.slogan }}</span>
        </div>
      </div>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
