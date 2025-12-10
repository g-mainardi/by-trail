<script setup lang="ts">
import { Button } from '@/components/ui/button';
import Separator from '@/components/ui/separator/Separator.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
</script>

<template>
  <div class="my-4">
    <h1 class="scroll-m-20 text-left font-mono text-4 tracking-tight text-balance">
      {{ t("session_title") }}
    </h1>
    <Separator orientation="horizontal" class="my-4" />
    <Button variant="outline">{{ t("logout_button") }}</Button>
  </div>
</template>

<i18n>
  {
    "en": {
      "session_title": "Session",
      "logout_button": "Logout"
    },
    "it": {
      "session_title": "Sessione",
      "logout_button": "Disconnettersi"
    },
    "es": {
      "session_title": "Sesión",
      "logout_button": "Cerrar sesión"
    }
  }
</i18n>