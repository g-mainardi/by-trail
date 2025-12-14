<script lang="ts">
export const description = "A simple map"
</script>

<script setup lang="ts">
<<<<<<< HEAD
  import AppSidebar from "@/components/AppSidebar.vue"
  import {
    Breadcrumb,
    BreadcrumbPage,
  } from "@/components/ui/breadcrumb"
  import { Separator } from "@/components/ui/separator"
  import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
  } from "@/components/ui/sidebar"
  import { RouterView } from "vue-router"

  import 'leaflet/dist/leaflet.css';
  import { ref } from 'vue';
  import { LIcon, LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet'
  import bivaccoIcon from '@/assets/bivacco.png'; /* @attribution: <a href="https://www.flaticon.com/free-icons/home" title="home icons">Home icons created by Dave Gandy - Flaticon</a> */
  

  const zoom = ref(13);
  const center = ref([46.3133334, 11.9787921]); 
  const bivaccos = ref([
    {
      name: 'Bivacco Bedin',
      coords: [46.3133334, 11.9787921],
    },
    {
      name: 'Bivacco Giacomelli alla Madonnina',
      coords: [45.9710000, 11.1860000],
    }
  ]);
  const iconUrl = bivaccoIcon;
  const iconSize = [25, 25];
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12
      sticky top-0 z-1 bg-background border-b">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
          
          <Breadcrumb>
            <BreadcrumbPage>{{ $route.name }}</BreadcrumbPage>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-1 flex-col gap-4 pt-0">
        <!-- Your content goes here -->
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>

    <div class="map-wrapper">
      <div class="map-container">
        <l-map v-model:zoom="zoom" :center="center" :useGlobalLeaflet="false">
          <l-tile-layer
            url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=ab8e9f716fab4870bb4378fa9dc9d11c"
            attribution="Maps © Thunderforest, Data © OpenStreetMap contributors"
          >
          </l-tile-layer>

          <l-marker v-for="bivacco in bivaccos" :lat-lng="bivacco.coords"
          >
            <l-icon
              :icon-url="iconUrl"
              :icon-size="iconSize"  
              class-name="bivaccoIconStyle"
            />

            <l-popup>
              <div class="popup-content">
                <h3>{{ bivacco.name }}</h3>
              </div>
            </l-popup>
          </l-marker>
        </l-map>
      </div>
    </div>
</template>

<style scoped>
  .map-wrapper {
    margin: auto;
    height: 600px;
    width: 1200px;
    padding: 20px;
  }
  .map-wrapper .map-container {
    height: 100%;
    width: 100%;
    border: 3px solid green;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    z-index: 0;
  }

  :deep(.bivaccoIconStyle) {
    box-sizing: border-box;
    border: 1px solid #000000;
    border-radius: 5px;
    background-color: rgb(255, 173, 254);
    padding: 5px;
}
</style>