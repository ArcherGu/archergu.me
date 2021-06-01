<template>
    <div class="mt-10 mb-6 prose m-auto opacity-70" :class="isCenter ? 'text-center' : ''">
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

<script setup lang='ts'>
import { computed } from 'vue';
import { useRoute } from 'vue-router'
const route = useRoute();
const isCenter = computed(() => route.path === '/')
</script>
