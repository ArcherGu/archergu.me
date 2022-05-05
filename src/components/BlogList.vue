<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  routeType?: 'posts' | 'drafts'
}
const {
  routeType = 'posts',
} = defineProps<Props>()

const getFrontmatter = (route: any) => {
  return (route.meta as any).frontmatter
}

const router = useRouter()
const routes = router
  .getRoutes()
  .filter(i => i.path.startsWith(`/${routeType}`) && getFrontmatter(i).date)
  .sort(
    (a, b) =>
      +new Date(getFrontmatter(b).date)
            - +new Date(getFrontmatter(a).date),
  )
</script>

<template>
  <ul>
    <router-link
      v-for="route in routes"
      :key="route.path"
      class="item block font-normal mb-6 mt-2 no-underline"
      :to="route.path"
    >
      <li class="no-underline">
        <BlogItem :route="route" />
      </li>
    </router-link>
  </ul>
</template>
