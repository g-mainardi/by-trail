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
</script>

<script lang="ts">

</script>

<template>
  <div class="p-4">
    <Tabs default-value="account">

      <TabsList>
        <TabsTrigger value="account">
          Account
        </TabsTrigger>
        <TabsTrigger value="appearance">
          Appearance
        </TabsTrigger>
        <TabsTrigger value="notifications">
          Notifications
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account settings.
            </CardDescription>
          </CardHeader>
          <CardContent class="px-6">
            <h1 class="scroll-m-20 text-left font-mono text-4 tracking-tight text-balance">
              Delete account
            </h1>
            <Separator orientation="horizontal" class="my-4" />
            <Button variant="destructive">Delete Account</Button>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>
              Appearance Settings
            </CardTitle>
            <CardDescription>
              Choose your preferred settings for the application appearance.
            </CardDescription>
          </CardHeader>
          <CardContent class="px-6">
            <h1 class="scroll-m-20 text-left font-mono text-4 tracking-tight text-balance">
              Change Language
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
              Notification Settings
            </CardTitle>
            <CardDescription>
              Manage your notification preferences.
            </CardDescription>
          </CardHeader>
          <CardContent class="px-6">
            <h1 class="scroll-m-20 text-left font-mono text-4 tracking-tight text-balance">
              Subscription
            </h1>
            <Separator orientation="horizontal" class="my-4" />
            <div class="flex items-center space-x-2 mb-4">
              <Switch id="new-bivoucs" />
              <Label for="new-bivoucs">Get updates about new bivouacs</Label>
            </div>
            <div class="flex items-center space-x-2 mb-4">
              <Switch id="new-routes" />
              <Label for="new-routes">Get updates about new routes</Label>
            </div>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

