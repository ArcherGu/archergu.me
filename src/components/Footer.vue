<script setup lang='ts'>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <div
    class="mt-10 mb-6 prose m-auto opacity-70" :class="{
      'home-footer': isHome,
    }"
  >
    <span class="text-sm">
      <a
        target="_blank"
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        style="color: inherit"
      >CC BY-NC-SA 4.0</a>
      2021 © Archer Gu
    </span>
  </div>
</template>

<style lang="scss" scoped>
.home-footer {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
