<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ThiigsIcon from '@/components/ui/icons/ThiigsIcon.vue';
import H1 from '@/layouts/typography/H1.vue';
import H2 from '@/layouts/typography/H2.vue';
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
  try {
    bivouac.value = await bivouacStore.getBivouacById(props.id);
  } catch (error) {
    console.error('Error fetching bivouac:', error);
  }
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
        <H2>{{ t('description') }}</H2>
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
        <H2>{{ t('additional_info') }}</H2>
      </CardTitle>

      <CardContent>
        <div class="flex flex-wrap gap-x-4 gap-y-2 justify-evenly">
          <div class="icon-with-text">
            <MountainIcon />
            {{ t('altitude') }}: {{ bivouac.altitude }} mt
          </div>
          <div class="icon-with-text">
            <BedIcon />
            {{ t('capacity') }}: {{ bivouac.capacity }}
          </div>
          <div class="icon-with-text">
            <ToiletIcon />
            {{ t('toilet') }}: N/A
          </div>
          <div class="icon-with-text">
            <MapPinIcon />
            {{ t('location') }}: N/A
          </div>
          <div class="icon-with-text">
            <ThumbsUpIcon />
            {{ t('likes') }}: {{ bivouac.likes }}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <H2 class="ml-4">{{ t('images') }}</H2>
  <Carousel class="w-full max-w-xs mt-6 md:max-w-md lg:max-w-lg mx-auto">
    <div class="flex items-center gap-2">
      <CarouselPrevious class="relative left-0 translate-y-0" />
      <CarouselContent>
        <CarouselItem
          v-for="i in 5"
          :key="i"
          class="basis-full md:basis-3/4 lg:basis-2/3"
        >
          <div class="p-1 w-full">
            <Card class="w-full">
              <CardContent
                class="flex aspect-square items-center justify-center"
              >
                <span class="text-4xl font-semibold">{{ i }}</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselNext class="relative right-0 translate-y-0" />
    </div>
  </Carousel>

  <Card>
    <CardTitle class="card-title">
      <H2> {{ t('plan') }} </H2>
    </CardTitle>
    <CardContent>
      <Lead>
        {{ t('explain_plan_functionality') }}
      </Lead>
    </CardContent>
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
</style>

<i18n>
{
  "en": {
    "description": "Description",
    "additional_info": "Additional Info",
    "no_description_available": "No description available",
    "plan": "Plan",
    "altitude": "Altitude",
    "capacity": "Capacity",
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
    "no_description_available": "Nessuna descrizione disponibile",
    "plan": "Pianifica",
    "altitude": "Altitudine",
    "capacity": "Capacità",
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
    "no_description_available": "No hay descripción disponible",
    "plan": "Planificar",
    "altitude": "Altitud",
    "capacity": "Capacidad",
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
