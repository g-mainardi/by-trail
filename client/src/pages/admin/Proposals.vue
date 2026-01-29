<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAdminStore } from '@/stores/admin';
import { storeToRefs } from 'pinia';

import DataTable from '@/components/ui/data-table/DataTable.vue';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-vue-next';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import { AlertCircle, CheckCircle } from 'lucide-vue-next';
import { Alert, AlertTitle } from '@/components/ui/alert';
import type { Proposal } from '@by-trail/shared';
import ProposalActions from './ProposalActions.vue';

const { t, locale } = useI18n();
const adminStore = useAdminStore();
const { proposals, isLoading } = storeToRefs(adminStore);
const { fetchProposals, deleteProposal } = adminStore;
const feedbackMessage = ref('');
const isError = ref(false);

onMounted(() => {
  fetchProposals();
});

const columns = [
  { accessorKey: 'subjectName', header: t('subject_name') },
  { accessorKey: 'senderEmail', header: t('sender_email') },
  { accessorKey: 'type', header: t('type') },
  { accessorKey: 'region', header: t('region') },
  { accessorKey: 'locality', header: t('locality') },
  { accessorKey: 'submissionDate', header: t('submission_date') },
  { accessorKey: 'description', header: t('description') },
  { accessorKey: 'actions', header: t('actions') },
];

const onDeleteProposal = async (proposal: Proposal) => {
  const id = proposal._id;
  try {
    if (!id) return;
    const confirmed = confirm(t('confirm_delete'));
    if (!confirmed) return;
    const success = await deleteProposal(id);
    if (!success) throw new Error('Deletion failed');
  } catch (e) {
    feedbackMessage.value = t('proposal_delete_error');
    isError.value = true;
    return;
  }
  feedbackMessage.value = t('proposal_delete_success');
  isError.value = false;
};

const alertConfig = computed(() => {
  if (isError.value) {
    return {
      variant: 'destructive' as const,
      icon: AlertCircle,
    };
  }
  return {
    variant: 'success' as const,
    icon: CheckCircle,
  };
});
</script>

<template>
  <div class="space-y-4">
    <Spinner v-if="isLoading" />
    <Alert
      v-else-if="feedbackMessage"
      :variant="alertConfig.variant"
      class="mb-6"
    >
      <component :is="alertConfig.icon" />
      <AlertTitle>{{ feedbackMessage }}</AlertTitle>
    </Alert>

    <DataTable :columns="columns" :data="proposals" search-key="subjectName">
      <template #header-subjectName="{ column }">
        <Button
          variant="ghost"
          class="pl-0 hover:bg-transparent"
          @click="column.toggleSorting(column.getIsSorted() === 'asc')"
        >
          {{ t('subject_name') }}
          <ArrowUpDown class="ml-2 h-4 w-4" />
        </Button>
      </template>

      <template #cell-subjectName="{ row }">
        <div class="font-medium pl-4">{{ row.subjectName }}</div>
      </template>

      <template #cell-senderEmail="{ row }">
        <a
          v-if="row.senderEmail"
          :href="`mailto:${row.senderEmail}`"
          class="text-blue-600 hover:underline"
          >{{ row.senderEmail }}</a
        >
        <span v-else class="text-muted-foreground">-</span>
      </template>

      <template #cell-type="{ row }">
        <span
          class="capitalize badge badge-outline px-2 py-1 rounded-full text-xs bg-secondary"
          :class="row.type"
        >
          {{ row.type }}
        </span>
      </template>

      <template #cell-submissionDate="{ row }">
        <span class="text-xs text-muted-foreground">{{
          row.submissionDate
            ? new Date(row.submissionDate).toLocaleDateString(
                ['it', 'es'].includes(locale) ? 'it-IT' : 'en-US',
                {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }
              )
            : '-'
        }}</span>
      </template>

      <template #cell-actions="{ row }">
        <ProposalActions
          :proposal="{
            ...row,
            id: row._id || '',
            email: row.senderEmail,
          }"
          @delete="onDeleteProposal(row)"
        />
      </template>
    </DataTable>
  </div>
</template>
<style scoped>
.route {
  background-color: var(--primary-2);
}
</style>
<i18n>
{
  "en": {
    "subject_name": "Subject Name",
    "sender_email": "Sender Email",
    "type": "Type",
    "region": "Region",
    "locality": "Locality",
    "submission_date": "Submission Date",
    "description": "Description",
    "actions": "Actions",
    "confirm_delete": "Are you sure you want to delete this proposal?",
    "proposal_delete_success": "Proposal deleted successfully.",
    "proposal_delete_error": "An error occurred while deleting the proposal."
  },
  "it": {
    "subject_name": "Nome Soggetto",
    "sender_email": "Email Mittente",
    "type": "Tipo",
    "region": "Regione",
    "locality": "Località",
    "submission_date": "Data di Invio",
    "description": "Descrizione",
    "actions": "Azioni",
    "confirm_delete": "Sei sicuro di voler eliminare questa proposta?",
    "proposal_delete_success": "Proposta eliminata con successo.",
    "proposal_delete_error": "Si è verificato un errore durante l'eliminazione della proposta."
  },
  "es": {
    "subject_name": "Nombre del Sujeto",
    "sender_email": "Correo del Remitente",
    "type": "Tipo",
    "region": "Región",
    "locality": "Localidad",
    "submission_date": "Fecha de Envío",
    "description": "Descripción",
    "actions": "Acciones",
    "confirm_delete": "¿Estás seguro de que deseas eliminar esta propuesta?",
    "proposal_delete_success": "Propuesta eliminada con éxito.",
    "proposal_delete_error": "Ocurrió un error al eliminar la propuesta."
  } 
}
</i18n>
