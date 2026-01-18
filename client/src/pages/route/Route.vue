<script setup lang="ts">
import H1 from '@/layouts/typography/H1.vue';
import { useRouteStore } from '@/stores/routes';
import { RouteDifficultyEnum, type Route } from '@/types';
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
  <H1
    :style="
      route?.difficulty === RouteDifficultyEnum.E
        ? { color: 'var(--route-e)' }
        : route?.difficulty === RouteDifficultyEnum.EE
          ? { color: 'var(--route-ee)' }
          : route?.difficulty === RouteDifficultyEnum.EEA
            ? { color: 'var(--route-eea)' }
            : route?.difficulty === RouteDifficultyEnum.T
              ? { color: 'var(--route-t)' }
              : {}
    "
  >
    {{ route?.title }}
  </H1>
</template>
