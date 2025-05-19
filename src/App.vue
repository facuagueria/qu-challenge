<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <main class="min-h-screen bg-gray-50">
    <Toaster rich-colors />

    <RouterView />
  </main>
</template>
