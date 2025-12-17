import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: ['esm'],
  clean: true,
  dts: true,
  minify: false,
  sourcemap: false,
  target: 'node18',
  fixedExtension: false,
  banner: {
    js: '#!/usr/bin/env node',
  },
})
