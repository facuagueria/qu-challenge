<script setup lang="ts">
import { Icon } from '@iconify/vue'
import JokeCard from '@/components/jokes/JokeCard.vue'
import JokesFilter from '@/components/jokes/JokesFilter.vue'
import JokesPagination from '@/components/jokes/JokesPagination.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useJokesStore } from '@/stores/jokes.ts'

const store = useJokesStore()
</script>

<template>
  <div class="flex flex-col gap-10">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          Jokes App
        </h1>
        <p class="text-muted-foreground w-1/2">
          Browse through our collection of jokes and find something to brighten your day!
        </p>
      </div>

      <div class="flex flex-wrap gap-2 w-full sm:w-auto justify-end self-start">
        <Button class="hover:cursor-pointer">
          <Icon icon="tabler:plus" height="16" width="16" />
          Add Joke
        </Button>

        <Button
          class="hover:cursor-pointer"

          :disabled="store.isLoading"
          variant="outline" @click="store.getJokes()"
        >
          <Icon icon="tabler:refresh" height="16" width="16" :class="{ 'animate-spin': store.isLoading }" />

          Fetch Random Jokes
        </Button>
      </div>
    </div>

    <JokesFilter />
  </div>

  <div class="mt-6 space-y-4">
    <JokeCard
      v-for="joke in store.paginatedJokes"
      :key="joke.id"
      :joke
      @like="store.likeJoke"
      @dislike="store.dislikeJoke"
    />
  </div>

  <Card v-if="store.paginatedJokes.length > 0" class="mt-6 border-dashed">
    <CardContent class="flex items-center justify-center">
      <p class="text-sm text-muted-foreground">
        Showing {{ store.jokeRange.start }} - {{ store.jokeRange.end }} of {{ store.filteredJokes.length }} jokes
      </p>
    </CardContent>
  </Card>

  <Card v-else>
    <CardContent class="p-6 flex flex-col items-center justify-center">
      <p class="text-lg font-medium">
        No jokes found
      </p>
      <p class="text-sm text-muted-foreground mt-1">
        Try adjusting your search or filters
      </p>
      <div class="flex flex-wrap gap-2 mt-4">
        <Button class="hover:cursor-pointer">
          <Icon icon="tabler:plus" class="h-4 w-4" />
          Add a joke
        </Button>

        <Button
          variant="outline"
          class="hover:cursor-pointer"
          :disabled="store.isLoading"
          @click="store.getJokes()"
        >
          <Icon icon="tabler:refresh" class="h-4 w-4" :class="{ 'animate-spin': store.isLoading }" />
          Fetch Random Jokes
        </Button>
      </div>
    </CardContent>
  </Card>

  <JokesPagination
    :current-page="store.currentPage"
    :total-pages="store.totalPages"
    :items-per-page="store.itemsPerPage"
    :total-items="store.filteredJokes.length"
    @page-change="store.handlePageChange"
  />
</template>
