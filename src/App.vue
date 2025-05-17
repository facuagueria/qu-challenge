<script setup lang="ts">
import { useFetch } from '@vueuse/core'

const { isFetching, error, data } = useFetch('http://localhost:3005/types')
</script>

<template>
  <main class="min-h-screen bg-gray-50">
    <RouterView />
  </main>
</template>
