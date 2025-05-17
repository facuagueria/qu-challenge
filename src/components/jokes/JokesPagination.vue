<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

defineProps<{
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
}>()

defineEmits<{
  (e: 'pageChange', page: number): void
}>()
</script>

<template>
  <Pagination
    v-slot="{ page }"
    class="flex items-center justify-center space-x-2 py-4"
    :items-per-page="itemsPerPage"
    :total="totalItems"
    :default-page="currentPage"
    @update:page="$emit('pageChange', $event)"
  >
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious class="hover:cursor-pointer" />

      <template v-for="(item, index) in items" :key="index">
        <PaginationItem
          v-if="item.type === 'page'"
          :value="item.value"
          :is-active="item.value === page"
          class="hover:cursor-pointer"
        >
          {{ item.value }}
        </PaginationItem>
      </template>

      <PaginationNext class="hover:cursor-pointer" />
    </PaginationContent>
  </Pagination>
</template>
