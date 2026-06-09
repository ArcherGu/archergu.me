<script setup lang='ts'>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const isHome = computed(() => route.path === '/')
const showIcp = import.meta.env.VITE_ENABLE_ICP === 'true'
</script>

<template>
  <div
    class="mt-10 mb-6 prose m-auto opacity-70" :class="{
      'text-center': isHome,
    }"
  >
    <span class="text-sm">
      <a
        target="_blank"
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        style="color: inherit"
      >CC BY-NC-SA 4.0</a>
      2021 © Archer Gu
      <template v-if="showIcp">
        <br>
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
        >浙ICP备2026040669号-1</a>
      </template>
    </span>
  </div>
</template>
