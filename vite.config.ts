import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/userscript.ts',
      name: 'UserScript',
      fileName: 'userscript',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        // Remove hash from filename for easier Tampermonkey installation
        entryFileNames: 'userscript.js',
        extend: true
      }
    },
    minify: false, // Keep readable for debugging
    sourcemap: false
  }
});
