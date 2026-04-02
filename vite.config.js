import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cardigan: resolve(__dirname, 'product.html'),
        linens: resolve(__dirname, 'product-linens.html'),
        tapestry: resolve(__dirname, 'product-tapestry.html'),
      },
    },
  },
});
