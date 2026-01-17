<script setup lang="ts" generic="TData, TValue">
import { ref } from 'vue';
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  FlexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/vue-table';
import { useI18n } from 'vue-i18n';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
const { t } = useI18n();

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
}>();

const sorting = ref<SortingState>([]);

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() {
      return sorting.value;
    },
  },
  onSortingChange: (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => {
    sorting.value =
      typeof updater === 'function' ? updater(sorting.value) : updater;
  },
});
</script>

<template>
  <div class="space-y-4">
    <div v-if="searchKey" class="flex items-center py-4">
      <Input
        class="max-w-sm"
        :placeholder="t('search_for') + searchKey + '...'"
        :model-value="table.getColumn(searchKey)?.getFilterValue() as string"
        @update:model-value="table.getColumn(searchKey)?.setFilterValue($event)"
      />
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <slot
                v-if="
                  !header.isPlaceholder && $slots[`header-${header.column.id}`]
                "
                :name="`header-${header.column.id}`"
                :column="header.column"
              />

              <FlexRender
                v-else-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <slot
                  v-if="$slots[`cell-${cell.column.id}`]"
                  :name="`cell-${cell.column.id}`"
                  :row="row.original"
                  :value="cell.getValue()"
                />

                <FlexRender
                  v-else
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                {{ t('no_results') }}
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanNextPage()"
        @click="table.nextPage()"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
<i18n>
{
  "en": {
    "search_for": "Search for ",
    "no_results": "No results."
  },
  "it": {
    "search_for": "Cerca per ",
    "no_results": "Nessun risultato."
  },
  "es": {
    "search_for": "Buscar por ",
    "no_results": "No hay resultados."
  }
}
</i18n>
