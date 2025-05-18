<script setup lang="ts">
import type { Joke } from '@/types/Joke.ts'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import JokeDelete from '@/components/jokes/JokeDelete.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useJokesStore } from '@/stores/jokes.ts'

defineProps<{
  joke: Joke
}>()

const emits = defineEmits<{
  (e: 'like', jokeId: number): void
  (e: 'dislike', jokeId: number): void
}>()

function handleLike(jokeId: number) {
  emits('like', jokeId)
}

function handleDislike(jokeId: number) {
  emits('dislike', jokeId)
}

const jokesStore = useJokesStore()
const isDeleteDialogOpen = ref<boolean>(false)

function setIsDeleteDialogOpen(open: boolean) {
  isDeleteDialogOpen.value = open
}

function onDelete(jokeId: number) {
  // Only close the dialog if the joke was successfully removed
  const success = jokesStore.removeJoke(jokeId)
  if (success) {
    setIsDeleteDialogOpen(false)
  }
  else {
    console.error(`Failed to delete joke with ID: ${jokeId}`)
    // Keep the dialog open to allow the user to try again or cancel
  }
}
</script>

<template>
  <Card>
    <CardHeader class="pb-2">
      <div class="flex justify-between items-start">
        <div>
          <CardTitle class="text-lg">
            {{ joke.setup }}
          </CardTitle>
          <div class="flex items-center gap-2 mt-1">
            <Badge variant="outline">
              {{ joke.type }}
            </Badge>
          </div>
        </div>

        <JokeDelete
          :joke
          :is-open="isDeleteDialogOpen"
          @set-is-delete-dialog-open="setIsDeleteDialogOpen"
          @delete="onDelete"
        />
      </div>
    </CardHeader>
    <CardContent>
      <p class="whitespace-pre-line">
        {{ joke.punchline }}
      </p>
    </CardContent>
    <CardFooter class="flex justify-between border-t pt-4">
      <div class="flex gap-2">
        <Button
          :variant="joke.isLiked === true ? 'default' : 'ghost'"
          size="sm"
          :class="{ 'bg-green-600 hover:bg-green-700': joke.isLiked === true }"
          class="hover:cursor-pointer"
          @click="() => handleLike(joke.id)"
        >
          <Icon icon="tabler:thumb-up" class="h-4 w-4" />
        </Button>
        <Button
          :variant="joke.isLiked === false ? 'default' : 'ghost'"
          size="sm"
          :class="{ 'bg-red-600 hover:bg-red-700': joke.isLiked === false }"
          class="hover:cursor-pointer"
          @click="() => handleDislike(joke.id)"
        >
          <Icon icon="tabler:thumb-down" class="h-4 w-4" />
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
