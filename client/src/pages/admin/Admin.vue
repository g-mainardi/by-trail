<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from 'vue-i18n';
import Alerts from './Alerts.vue';
import Bivouacs from './Bivouacs.vue';
import Paths from './Paths.vue';
import Users from './Users.vue';
const { t } = useI18n();
</script>

<template>
  <Tabs default-value="users">
    <TabsList>
      <TabsTrigger value="users">
        {{ t('tab_users') }}
      </TabsTrigger>
      <TabsTrigger value="bivouacs">
        {{ t('tab_bivouacs') }}
      </TabsTrigger>
      <TabsTrigger value="paths">
        {{ t('tab_paths') }}
      </TabsTrigger>
      <TabsTrigger value="alerts">
        {{ t('tab_alerts') }}
      </TabsTrigger>
    </TabsList>

    <TabsContent value="users">
      <Card class="container">
        <Users />
      </Card>
    </TabsContent>

    <TabsContent value="bivouacs">
      <Card class="container">
        <Bivouacs />
      </Card>
    </TabsContent>

    <TabsContent value="paths">
      <Card class="container">
        <Paths />
      </Card>
    </TabsContent>

    <TabsContent value="alerts">
      <Card class="container">
        <Alerts />
      </Card>
    </TabsContent>
  </Tabs>
</template>

<i18n>
{
  "en": {
    "tab_users": "Users",
    "tab_bivouacs": "Bivouacs",
    "tab_paths": "Paths",
    "tab_alerts": "Alerts"
  },
  "it": {
    "tab_users": "Utenti",
    "tab_bivouacs": "Bivacchi",
    "tab_paths": "Sentieri",
    "tab_alerts": "Segnalazioni"
  },
  "es": {
    "tab_users": "Usuarios",
    "tab_bivouacs": "Vivacs",
    "tab_paths": "Caminos",
    "tab_alerts": "Alertas"
  }
}
</i18n>

<style scoped>
.container {
  padding: 1rem; /* = p-4 */
}
</style>
