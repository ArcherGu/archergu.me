<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  meta: [
    { property: 'og:title', content: 'Archer Gu' },
    { name: 'description', content: 'Archer Gu\'s Room' },
  ],
})
</script>

<template>
  <NavBar />
  <main class="site-main flex flex-col px-7 py-10">
    <div class="flex-1">
      <router-view />
    </div>
    <Footer />
  </main>
</template>

<style scoped>
.site-main {
  min-height: calc(100vh - 5rem);
  min-height: calc(100dvh - 5rem);
}
</style>
