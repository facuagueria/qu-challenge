<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

defineProps<{
  isOpen: boolean
  isDisabledButton: boolean
}>()

const emits = defineEmits<{
  (e: 'deleteAll'): void
  (e: 'setIsDeleteDialogOpen', open: boolean): void
}>()
</script>

<template>
  <AlertDialog :open="isOpen" :on-open-change="() => emits('setIsDeleteDialogOpen', !isOpen)">
    <AlertDialogTrigger as-child>
      <Button
        :disabled="isDisabledButton"
        variant="outline"
        class="hover:cursor-pointer text-red-500 border-red-500 hover:text-red-600 hover:border-red-600"
        @click="() => emits('setIsDeleteDialogOpen', true)"
      >
        <Icon icon="tabler:trash" height="16" width="16" />

        Delete all
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete all the jokes. This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class="flex items-center gap-4">
        <AlertDialogCancel class="hover:cursor-pointer" @click="() => emits('setIsDeleteDialogOpen', false)">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          class="bg-red-500 hover:bg-red-600 hover:cursor-pointer"
          @click="() => emits('deleteAll')"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
