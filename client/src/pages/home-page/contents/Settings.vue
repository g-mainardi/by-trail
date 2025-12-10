<script setup lang="ts">
import { Button } from '@/components/ui/button';
import type { CardContent } from '@/components/ui/card';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import CardDescription from '@/components/ui/card/CardDescription.vue';
import { Label } from '@/components/ui/label';
import SelectLanguage from '@/components/ui/select/SelectLanguage.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
</script>

<script lang="ts">

</script>

<template>
  <div class="p-4">
    <Tabs default-value="account">

      <TabsList>
        <TabsTrigger value="account">
          {{ t("tab_account") }}
        </TabsTrigger>
        <TabsTrigger value="appearance">
          {{ t("tab_appearance") }}
        </TabsTrigger>
        <TabsTrigger value="notifications">
          {{ t("tab_notifications") }}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>
              {{ t("account_settings") }}
            </CardTitle>
            <CardDescription>
              {{ t("manage_account_settings") }}
            </CardDescription>
          </CardHeader>
          <CardContent class="px-6">
            <h1 class="scroll-m-20 text-left font-mono text-4 tracking-tight text-balance">
              {{ t("delete_account_title") }}
            </h1>
            <Separator orientation="horizontal" class="my-4" />
            <Button variant="destructive">{{ t("delete_account_button") }}</Button>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>
              {{ t("appearance_settings") }}
            </CardTitle>
            <CardDescription>
              {{ t("choose_preferred_settings") }}
            </CardDescription>
          </CardHeader>
          <CardContent class="px-6">
            <h1 class="scroll-m-20 text-left font-mono text-4 tracking-tight text-balance">
              {{ t("change_language") }}
            </h1>
            <Separator orientation="horizontal" class="my-4" />
            <SelectLanguage />
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>
              {{ t("notification_settings") }}
            </CardTitle>
            <CardDescription>
              {{ t("manage_notification_preferences") }}
            </CardDescription>
          </CardHeader>
          <CardContent class="px-6">
            <h1 class="scroll-m-20 text-left font-mono text-4 tracking-tight text-balance">
              {{ t("subscription") }}
            </h1>
            <Separator orientation="horizontal" class="my-4" />
            <div class="flex items-center space-x-2 mb-4">
              <Switch id="new-bivoucs" />
              <Label for="new-bivoucs">{{ t("get_updates_new_bivouacs") }}</Label>
            </div>
            <div class="flex items-center space-x-2 mb-4">
              <Switch id="new-routes" />
              <Label for="new-routes">{{ t("get_updates_new_routes") }}</Label>
            </div>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

<i18n>
  {
    "en": {
      "tab_account": "Account",
      "tab_appearance": "Appearance",
      "tab_notifications": "Notifications",
      "account_settings": "Account Settings",
      "manage_account_settings": "Manage your account settings.",
      "delete_account_title": "Delete Account",
      "delete_account_button": "Delete",
      "appearance_settings": "Appearance Settings",
      "choose_preferred_settings": "Choose your preferred settings for the application appearance.",
      "change_language": "Change Language",
      "notification_settings": "Notification Settings",
      "manage_notification_preferences": "Manage your notification preferences.",
      "subscription": "Subscription",
      "get_updates_new_bivouacs": "Get updates about new bivouacs",
      "get_updates_new_routes": "Get updates about new routes"
    },
    "it": {
      "tab_account": "Account",
      "tab_appearance": "Aspetto",
      "tab_notifications": "Notifiche",
      "account_settings": "Impostazioni Account",
      "manage_account_settings": "Gestisci le impostazioni del tuo account.",
      "delete_account_title": "Elimina Account",
      "delete_account_button": "Elimina",
      "appearance_settings": "Impostazioni Aspetto",
      "choose_preferred_settings": "Scegli le tue impostazioni preferite per l'aspetto dell'applicazione.",
      "change_language": "Cambia Lingua",
      "notification_settings": "Impostazioni Notifiche",
      "manage_notification_preferences": "Gestisci le tue preferenze di notifica.",
      "subscription": "Iscrizione",
      "get_updates_new_bivouacs": "Ricevi aggiornamenti sui nuovi bivacchi",
      "get_updates_new_routes": "Ricevi aggiornamenti sulle nuove rotte"
    },
    "es": {
      "tab_account": "Cuenta",
      "tab_appearance": "Apariencia",
      "tab_notifications": "Notificaciones",
      "account_settings": "Configuración de la cuenta",
      "manage_account_settings": "Administra la configuración de tu cuenta.",
      "delete_account_title": "Eliminar cuenta",
      "delete_account_button_button": "Eliminar",
      "appearance_settings": "Configuración de apariencia",
      "choose_preferred_settings": "Elige tus configuraciones preferidas para la apariencia de la aplicación.",
      "change_language": "Cambiar idioma",
      "notification_settings": "Configuración de notificaciones",
      "manage_notification_preferences": "Administra tus preferencias de notificación.",
      "subscription": "Suscripción",
      "get_updates_new_bivouacs": "Recibir actualizaciones sobre nuevos bivouacs",
      "get_updates_new_routes": "Recibir actualizaciones sobre nuevas rutas"
    }
  }
</i18n>