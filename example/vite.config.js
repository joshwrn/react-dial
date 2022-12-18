/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { defineConfig, loadEnv } from "vite"
import ReactPlugin from "vite-preset-react"

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    plugins: [
      ReactPlugin({
        injectReact: process.env.VITE_NODE_ENV === `production` ? true : false,
      }),
    ],
    base: `/react-dial/`,
    server: {
      fs: {
        allow: [`..`],
      },
    },
  })
}
