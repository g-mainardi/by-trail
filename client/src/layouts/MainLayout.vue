<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import AppSidebar from '@/pages/sidebar/AppSidebar.vue';
import { computed, Suspense } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
const { t } = useI18n();

const route = useRoute();
const pageName = computed(() => {
  return route.meta.titleKey
    ? t(route.meta.titleKey as string)
    : route.name?.toString() || 'Home';
});
</script>

<template>
  <SidebarProvider>
    <AppSidebar />

    <SidebarInset>
      <div
        class="flex items-center gap-2 h-10 px-4 sticky top-0 z-10 bg-background border-b"
      >
        <SidebarTrigger class="-ml-1" />

        <Separator
          orientation="vertical"
          class="mx-1 data-[orientation=vertical]:h-4"
        />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage class="text-base">{{ pageName }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div class="flex flex-1 flex-col px-4 pb-4 pt-4">
        <Suspense>
          <template #default>
            <RouterView />
          </template>
          <template #fallback>
            <Spinner />
          </template>
        </Suspense>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
