import 'virtual:windi.css'
import './styles/index.scss'
import routes from 'pages-generated'
import { ViteSSG } from 'vite-ssg'
import type { RouterScrollBehavior } from 'vue-router'
import App from './App.vue'

const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  if (savedPosition)
    return savedPosition
  else
    return { top: 0 }
}

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  (ctx) => {
    Object.values(import.meta.globEager('./plugins/*.ts')).map(i => i.install?.(ctx))
  },
)
