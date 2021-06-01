<template>
    <ul>
        <router-link
            v-for="route in routes"
            :key="route.path"
            class="item block font-normal mb-6 mt-2 no-underline"
            :to="route.path"
        >
            <li class="no-underline">
                <div class="title text-lg">
                    {{ getFrontmatter(route).title }}
                    <sup
                        v-if="getFrontmatter(route).lang === 'zh'"
                        class="text-xs border border-current rounded px-1 pb-0.2"
                    >zh</sup>
                </div>
                <div class="time opacity-80 text-sm -mt-1">
                    {{ formatDate(getFrontmatter(route).date) }}
                    <span
                        v-if="getFrontmatter(route).duration"
                        class="opacity-80"
                    >
                        ·
                        {{ getFrontmatter(route).duration }}
                    </span>
                </div>
            </li>
        </router-link>
    </ul>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { formatDate } from "@/utils";

const getFrontmatter = (route: any) => {
    return (route.meta as any).frontmatter;
};

const router = useRouter();
const routes = router
    .getRoutes()
    .filter((i) => i.path.startsWith("/posts") && getFrontmatter(i).date)
    .sort(
        (a, b) =>
            +new Date(getFrontmatter(b).date) -
            +new Date(getFrontmatter(a).date)
    );
</script>