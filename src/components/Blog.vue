<script setup lang='ts'>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { isClient, useEventListener } from '@vueuse/core'
import { formatDate } from '@/utils'

const { frontmatter } = defineProps<{ frontmatter: any }>()
const route = useRoute()
const tags = computed(() => {
  const { tags } = frontmatter
  let { tagsColor } = frontmatter
  if (tags && Array.isArray(tags)) {
    tagsColor = Array.isArray(tagsColor) ? tagsColor : []

    return tags.map((e: any, i: number) => ({
      name: e.trim(),
      color: tagsColor[i] ? `${tagsColor[i].trim()}` : 'currentcolor',
    }))
  }

  return []
})

if (isClient) {
  const navigate = () => {
    if (location.hash) {
      document.querySelector(decodeURIComponent(location.hash))
        ?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEventListener(window, 'hashchange', navigate, false)

  onMounted(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault()
        const href = anchor.getAttribute('href') as string
        history.replaceState({}, '', href)
        navigate()
      })
    })

    navigate()
    setTimeout(navigate, 500)
  })
}
</script>

<template>
  <div v-if="frontmatter.display ?? frontmatter.title" class="prose m-auto mb-8">
    <h1 class="mb-0">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>

    <p v-if="tags && tags.length > 0">
      <span
        v-for="tag in tags"
        :key="tag.name"
        class="text-md border border-current rounded px-1 pb-0.2 mb-0 mr-1"
        :style="{ borderColor: tag.color, color: tag.color }"
      >{{ tag.name }}</span>
    </p>

    <p v-if="frontmatter.date" class="opacity-60 !-mt-2">
      {{ formatDate(frontmatter.date) }}
      <span
        v-if="frontmatter.duration"
      >· {{ frontmatter.duration }}</span>
    </p>

    <p v-if="frontmatter.subtitle" class="opacity-70 !-mt-6 italic">
      {{ frontmatter.subtitle }}
    </p>
  </div>
  <slot />
  <div v-if="route.path !== '/'" class="prose m-auto mt-8 mb-8">
    <router-link
      :to="route.path.split('/').slice(0, -1).join('/') || '/'"
      class="font-mono no-underline opacity-50 hover:opacity-75"
    >
      cd ..
    </router-link>
  </div>
</template>
