import NProgress from 'nprogress'
import type { PluginInstall } from '@/types'

export const install: PluginInstall = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach(() => {
      NProgress.start()
    })

    router.afterEach(() => {
      NProgress.done()
    })
  }
}
