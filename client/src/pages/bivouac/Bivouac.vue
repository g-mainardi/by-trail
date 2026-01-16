<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import Calendar from '@/components/ui/calendar/Calendar.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import H1 from '@/layouts/typography/H1.vue';
import H2 from '@/layouts/typography/H2.vue';
import { useBivouacStore, type Bivouac } from '@/stores/bivouacs';
import { useFavoriteStore } from '@/stores/favorites';
import {
  fromDate,
  getLocalTimeZone,
  type DateValue,
} from '@internationalized/date';
import {
  Bed as BedIcon,
  Circle,
  Heart as HeartIcon,
  MapPin as MapPinIcon,
  Mountain as MountainIcon,
  Toilet as ToiletIcon,
} from 'lucide-vue-next';
import { onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const favoritesStore = useFavoriteStore();
const favorites = ref<Bivouac[]>([]);

const isFavorite = (bivouacId: string): boolean => {
  return favorites.value.some((bivouac) => bivouac._id === bivouacId);
};

const toggleFavorite = async (bivouacId: string) => {
  let res: { success: boolean; error?: string } = {
    success: false,
  };
  if (isFavorite(bivouacId)) {
    res = await favoritesStore.removeFavoriteBivouac(bivouacId);
  } else {
    res = await favoritesStore.addFavoriteBivouac(bivouacId);
  }
  if (res.success) favorites.value = await favoritesStore.getFavoriteBivouacs();
  else console.log(res.error);
};

const bivouacStore = useBivouacStore();
const props = defineProps<{ id: string }>();
let bivouac = ref<Bivouac>({} as Bivouac);
const capacity = bivouac.value.capacity;

const people = ref<number>(0);
const date = ref(fromDate(new Date(), getLocalTimeZone())) as Ref<DateValue>;

onMounted(async () => {
  try {
    bivouac.value = await bivouacStore.getBivouacById(props.id);
  } catch (error) {
    console.error('Error fetching bivouac:', error);
  }
  favorites.value = await favoritesStore.getFavoriteBivouacs();
});
const placeholder = new URL('@/assets/placeholder.jpg', import.meta.url).href;
</script>

<template>
  <Card class="p-4 gap-4">
    <CardTitle>
      <H1>{{ bivouac.name }}</H1>
    </CardTitle>
    <CardContent class="flex flex-col md:flex-row gap-4 w-full p-0">
      <div class="left w-full md:w-[70%]">
        <!-- DESCRIPTION -->
        <H2>{{ t('description') }}</H2>
        <p class="mt-2 mb-4">
          {{ t('no_description_available') }}
        </p>

        <!-- IMAGES -->
        <H2>{{ t('images') }}</H2>
        <div class="flex overflow-x-auto gap-4 mt-4 mb-4 pb-2">
          <img
            :src="placeholder"
            :alt="`${bivouac.name} image`"
            class="rounded-sm object-cover shrink-0 w-1/2"
          />
          <img
            :src="placeholder"
            :alt="`${bivouac.name} image`"
            class="rounded-sm object-cover shrink-0 w-1/2"
          />
          <img
            :src="placeholder"
            :alt="`${bivouac.name} image`"
            class="rounded-sm object-cover shrink-0 w-1/2"
          />
        </div>

        <!-- PLAN -->
        <H2> {{ t('plan') }} </H2>
        <div class="flex flex-col lg:flex-row gap-4 my-4 justify-between">
          <!-- CALENDAR -->
          <Calendar
            v-model="date"
            class="rounded-md border shadow-sm"
            disable-days-outside-current-view
          />
          <div class="affluence-form w-full gap-4 flex flex-col">
            <!-- People -->
            <div class="flex flex-col lg:flex-row gap-2">
              <span class="flex items-center whitespace-nowrap">
                People going
              </span>
              <Select v-model="people">
                <SelectTrigger id="dropdown" class="w-full">
                  <SelectValue placeholder="1" />
                </SelectTrigger>
                <SelectContent align="center">
                  <div v-for="i in bivouac.capacity" :key="i">
                    <SelectItem :value="i">{{ i }}</SelectItem>
                  </div>
                </SelectContent>
              </Select>
            </div>
            <!-- Confirm Button -->
            <Button> Send intention </Button>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDE -->
      <div class="right w-full md:w-[30%]">
        <!-- AFFLUENCE INFO -->
        <H2>{{ t('affluence') }}</H2>
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

        <!-- ADDITIONAL INFO -->
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
            <span class=""
              >{{ bivouac.comune }}, {{ bivouac.mountainRange }}</span
            >
          </div>
          <div class="icon-with-text">
            <HeartIcon
              :color="
                isFavorite(bivouac._id)
                  ? 'var(--primary)'
                  : 'var(--muted-foreground)'
              "
              :fill="
                isFavorite(bivouac._id) ? 'var(--primary)' : 'var(--background)'
              "
              class="transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
              :aria-label="t('toggle_favorite')"
              role="button"
              :aria-pressed="isFavorite(bivouac._id) ? 'true' : 'false'"
              @click="toggleFavorite(bivouac._id)"
            />
            <span class="value">{{
              isFavorite(bivouac._id) ? t('saved') : t('unsaved')
            }}</span>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter></CardFooter>
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
  font-size: 1rem;
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
    "saved": "Saved",
    "unsaved": "Unsaved",
    "location": "Location",
    "likes": "Likes",
    "toggle_favorite": "Toggle favorite",
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
    "saved": "Salvato",
    "unsaved": "Non salvato",
    "location": "Posizione",
    "likes": "Mi piace",
    "toggle_favorite": "Attiva/disattiva preferito",
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
    "saved": "Guardado",
    "unsaved": "No guardado",
    "likes": "Me gusta",
    "toggle_favorite": "Alternar favorito",
    "images": "Imágenes",
    "explain_plan_functionality": "Aquí puedes expresar la intención de ir a un bivouac y saber cuántas
        personas han expresado la intención de ir al mismo bivouac en los
        varios días."
  }
}
</i18n>
