<script setup lang="ts">
import type { Joke } from '@/types/Joke.ts'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useJokeTypesStore } from '@/stores/jokeTypes.ts'

defineProps<{
  isOpen: boolean
}>()

const emits = defineEmits<{
  (e: 'addJoke', joke: Joke): void
  (e: 'setIsAddDialogOpen', open: boolean): void
}>()

const jokeTypesStore = useJokeTypesStore()

const formSchema = toTypedSchema(z.object({
  setup: z
    .string()
    .min(3, {
      message: 'Setup must be at least 3 characters.',
    })
    .max(50, {
      message: 'Setup must not exceed 50 characters.',
    }),
  punchline: z
    .string()
    .min(10, {
      message: 'Punchline text must be at least 10 characters.',
    })
    .max(500, {
      message: 'Punchline text must not exceed 500 characters.',
    }),
  category: z.string({
    required_error: 'Please select a category.',
  }),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  const newJoke = {
    id: Date.now(),
    type: values.category,
    setup: values.setup,
    punchline: values.punchline,
    isLiked: true,
  }

  emits('addJoke', newJoke)
  emits('setIsAddDialogOpen', false)
})
</script>

<template>
  <Dialog :open="isOpen" :on-open-change="() => emits('setIsAddDialogOpen', !isOpen)">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Add a new joke</DialogTitle>
        <DialogDescription>
          Fill out the form below to add a new joke to the collection. Your joke will be liked by default.
        </DialogDescription>
      </DialogHeader>
      <form class="space-y-6" @submit="onSubmit">
        <FormField
          v-slot="{ componentField }"
          name="setup"
        >
          <FormItem>
            <FormLabel>Setup</FormLabel>
            <FormControl>
              <Input placeholder="Enter a catchy setup" v-bind="componentField" />
            </FormControl>
            <FormDescription>A short, descriptive setup for your joke.</FormDescription>
            <FormMessage />
          </FormItem>

          <FormField
            v-slot="{ componentField }"
            name="punchline"
          >
            <FormItem>
              <FormLabel>Punchline</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your punchline here..." class="min-h-[100px]" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                The full text of your punchline.
              </FormDescription>
              <FormMessage />
            </FormItem>

            <FormField
              v-slot="{ componentField }"
              name="category"
            >
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem v-for="type in jokeTypesStore.types" :key="type" :value="type">
                      {{ type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ') }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select the category that best fits your joke.</FormDescription>
                <FormMessage />
              </FormItem>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  class="cursor-pointer"
                  @click="() => emits('setIsAddDialogOpen', false)"
                >
                  Cancel
                </Button>
                <Button type="submit" class="cursor-pointer">
                  Add Joke
                </Button>
              </DialogFooter>
            </formfield>
          </formfield>
        </formfield>
      </form>
    </DialogContent>
  </Dialog>
</template>
