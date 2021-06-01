<template>
    <div class="title text-lg blog-item">
        {{ frontmatter.title }}
        <sup
            v-for="tag in tags"
            class="text-xs border border-current rounded px-1 pb-0.2 ml-1"
            :style="{ borderColor: tag.color, color: tag.color }"
        >{{ tag.name }}</sup>
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
import { computed, defineProps } from "vue";
import type { RouteRecordNormalized } from "vue-router";

const props = defineProps<{
    route: RouteRecordNormalized
}>()

const frontmatter = computed(() => (props.route.meta as any).frontmatter);

const tags = computed(() => {
    let tags = []
    if (frontmatter.value.lang === 'zh') {
        tags.push({
            name: 'zh',
            color: 'currentcolor'
        });
    }

    if (frontmatter.value.tags) {
        let colors: string[] = [];
        if (frontmatter.value.tagsColor) {
            colors = frontmatter.value.tagsColor.split(',');
        }

        frontmatter.value.tags.split(',').forEach((e: any, i: number) => {
            tags.push({
                name: e.trim(),
                color: colors[i] ? `#${colors[i].trim()}` : 'currentcolor'
            })
        });
    }

    return tags
})

</script>

<style>
.blog-item sup:first-child {
    margin-left: 0;
}
</style>