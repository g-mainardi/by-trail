<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import ThiigsIcon from '@/components/ui/icons/ThiigsIcon.vue';
import H1 from '@/layouts/typography/H1.vue';
import H2 from '@/layouts/typography/H2.vue';
import InlineCode from '@/layouts/typography/InlineCode.vue';
import Lead from '@/layouts/typography/Lead.vue';
import { useBivouacStore, type Bivouac } from '@/stores/bivouacs';
import {
  Bed as BedIcon,
  MapPin as MapPinIcon,
  Mountain as MountainIcon,
  ThumbsUp as ThumbsUpIcon,
  Toilet as ToiletIcon,
} from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const hoodHousePath = new URL(
  '@/assets/trekking_hood_house.png',
  import.meta.url
).href;

const bivouacStore = useBivouacStore();
const props = defineProps<{ id: string }>();
let bivouac = ref<Bivouac>({} as Bivouac);

onMounted(async () => {
  bivouac.value = await bivouacStore.getBivouacById(props.id);
});
</script>

<template>
  <div class="flex items-center gap-4">
    <ThiigsIcon :alt="'bivouac icon'" :path="hoodHousePath" :size="4" />
    <H1 :text="bivouac.name" />
  </div>
  <div class="mt-4 flex flex-col gap-4 md:grid md:grid-cols-2">
    <Card>
      <CardTitle class="card-title">
        <H2>Description</H2>
      </CardTitle>

      <CardContent>
        <Lead v-if="!bivouac.note">
          {{ t('no_description_available') }}
        </Lead>
        <Lead v-else>{{ bivouac.note }}</Lead>
      </CardContent>
    </Card>

    <Card>
      <CardTitle class="card-title">
        <H2>Additional Info</H2>
      </CardTitle>

      <CardContent>
        <div class="flex flex-wrap gap-x-4 gap-y-2 justify-evenly">
          <div class="icon-with-text">
            <InlineCode class="icon-with-text">
              <MountainIcon />
              {{ t('altitude') }}: {{ bivouac.altitude }} mt
            </InlineCode>
          </div>
          <div class="icon-with-text">
            <InlineCode class="icon-with-text">
              <BedIcon />
              {{ t('capacity') }}: {{ bivouac.capacity }}
            </InlineCode>
          </div>
          <div class="icon-with-text">
            <InlineCode class="icon-with-text">
              <ToiletIcon />
              {{ t('toilet') }}: N/A
            </InlineCode>
          </div>
          <div class="icon-with-text">
            <InlineCode class="icon-with-text">
              <MapPinIcon />
              {{ t('location') }}: N/A
            </InlineCode>
          </div>
          <div class="icon-with-text">
            <InlineCode class="icon-with-text">
              <ThumbsUpIcon />
              {{ t('likes') }}: {{ bivouac.likes }}
            </InlineCode>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <Card>
    <CardTitle class="card-title">
      <H2>Images</H2>
    </CardTitle>

    <CardContent> </CardContent>
  </Card>

  <Card>
    <CardTitle class="card-title">
      <H2>Plan your overnight stay</H2>
    </CardTitle>
  </Card>
</template>

<style scoped>
.card-title {
  padding-left: 1.5rem;
}
.icon-with-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.icon-text {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
}
</style>

<i18n>
{
  "en": {
    "no_description_available": "No description available",
    "plan": "Plan",
    "altitude": "Altitude",
    "capacity": "Capacity",
    "toilet": "Toilet",
    "location": "Location",
    "likes": "Likes"
  },
  "it": {
    "no_description_available": "Nessuna descrizione disponibile",
    "plan": "Pianifica",
    "altitude": "Altitudine",
    "capacity": "Capacità",
    "toilet": "Bagno",
    "location": "Posizione",
    "likes": "Mi piace"
  },
  "es": {
    "no_description_available": "No hay descripción disponible",
    "plan": "Planificar",
    "altitude": "Altitud",
    "capacity": "Capacidad",
    "toilet": "Baño",
    "location": "Ubicación",
    "likes": "Me gusta"
  }
}
</i18n>
