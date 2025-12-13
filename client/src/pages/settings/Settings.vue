<script setup lang="ts">
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import CardDescription from '@/components/ui/card/CardDescription.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from 'vue-i18n';
import DeleteAccountSection from './account/DeleteAccountSection.vue';
import LogoutSection from './account/LogoutSection.vue';
import ChangeLanguageSection from './appearance/ChangeLanguageSection.vue';
import SubscriptionSection from './notifications/SubscriptionSection.vue';
const { t } = useI18n()
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
            <CardTitle>{{ t("account_settings") }}</CardTitle>
            <CardDescription>{{ t("manage_account_settings") }}</CardDescription>
          </CardHeader>
          <CardContent class="px-6">
            <DeleteAccountSection />
            <LogoutSection />
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>{{ t("appearance_settings") }}</CardTitle>
            <CardDescription>{{ t("choose_preferred_settings") }}</CardDescription>
          </CardHeader>
          <CardContent class="px-6">
            <ChangeLanguageSection />
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>{{ t("notification_settings") }}</CardTitle>
            <CardDescription>{{ t("manage_notification_preferences") }}</CardDescription>
          </CardHeader>
          <CardContent class="px-6">
            <SubscriptionSection />
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
      "manage_account_settings": "Manage your account settings",
      "appearance_settings": "Appearance Settings",
      "choose_preferred_settings": "Choose your preferred appearance settings",
      "notification_settings": "Notification Settings",
      "manage_notification_preferences": "Manage your notification preferences"
    },
    "it": {
      "tab_account": "Account",
      "tab_appearance": "Aspetto",
      "tab_notifications": "Notifiche",
      "account_settings": "Impostazioni Account",
      "manage_account_settings": "Gestisci le impostazioni del tuo account",
      "appearance_settings": "Impostazioni Aspetto",
      "choose_preferred_settings": "Scegli le tue impostazioni di aspetto preferite",
      "notification_settings": "Impostazioni Notifiche",
      "manage_notification_preferences": "Gestisci le tue preferenze di notifica"
    },
    "es": {
      "tab_account": "Cuenta",
      "tab_appearance": "Apariencia",
      "tab_notifications": "Notificaciones",
      "account_settings": "Configuración de la Cuenta",
      "manage_account_settings": "Administra la configuración de tu cuenta",
      "appearance_settings": "Configuración de Apariencia",
      "choose_preferred_settings": "Elige tus configuraciones de apariencia preferidas",
      "notification_settings": "Configuración de Notificaciones",
      "manage_notification_preferences": "Administra tus preferencias de notificación"
    }
  }
</i18n>