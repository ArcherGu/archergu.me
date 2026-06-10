<script setup lang='ts'>
const showIcp = import.meta.env.VITE_ENABLE_ICP === 'true'
</script>

<template>
  <div class="mt-10 prose m-auto opacity-70 text-center">
    <span class="text-sm">
      <a
        target="_blank"
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        style="color: inherit"
      >CC BY-NC-SA 4.0</a>
      2021 © Archer Gu
      <template v-if="showIcp">
        <br>
        <span class="inline-flex flex-col sm:flex-row sm:gap-3">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
          >浙ICP备2026040669号-1</a>
          <a
            class="inline-flex items-center justify-center gap-1"
            href="https://beian.mps.gov.cn/#/query/webSearch?code=33028102001924"
            rel="noreferrer"
            target="_blank"
          >
            <img
              alt=""
              class="inline-block h-4 w-auto !m-0"
              src="/beian-police.png"
            >
            <span>浙公网安备33028102001924号</span>
          </a>
        </span>
      </template>
    </span>
  </div>
</template>
