<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import Calendar from '@/components/ui/calendar/Calendar.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
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
import { placeholderEmpty } from '@/services/placeholders';
import { useBivouacStore } from '@/stores/bivouacs';
// todo: change to type from '@/types' when store is updated
import { useFavoriteStore } from '@/stores/favorites';
import {
  useIntentionStore,
  type AnonymousIntention,
} from '@/stores/intentions';
import type { Bivouac, Intention } from '@/types';
import {
  fromDate,
  getLocalTimeZone,
  type DateValue,
} from '@internationalized/date';
import {
  Bed as BedIcon,
  CalendarIcon,
  Circle,
  Heart as HeartIcon,
  MapPin as MapPinIcon,
  Mountain as MountainIcon,
  Send,
  Toilet as ToiletIcon,
  X,
} from 'lucide-vue-next';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';
import 'vue-sonner/style.css';
const { t } = useI18n();

const props = defineProps<{ id: string }>();
const bivouacStore = useBivouacStore();
const favoritesStore = useFavoriteStore();
const intentionStore = useIntentionStore();

const bivouac = ref<Bivouac>();
const minDate = fromDate(new Date(), getLocalTimeZone());
const bivouacsIntentions = ref<AnonymousIntention[]>([]);
const userBivouacIntentions = ref<Intention[]>([]);

const reducedBivouacIntentions = computed(() => {
  const grouped = bivouacsIntentions.value.reduce(
    (acc: AnonymousIntention[], curr: AnonymousIntention) => {
      const date = new Date(curr.date).toDateString();
      const existing = acc.find(
        (item) => new Date(item.date).toDateString() === date
      );
      if (existing) {
        existing.people += curr.people;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    },
    []
  );

  return Object.values(grouped).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
});

async function updateIntentions() {
  await intentionStore.fetchUserIntentions();
  userBivouacIntentions.value = intentionStore.userIntentions.filter(
    (intention) => intention.bivouac === props.id
  );
  bivouacsIntentions.value = (
    await intentionStore.fetchAnonymousBivouacIntentions(props.id)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

const sendIntention = async () => {
  const res = await intentionStore.sendIntention(
    bivouac.value?._id || '',
    selectedDate.value.toDate(getLocalTimeZone()),
    people.value
  );
  if (res.success) {
    toast.success(res.message ? res.message : 'Intention sent successfully!');
    await updateIntentions();
  } else {
    toast.error(`Error: ${res.error}`);
  }
};

const cancelIntention = async (intentionId: string) => {
  const res = await intentionStore.deleteIntention(intentionId);
  if (res.success) {
    toast.success(
      res.message ? res.message : 'Intention cancelled successfully!'
    );
    await updateIntentions();
  } else {
    toast.error(`Error: ${res.error}`);
  }
};

const people = ref<number>(1);
const selectedDate = ref(
  fromDate(new Date(), getLocalTimeZone())
) as Ref<DateValue>;

onMounted(async () => {
  try {
    bivouac.value = await bivouacStore.getBivouacById(props.id);
  } catch (error) {
    console.error('Error fetching bivouac:', error);
  }

  try {
    await updateIntentions();
  } catch (error) {
    console.error('Error fetching bivouac intentions:', error);
  }

  const images = bivouac.value?.images || [];
  /* const image0 = routesImages[0];
      const imgData = fs.readFileSync(path.join(process.cwd(), image0));
      route.images = [
        {
          data: imgData,
          contentType: 'image/jpeg',
        },
      ];
      routesImages.push(...routesImages.slice(1));
      return route;
      */
});
</script>

<template>
  <Card class="p-4 gap-4">
    <CardTitle>
      <H1>{{ bivouac?.name }}</H1>
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
            v-for="i in 5"
            :src="placeholderEmpty"
            :alt="`${bivouac?.name} image`"
            class="rounded-sm object-cover shrink-0 w-1/2"
          />
        </div>

        <!-- PLAN -->
        <H2> {{ t('plan') }} </H2>
        <div class="flex flex-col lg:flex-row gap-4 my-4 justify-between">
          <!-- CALENDAR -->
          <Calendar
            v-model="selectedDate"
            class="rounded-md border shadow-sm w-full [&_table]:w-full [&_tr]:justify-evenly"
            :min-value="minDate"
            disable-days-outside-current-view
          />
          <div class="affluence-form w-full gap-4 flex flex-col">
            <!-- People -->
            <div class="flex flex-col lg:flex-row gap-2">
              <span class="flex items-center whitespace-nowrap">
                {{ t('people_going') }}:
              </span>
              <Select v-model="people">
                <SelectTrigger id="dropdown" class="w-full">
                  <SelectValue placeholder="{{ people }}" />
                </SelectTrigger>
                <SelectContent align="center">
                  <div v-for="i in bivouac?.capacity" :key="i">
                    <SelectItem :value="i">{{ i }}</SelectItem>
                  </div>
                </SelectContent>
              </Select>
            </div>

            <!-- Confirm Button -->
            <Button @click="sendIntention">
              <Send />
              {{ t('send_intention') }}
            </Button>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDE -->
      <div class="right w-full md:w-[30%]">
        <!-- MY INTENTIONS -->
        <H2>{{ t('my_programs') }}</H2>
        <div
          class="flex flex-col gap-4 my-4"
          v-if="userBivouacIntentions.length > 0"
        >
          <div v-for="intention in userBivouacIntentions" :key="intention._id">
            <div class="icon-with-text">
              <CalendarIcon class="icon" />
              <span class="">
                {{ new Date(intention.reservationDate).toDateString() }} for
                {{ intention.reservedPlaces }} people.
              </span>
              <Button
                class="rounded-full cursor-pointer"
                variant="destructive"
                size="sm"
                :style="{ width: '1.5rem', height: '1.5rem' }"
                @click="cancelIntention(intention._id || '')"
              >
                <X class="icon" />
              </Button>
            </div>
          </div>
        </div>
        <div v-else>
          <span>{{ t('explain_your_intentions') }}</span>
        </div>

        <!-- AFFLUENCE INFO -->
        <H2 class="mt-4">{{ t('affluence') }}</H2>
        <div
          class="flex flex-col gap-4 my-4"
          v-if="bivouacsIntentions.length > 0"
        >
          <div v-for="intention in reducedBivouacIntentions">
            <div class="icon-with-text">
              <span class="date_icon">
                <Circle class="icon" />
                {{ new Date(intention.date).toDateString() }}:
                {{ intention.people }}/{{ bivouac?.capacity }}
                people.
              </span>
            </div>
          </div>
        </div>
        <div v-else>
          <span>{{ t('explain_other_intentions') }}</span>
        </div>

        <!-- ADDITIONAL INFO -->
        <H2 class="mt-4">{{ t('additional_info') }}</H2>
        <div class="flex flex-col gap-4 my-4">
          <div class="icon-with-text">
            <MountainIcon class="icon" />
            <span class="">{{ bivouac?.altitude }} mt </span>
          </div>
          <div class="icon-with-text">
            <BedIcon class="icon" />
            <span>{{ bivouac?.capacity }} {{ t('beds') }}</span>
          </div>
          <div class="icon-with-text">
            <ToiletIcon class="icon" /><span class="">N/A Info</span>
          </div>
          <div class="icon-with-text">
            <MapPinIcon class="icon" />
            <span class=""
              >{{ bivouac?.comune }}, {{ bivouac?.mountainRange }}</span
            >
          </div>
          <div class="icon-with-text">
            <HeartIcon
              :color="
                favoritesStore.isFavoriteBivouac(props.id)
                  ? 'var(--primary)'
                  : 'var(--muted-foreground)'
              "
              :fill="
                favoritesStore.isFavoriteBivouac(props.id)
                  ? 'var(--primary)'
                  : 'var(--background)'
              "
              class="transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
              :aria-label="t('toggle_favorite')"
              role="button"
              :aria-pressed="
                favoritesStore.isFavoriteBivouac(props.id) ? 'true' : 'false'
              "
              @click="favoritesStore.toggleFavoriteBivouac(props.id)"
            />
            <span class="value">{{
              favoritesStore.isFavoriteBivouac(props.id)
                ? t('saved')
                : t('unsaved')
            }}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
.icon-with-text {
  /* transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 */
  transition: all 0.3s;
  cursor: pointer;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  min-width: 1.25rem;
  min-height: 1.25rem;
}

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
    "no_description_available": "No description available.",
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
    "people_going": "People going",
    "send_intention": "Send intention",
    "explain_plan_functionality": "Here you can express the intention to go to a bivouac and know how many
        people have expressed the intention to go to the same bivouac on the
        various days.",
    "explain_your_intentions": "You have not expressed any intentions yet. Use the form above to plan your visit.",
    "explain_other_intentions": "No one has expressed intentions yet. Be the first to plan your visit!",
    "my_programs": "My programs"
  },
  "it": {
    "description": "Descrizione",
    "additional_info": "Informazioni aggiuntive",
    "affluence": "Affluenza",
    "no_description_available": "Nessuna descrizione disponibile.",
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
    "people_going": "Persone che vanno",
    "send_intention": "Invia intenzione",
    "explain_plan_functionality": "Qui puoi esprimere l'intenzione di andare in un bivacco e sapere quante
        persone hanno espresso l'intenzione di andare nello stesso bivacco nei
        vari giorni.",
    "explain_your_intentions": "Non hai ancora espresso intenzioni. Usa il modulo sopra per pianificare la tua visita.",
    "explain_other_intentions": "Nessuno ha ancora espresso intenzioni. Sii il primo a pianificare la tua visita!",
    "my_programs": "I miei programmi"
  },
  "es": {
    "description": "Descripción",
    "additional_info": "Información adicional",
    "affluence": "Afluencia",
    "no_description_available": "No hay descripción disponible.",
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
    "people_going": "Personas que van",
    "send_intention": "Enviar intención",
    "explain_plan_functionality": "Aquí puedes expresar la intención de ir a un bivouac y saber cuántas
        personas han expresado la intención de ir al mismo bivouac en los
        varios días.",
    "explain_your_intentions": "Aún no has expresado intenciones. Usa el formulario de arriba para planificar tu visita.",
    "explain_other_intentions": "Nadie ha expresado intenciones todavía. ¡Sé el primero en planificar tu visita!",
    "my_programs": "Mis programas"
  }
}
</i18n>
