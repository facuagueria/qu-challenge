<script setup lang="ts">
import type { Joke } from '@/types/Joke.ts'
import { Icon } from '@iconify/vue'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

defineProps<{
  joke: Joke
  isOpen: boolean
}>()

const emits = defineEmits<{
  (e: 'delete', id: number): void
  (e: 'setIsDeleteDialogOpen', open: boolean): void
}>()
</script>

<template>
  <AlertDialog :open="isOpen" :on-open-change="() => emits('setIsDeleteDialogOpen', !isOpen)">
    <AlertDialogTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="text-red-500 hover:text-red-600 hover:bg-red-50 hover:cursor-pointer"
        @click="() => emits('setIsDeleteDialogOpen', true)"
      >
        <Icon icon="tabler:trash" class="h-4 w-4" />
        <span class="sr-only">Delete joke</span>
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete the joke "{{ joke.setup }}". This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class="flex items-center gap-4">
        <AlertDialogCancel class="hover:cursor-pointer" @click="() => emits('setIsDeleteDialogOpen', false)">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          class="bg-red-500 hover:bg-red-600 hover:cursor-pointer"
          @click="() => emits('delete', joke.id)"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
