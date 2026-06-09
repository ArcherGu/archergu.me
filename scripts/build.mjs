import { spawnSync } from 'node:child_process'

const args = process.argv.slice(2)
const enableIcp = args.includes('--icp')
const forwardedArgs = args.filter(arg => arg !== '--icp')

const result = spawnSync(
  'vite-ssg',
  ['build', ...forwardedArgs],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      VITE_ENABLE_ICP: enableIcp ? 'true' : 'false',
    },
  },
)

if (result.error)
  throw result.error

process.exit(result.status ?? 1)
