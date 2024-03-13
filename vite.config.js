import { defineConfig } from 'vite'
//import path from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte';
import postcss from './postcss.config.js';
import { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  css:{
    postcss
  },
  resolve: {
    alias: {
      $lib: resolve('./src/lib'),
    }
  },
  build: {
    copyPublicDir: false,
    sourcemap:false,
    minify: true,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['es']
    },
    outDir: './dist/js',
  },
})