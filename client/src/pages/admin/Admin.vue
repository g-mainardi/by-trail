<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from 'vue-i18n';
import Alerts from './Alerts.vue';
import Bivouacs from './Bivouacs.vue';
import Routes from './Routes.vue';
import Users from './Users.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import H1 from '@/layouts/typography/H1.vue';
import P from '@/layouts/typography/P.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
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
      <Card class="card">
        <CardHeader>
          <H1>{{ t('users_management') }}</H1>
          <P :no-margin="true" class="text-muted-foreground">
            {{ t('manage_users_description') }}
          </P>
        </CardHeader>
        <CardContent>
          <Users />
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="bivouacs">
      <Card class="card">
        <CardHeader>
          <H1>{{ t('bivouacs_management') }}</H1>
          <P :no-margin="true" class="text-muted-foreground">
            {{ t('manage_bivouacs_description') }}
          </P>
        </CardHeader>
        <CardContent>
          <Bivouacs />
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="paths">
      <Card class="card">
        <CardHeader>
          <H1>{{ t('paths_management') }}</H1>
          <P :no-margin="true" class="text-muted-foreground">
            {{ t('manage_paths_description') }}
          </P>
        </CardHeader>
        <CardContent>
          <Routes />
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="alerts">
      <Card class="card">
        <CardHeader>
          <H1>{{ t('alerts_management') }}</H1>
          <P :no-margin="true" class="text-muted-foreground">
            {{ t('manage_alerts_description') }}
          </P>
        </CardHeader>
        <CardContent>
          <Alerts />
        </CardContent>
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
    "tab_alerts": "Alerts",
    "users_management": "Users Management",
    "manage_users_description": "Manage user accounts and permissions",
    "bivouacs_management": "Bivouacs Management",
    "manage_bivouacs_description": "Manage bivouac listings and details",
    "paths_management": "Paths Management",
    "manage_paths_description": "Oversee and update trail paths information",
    "alerts_management": "Alerts Management",
    "manage_alerts_description": "Handle user-reported alerts and issues"
  },
  "it": {
    "tab_users": "Utenti",
    "tab_bivouacs": "Bivacchi",
    "tab_paths": "Sentieri",
    "tab_alerts": "Segnalazioni",
    "users_management": "Gestione Utenti",
    "manage_users_description": "Gestisci gli account utente e i permessi",
    "bivouacs_management": "Gestione Bivacchi",
    "manage_bivouacs_description": "Gestisci le liste e i dettagli dei bivacchi",
    "paths_management": "Gestione Sentieri",
    "manage_paths_description": "Supervisiona e aggiorna le informazioni sui sentieri",
    "alerts_management": "Gestione Segnalazioni",
    "manage_alerts_description": "Gestisci le segnalazioni e i problemi riportati dagli utenti"
  },
  "es": {
    "tab_users": "Usuarios",
    "tab_bivouacs": "Vivacs",
    "tab_paths": "Caminos",
    "tab_alerts": "Alertas",
    "users_management": "Gestión de Usuarios",
    "manage_users_description": "Gestiona las cuentas de usuario y los permisos",
    "bivouacs_management": "Gestión de Vivacs",
    "manage_bivouacs_description": "Gestiona las listas y detalles de los vivacs",
    "paths_management": "Gestión de Caminos",
    "manage_paths_description": "Supervisa y actualiza la información de los senderos",
    "alerts_management": "Gestión de Alertas",
    "manage_alerts_description": "Maneja las alertas e incidencias reportadas por los usuarios"
  }
}
</i18n>

<style scoped>
.container {
  padding: 1rem; /* = p-4 */
}
</style>
