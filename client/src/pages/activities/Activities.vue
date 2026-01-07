<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from 'vue-i18n';
import SavedBivouacs from './tabs/SavedBivouacs.vue';
import SavedRoutes from './tabs/SavedRoutes.vue';
import ProposalForm from './tabs/ProposalForm.vue';
import Card from '@/components/ui/card/Card.vue';
import H1 from '@/layouts/typography/H1.vue';
const { t } = useI18n();
</script>

<template>
  <div
    class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
  >
    <div>
      <H1 :text="t('your_activities')" />
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
        <div>
          <H1 :text="t('saved_routes')" />
          <p class="text-muted-foreground">
            {{ t('your_routes_description') }}
          </p>
        </div>
        <SavedRoutes />
      </Card>
    </TabsContent>

    <TabsContent value="bivouacs">
      <Card class="container">
        <div>
          <H1 :text="t('saved_bivouacs')" />
          <p class="text-muted-foreground">
            {{ t('your_bivouacs_description') }}
          </p>
        </div>
        <SavedBivouacs />
      </Card>
    </TabsContent>

    <TabsContent value="proposal">
      <Card class="container">
        <div>
          <H1 :text="t('make_a_proposal')" />
          <p class="text-muted-foreground">
            {{ t('make_a_proposal_description') }}
          </p>
        </div>
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
    "tab_proposal": "Proposal",
    "saved_routes": "Saved Routes",
    "your_routes_description": "Review and manage your saved routes.",
    "saved_bivouacs": "Saved Bivouacs",
    "your_bivouacs_description": "Review and manage your saved bivouacs.",
    "make_a_proposal": "Make a Proposal",
    "make_a_proposal_description": "Have an idea for a new route or bivouac? Send us your proposal and we'll consider it for future inclusion on our platform.",
  },
  "it": {
    "your_activities": "Le tue attività",
    "your_activities_description": "Gestisci e rivedi le tue attività passate.",
    "tab_routes": "Percorsi",
    "tab_bivouacs": "Bivacchi",
    "tab_proposal": "Proposta",
    "saved_routes": "Percorsi Salvati",
    "your_routes_description": "Rivedi e gestisci i tuoi percorsi salvati.",
    "saved_bivouacs": "Bivacchi Salvati",
    "your_bivouacs_description": "Rivedi e gestisci i tuoi bivacchi salvati.",
    "make_a_proposal": "Fai una Proposta",
    "make_a_proposal_description": "Hai un'idea per un nuovo percorso o bivacco? Inviaci la tua proposta e la prenderemo in considerazione per future inclusioni nella nostra piattaforma.",
  },
  "es": {
    "your_activities": "Tus actividades",
    "your_activities_description": "Gestiona y revisa tus actividades pasadas.",
    "tab_routes": "Rutas",
    "tab_bivouacs": "Bivouacs",
    "tab_proposal": "Propuesta",
    "saved_routes": "Rutas Guardadas",
    "your_routes_description": "Revisa y gestiona tus rutas guardadas.",
    "saved_bivouacs": "Bivouacs Guardados",
    "your_bivouacs_description": "Revisa y gestiona tus bivouacs guardados.",
    "make_a_proposal": "Haz una Propuesta",
    "make_a_proposal_description": "¿Tienes una idea para una nueva ruta o bivouac? Envíanos tu propuesta y la consideraremos para futuras inclusiones en nuestra plataforma.",
  }
}
</i18n>

<style scoped>
.container {
  padding: 1rem; /* = p-4 */
}
</style>
