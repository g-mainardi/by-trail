<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import H1 from '@/layouts/typography/H1.vue';
import H2 from '@/layouts/typography/H2.vue';
import { useBivouacStore, type Bivouac } from '@/stores/bivouacs';
import {
  Bed as BedIcon,
  Circle,
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
  try {
    bivouac.value = await bivouacStore.getBivouacById(props.id);
  } catch (error) {
    console.error('Error fetching bivouac:', error);
  }
});
const imageBivouacPH1 = new URL('@/assets/bivouac-ph-1.jpg', import.meta.url)
  .href;
</script>

<template>
  <Card class="p-4">
    <CardTitle>
      <H1>{{ bivouac.name }}</H1>
    </CardTitle>
    <CardContent class="flex flex-col md:flex-row gap-4 w-full p-0">
      <div class="left w-full md:w-[70%]">
        <H2>{{ t('description') }}</H2>
        <p class="mt-2 mb-4">
          {{ t('no_description_available') }}
        </p>
        <H2>{{ t('images') }}</H2>
        <div class="flex overflow-x-auto gap-4 mt-4 mb-4 pb-2">
          <img
            :src="imageBivouacPH1"
            :alt="`${bivouac.name} image`"
            class="rounded-sm object-cover shrink-0 w-1/2"
          />
          <img
            :src="imageBivouacPH1"
            :alt="`${bivouac.name} image`"
            class="rounded-sm object-cover shrink-0 w-1/2"
          />
          <img
            :src="imageBivouacPH1"
            :alt="`${bivouac.name} image`"
            class="rounded-sm object-cover shrink-0 w-1/2"
          />
        </div>
        <H2> {{ t('plan') }} </H2>
      </div>
      <div class="right w-full md:w-[30%]">
        <H2> {{ t('affluence') }} </H2>
        <div class="flex flex-col gap-4 my-4">
          <div class="date_icon">
            {{ new Date().toDateString() }}
            <Circle /><Circle /><Circle />
          </div>
          <div class="date_icon">
            {{ new Date(Date.now() + 86400000).toDateString() }}
            <Circle />
          </div>
          <div class="date_icon">
            {{ new Date(Date.now() + 86400000 * 2).toDateString() }}
            <Circle />
          </div>
          <div class="date_icon">
            {{ new Date(Date.now() + 86400000 * 3).toDateString() }}
            <Circle />
          </div>
        </div>
        <H2>{{ t('additional_info') }}</H2>
        <div class="flex flex-col gap-4 my-4">
          <div class="icon-with-text">
            <MountainIcon />
            <span class="">{{ bivouac.altitude }} mt </span>
          </div>
          <div class="icon-with-text">
            <BedIcon />
            <span>{{ bivouac.capacity }} {{ t('beds') }}</span>
          </div>
          <div class="icon-with-text">
            <ToiletIcon /><span class="">N/A</span>
          </div>
          <div class="icon-with-text">
            <MapPinIcon />
            <span class="">N/A</span>
          </div>
          <div class="icon-with-text">
            <ThumbsUpIcon /><span class="">{{ bivouac.likes }}</span>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter> </CardFooter>
  </Card>
</template>

<style scoped>
.date_icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date_icon * {
  fill: var(--color-foreground); /* Tailwind's gray-600 */
  stroke: 0;
  width: 1rem;
  height: 1rem;
}

.card-title {
  padding-left: 1.5rem;
}
.icon-with-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-with-text span {
  font-family: monospace;
  font-size: 1.25rem;
}
</style>

<i18n>
{
  "en": {
    "description": "Description",
    "additional_info": "Additional Info",
    "affluence": "Affluence",
    "no_description_available": "No description available",
    "plan": "Plan",
    "altitude": "Altitude",
    "capacity": "Capacity",
    "beds": "Beds",
    "toilet": "Toilet",
    "location": "Location",
    "likes": "Likes",
    "images": "Images",
    "explain_plan_functionality": "Here you can express the intention to go to a bivouac and know how many
        people have expressed the intention to go to the same bivouac on the
        various days."
  },
  "it": {
    "description": "Descrizione",
    "additional_info": "Informazioni aggiuntive",
    "affluence": "Affluenza",
    "no_description_available": "Nessuna descrizione disponibile",
    "plan": "Pianifica",
    "altitude": "Altitudine",
    "capacity": "Capacità",
    "beds": "Letti",
    "toilet": "Bagno",
    "location": "Posizione",
    "likes": "Mi piace",
    "images": "Immagini",
    "explain_plan_functionality": "Qui puoi esprimere l'intenzione di andare in un bivacco e sapere quante
        persone hanno espresso l'intenzione di andare nello stesso bivacco nei
        vari giorni."
  },
  "es": {
    "description": "Descripción",
    "additional_info": "Información adicional",
    "affluence": "Afluencia",
    "no_description_available": "No hay descripción disponible",
    "plan": "Planificar",
    "altitude": "Altitud",
    "capacity": "Capacidad",
    "beds": "Camas",
    "toilet": "Baño",
    "location": "Ubicación",
    "likes": "Me gusta",
    "images": "Imágenes",
    "explain_plan_functionality": "Aquí puedes expresar la intención de ir a un bivouac y saber cuántas
        personas han expresado la intención de ir al mismo bivouac en los
        varios días."
  }
}
</i18n>
