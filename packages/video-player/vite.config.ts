// vite.config.ts
import path from 'node:path';
import { defineConfig } from 'vite';

module.exports = defineConfig({
  build: {
    cssCodeSplit: true,
    minify: 'terser',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'SyPlayer',
      formats: ['es'],
      fileName: (format: string) => `player.${format}.js`,
    },
    reportCompressedSize: false,
    rollupOptions: {},
  },
});
