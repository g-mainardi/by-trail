<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import H1 from '@/layouts/typography/H1.vue';
import { useColorMode } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const mode = useColorMode();
localStorage.theme = mode.value;
</script>

<template>
  <div class="flex flex-col gap-4">
    <H1>{{ t('change_theme') }}</H1>
    <Select class="w-[180px]" v-model="mode" :aria-label="t('select_theme')">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <span role="img" aria-label="Full moon">🌕</span>
          {{ t('light') }}
        </SelectItem>
        <SelectItem value="dark">
          <span role="img" aria-label="Black circle">⚫️</span> {{ t('dark') }}
        </SelectItem>
        <SelectItem value="auto">
          <span role="img" aria-label="First quarter moon">🌓</span>
          {{ t('auto') }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<i18n>
  {
    "en": {
      "select_theme": "Select Theme",
      "light": "Light",
      "dark": "Dark",
      "auto": "Auto",
      "change_theme": "Change Theme"
    },
    "it": {
      "select_theme": "Cambia Tema",
      "light": "Chiaro",
      "dark": "Scuro",
      "auto": "Automatico",
      "change_theme": "Cambia Tema"
    },
    "es": {
      "select_theme": "Cambiar Tema",
      "light": "Claro",
      "dark": "Oscuro",
      "auto": "Automático",
      "change_theme": "Cambiar Tema"
    }
  }
</i18n>
