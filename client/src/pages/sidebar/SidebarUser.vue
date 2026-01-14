<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

// --- UI Components ---
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" class="hover:bg-transparent">
        <Avatar class="h-10 w-10 rounded-lg">
          <AvatarFallback
            class="rounded-lg text-white text-xl font-normal bg-primary"
            >{{ user?.name?.charAt(0).toUpperCase() }}</AvatarFallback
          >
        </Avatar>
        <div class="grid flex-1 text-left leading-tight">
          <span class="text-sm font-medium">{{ user?.name }}</span>
          <span class="text-sm">{{ user?.email }}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
