<script setup lang="ts">
import { Label } from '@/components/ui/label';
import Separator from '@/components/ui/separator/Separator.vue';
import { Switch } from '@/components/ui/switch';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
</script>

<template>
  <div class="my-4">
    <h1 class="scroll-m-20 text-left font-mono text-4 tracking-tight text-balance">
      {{ t("subscription") }}
    </h1>
    <Separator orientation="horizontal" class="my-4" />
    <div class="flex items-center space-x-2 mb-4">
      <Switch id="new-bivouacs" />
      <Label for="new-bivouacs">{{ t("get_updates_new_bivouacs") }}</Label>
    </div>
    <div class="flex items-center space-x-2 mb-4">
      <Switch id="new-routes" />
      <Label for="new-routes">{{ t("get_updates_new_routes") }}</Label>
    </div>
  </div>  
</template>

<i18n>
  {
    "en": {
      "subscription": "Subscription",
      "get_updates_new_bivouacs": "Get updates on new bivouacs",
      "get_updates_new_routes": "Get updates on new routes"
    },
    "it": {
      "subscription": "Iscrizione",
      "get_updates_new_bivouacs": "Ricevi aggiornamenti sui nuovi bivacchi",
      "get_updates_new_routes": "Ricevi aggiornamenti sulle nuove vie"
    },
    "es": {
      "subscription": "Suscripción",
      "get_updates_new_bivouacs": "Recibir actualizaciones sobre nuevos bivouacs",
      "get_updates_new_routes": "Recibir actualizaciones sobre nuevas rutas"
    }
  }
</i18n>