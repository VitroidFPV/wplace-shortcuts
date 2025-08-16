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
        // Use .user.js extension for Tampermonkey auto-installation
        entryFileNames: 'userscript.user.js',
        extend: true
      }
    },
    minify: false, // Keep readable for debugging
    sourcemap: false
  }
});
