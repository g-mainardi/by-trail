<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <Select class="w-[180px]" v-model="$i18n.locale" :aria-label="t('selectLanguage')">
    <SelectTrigger class="mt-6 bg-white text-black">
      <SelectValue />
    </SelectTrigger>
    <SelectContent class="bg-white">
      <SelectItem value="en">
        <span role="img" aria-label="English, United Kingdom flag">🇬🇧</span>
        English
      </SelectItem>
      <SelectItem value="it">
        <span role="img" aria-label="Italian, Italy flag">🇮🇹</span>
        Italiano
      </SelectItem>
      <SelectItem value="es">
        <span role="img" aria-label="Spanish, Spain flag">🇪🇸</span> 
        Español
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<i18n>
{
  "en": {
    "selectLanguage": "Select Language"
  },
  "it": {
    "selectLanguage": "Seleziona Lingua"
  },
  "es": {
    "selectLanguage": "Seleccionar idioma"
  }
}
</i18n>