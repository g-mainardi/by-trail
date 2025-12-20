<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/pages/sidebar/AppSidebar.vue";
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pageName = computed(() => route.name ? route.name.toString() : 'Home');
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
  
    <SidebarInset>
      <div class="flex items-center gap-2 h-10 px-4">
        <SidebarTrigger class="-ml-1" />
        
        <Separator orientation="vertical" class="mx-1 data-[orientation=vertical]:h-4" />
        
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage class="text-base">{{ pageName }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Separator orientation="horizontal" />

      <div class="flex flex-1 flex-col gap-4 pt-0">
         <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>