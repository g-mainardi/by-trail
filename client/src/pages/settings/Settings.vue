<script setup lang="ts">
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from 'vue-i18n';
import DeleteAccountSection from './account/DeleteAccountSection.vue';
import ChangeLanguageSection from './appearance/ChangeLanguageSection.vue';
import ChangeThemeSection from './appearance/ChangeThemeSection.vue';
import SubscriptionSection from './notifications/SubscriptionSection.vue';
const { t } = useI18n();
</script>

<template>
  <Tabs default-value="account">
    <TabsList>
      <TabsTrigger value="account">
        {{ t('tab_account') }}
      </TabsTrigger>
      <TabsTrigger value="appearance">
        {{ t('tab_appearance') }}
      </TabsTrigger>
      <TabsTrigger value="notifications">
        {{ t('tab_notifications') }}
      </TabsTrigger>
    </TabsList>

    <TabsContent value="account">
      <Card class="card">
        <CardContent class="card-content">
          <DeleteAccountSection />
        </CardContent>
        <CardFooter> </CardFooter>
      </Card>
    </TabsContent>
    <TabsContent value="appearance">
      <Card class="card">
        <CardContent class="card-content">
          <ChangeLanguageSection />
          <ChangeThemeSection />
        </CardContent>
        <CardFooter> </CardFooter>
      </Card>
    </TabsContent>
    <TabsContent value="notifications">
      <Card class="card">
        <CardContent class="card-content">
          <SubscriptionSection />
        </CardContent>
        <CardFooter> </CardFooter>
      </Card>
    </TabsContent>
  </Tabs>
</template>

<style scoped>
.card {
  gap: 0;
  padding: calc(var(--spacing) * 6);
}
.card-content {
  /* flex flex-col gap-4 */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
}
</style>

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
