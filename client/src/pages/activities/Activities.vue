<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from 'vue-i18n';
import SavedBivouacs from './tabs/SavedBivouacs.vue';
import SavedRoutes from './tabs/SavedRoutes.vue';
import ProposalForm from './tabs/ProposalForm.vue';
import Card from '@/components/ui/card/Card.vue';
const { t } = useI18n();
</script>

<template>
  <div
    class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
  >
    <div>
      <h1 class="text-3xl font-bold tracking-tight">
        {{ t('your_activities') }}
      </h1>
      <p class="text-muted-foreground">
        {{ t('your_activities_description') }}
      </p>
    </div>
  </div>
  <Tabs default-value="routes">
    <TabsList>
      <TabsTrigger value="routes">
        {{ t('tab_routes') }}
      </TabsTrigger>
      <TabsTrigger value="bivouacs">
        {{ t('tab_bivouacs') }}
      </TabsTrigger>
      <TabsTrigger value="proposal">
        {{ t('tab_proposal') }}
      </TabsTrigger>
    </TabsList>

    <TabsContent value="routes">
      <Card class="container">
        <SavedRoutes />
      </Card>
    </TabsContent>

    <TabsContent value="bivouacs">
      <Card class="container">
        <SavedBivouacs />
      </Card>
    </TabsContent>

    <TabsContent value="proposal">
      <Card class="container">
        <ProposalForm />
      </Card>
    </TabsContent>
  </Tabs>
</template>
<i18n>
{
  "en": {
    "your_activities": "Your Activities",
    "your_activities_description": "Manage and review your past activities.",
    "tab_routes": "Routes",
    "tab_bivouacs": "Bivouacs",
    "tab_proposal": "Proposal"
  },
  "it": {
    "your_activities": "Le tue attività",
    "your_activities_description": "Gestisci e rivedi le tue attività passate.",
    "tab_routes": "Percorsi",
    "tab_bivouacs": "Bivacchi",
    "tab_proposal": "Proposta"
  },
  "es": {
    "your_activities": "Tus actividades",
    "your_activities_description": "Gestiona y revisa tus actividades pasadas.",
    "tab_routes": "Rutas",
    "tab_bivouacs": "Bivouacs",
    "tab_proposal": "Propuesta"
  }
}
</i18n>

<style scoped>
.container {
  padding: 1rem; /* = p-4 */
}
</style>
