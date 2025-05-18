<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useJokesStore } from '@/stores/jokes.ts'
import { useJokeTypesStore } from '@/stores/jokeTypes.ts'

const store = useJokesStore()
const jokeTypesStore = useJokeTypesStore()

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedLikeStatus = ref('all')

// Fetch joke types on the component mount
onMounted(async () => {
  await jokeTypesStore.getJokeTypes()
})

watch(searchQuery, (newValue) => {
  store.setSearchQuery(newValue)
})

function handleCategoryChange(value: string) {
  selectedCategory.value = value
  store.setCategory(value)
}

function handleLikeStatusChange(value: string) {
  selectedLikeStatus.value = value
  store.setLikeStatus(value)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
    <div class="relative flex-1 ">
      <Icon icon="tabler:search" class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        v-model="searchQuery"
        type="search"
        placeholder="Search jokes..."
        class="pl-8 bg-white"
      />
    </div>

    <Sheet>
      <SheetTrigger as-child>
        <Button variant="outline" size="icon" class="hover:cursor-pointer">
          <Icon icon="tabler:filter" class="h-4 w-4" />
          <span class="sr-only">Filter</span>
        </Button>
      </SheetTrigger>
      <SheetContent class="p-4">
        <SheetHeader>
          <SheetTitle class="font-bold text-xl">
            Filters
          </SheetTitle>
          <SheetDescription>Filter jokes by category and like status</SheetDescription>
        </SheetHeader>

        <div class="space-y-6 px-4">
          <div class="space-y-2">
            <h3 class="text-sm font-medium">
              Category
            </h3>
            <Select v-model="selectedCategory" @update:model-value="(val) => handleCategoryChange(val as string)">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Categories
                </SelectItem>
                <SelectItem v-for="type in jokeTypesStore.types" :key="type" :value="type">
                  {{ type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ') }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <h3 class="text-sm font-medium">
              Like Status
            </h3>
            <Select v-model="selectedLikeStatus" @update:model-value="val => handleLikeStatusChange(val as string)">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Filter by likes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Jokes
                </SelectItem>
                <SelectItem value="liked">
                  Liked Jokes
                </SelectItem>
                <SelectItem value="disliked">
                  Disliked Jokes
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<style scoped>

</style>
