<template>
    <div class="title text-lg blog-item">
        {{ frontmatter.title }}
        <sup
            v-if="titleBadge"
            class="text-xs border border-current rounded px-1 pb-0.2 ml-1"
            :style="{ borderColor: titleBadge.color, color: titleBadge.color }"
        >{{ titleBadge.name }}</sup>
    </div>
    <div class="time opacity-80 text-sm -mt-1">
        {{ formatDate(frontmatter.date) }}
        <span v-if="frontmatter.duration" class="opacity-80">
            ·
            {{ frontmatter.duration }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { formatDate } from "@/utils";
import { computed } from "vue";
import type { RouteRecordNormalized } from "vue-router";

const props = defineProps<{
    route: RouteRecordNormalized
}>()

const frontmatter = computed(() => (props.route.meta as any).frontmatter);

const titleBadge = computed(() => {
    let { badge, badgeColor } = frontmatter.value;
    if (badge) {
        return {
            name: badge.trim(),
            color: badgeColor ? `${badgeColor.trim()}` : 'currentcolor'
        }
    }

    return null
})
</script>