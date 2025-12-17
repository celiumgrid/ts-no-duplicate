import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: ['esm'],
  clean: true,
  dts: true,
  minify: false,
  sourcemap: true,
  target: 'node18',
  banner: {
    js: '#!/usr/bin/env node'
  }
})