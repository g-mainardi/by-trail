<script setup lang="ts">
import H1 from '@/layouts/typography/H1.vue';
import { useRouteStore } from '@/stores/routes';
import { type Route } from '@/types';
import { onMounted, ref } from 'vue';

const routeStore = useRouteStore();
const route = ref<Route | null>(null);

onMounted(async () => {
  route.value = await routeStore.fetchRouteById(props.id);
});

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <H1>
    {{ route?.title }}
  </H1>
</template>
