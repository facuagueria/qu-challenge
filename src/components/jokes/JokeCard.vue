<script setup lang="ts">
import type { Joke } from '@/types/Joke.ts'
import { Icon } from '@iconify/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

defineProps<{
  joke: Joke
}>()

function handleLike() {}
function handleDislike() {}
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
          @click="handleLike"
        >
          <Icon icon="tabler:thumb-up" class="h-4 w-4" />
        </Button>
        <Button
          :variant="joke.isLiked === false ? 'default' : 'ghost'"
          size="sm"
          :class="{ 'bg-red-600 hover:bg-red-700': joke.isLiked === false }"
          class="hover:cursor-pointer"
          @click="handleDislike"
        >
          <Icon icon="tabler:thumb-down" class="h-4 w-4" />
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
