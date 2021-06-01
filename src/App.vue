<template>
    <NavBar />
    <main class="px-7 py-10">
        <router-view />
        <Footer />
    </main>
</template>

<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
    meta: [
        { property: "og:title", content: "Archer Gu" },
        { name: "description", content: "Archer Gu's Room" },
    ],
});
</script>
