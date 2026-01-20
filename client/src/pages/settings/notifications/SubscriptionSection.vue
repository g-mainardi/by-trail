<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import H1 from '@/layouts/typography/H1.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <H1>{{ t('subscription') }}</H1>
  <div class="flex items-center space-x-2 mt-6 mb-4">
    <Switch id="new-bivouacs" disabled />
    <Label for="new-bivouacs">{{ t('get_updates_new_bivouacs') }}</Label>
  </div>
  <div class="flex items-center space-x-2 mb-2">
    <Switch id="new-routes" disabled />
    <Label for="new-routes">{{ t('get_updates_new_routes') }}</Label>
  </div>
  <div class="mt-8 text-sm text-muted-foreground">
    <span>{{ t('wip_page') }}</span>
  </div>
</template>

<i18n>
  {
    "en": {
      "subscription": "Subscription",
      "get_updates_new_bivouacs": "Get updates on new bivouacs",
      "get_updates_new_routes": "Get updates on new routes",
      "wip_page": "This page is a work in progress."
    },
    "it": {
      "subscription": "Iscrizione",
      "get_updates_new_bivouacs": "Ricevi aggiornamenti sui nuovi bivacchi",
      "get_updates_new_routes": "Ricevi aggiornamenti sulle nuove vie",
      "wip_page": "Questa pagina è in fase di sviluppo."
    },
    "es": {
      "subscription": "Suscripción",
      "get_updates_new_bivouacs": "Recibir actualizaciones sobre nuevos bivouacs",
      "get_updates_new_routes": "Recibir actualizaciones sobre nuevas rutas",
      "wip_page": "Esta página está en desarrollo."
    }
  }
</i18n>
