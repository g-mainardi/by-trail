<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
</script>

<template>
  <Select class="w-[180px]" v-model="$i18n.locale">
    <SelectTrigger class="mt-6 bg-white text-black">
      <SelectValue placeholder="Select a language" />
    </SelectTrigger>
    <SelectContent class="bg-white">
      <SelectItem value="en">🇬🇧 English</SelectItem>
      <SelectItem value="it">🇮🇹 Italiano</SelectItem>
      <SelectItem value="es">🇪🇸 Español</SelectItem>
    </SelectContent>
  </Select>
</template>