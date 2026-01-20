<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

const changeLanguage = (newLocale: string | null) => {
  if (!newLocale) return;
  locale.value = newLocale;
  localStorage.setItem('locale', newLocale);
};
</script>

<template>
  <Select
    class="w-[180px]"
    v-model="$i18n.locale"
    @update:model-value="(val) => changeLanguage(val as string)"
    :aria-label="t('selectLanguage')"
  >
    <SelectTrigger class="mt-6">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
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
