import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { tempo } from 'tempo-devtools/dist/vite';

const conditionalPlugins: [string, Record<string, any>][] = [];

// @ts-ignore
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

export default defineConfig({
  base: process.env.NODE_ENV === "development" ? "/" : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
    exclude: ['lucide-react'],
  },
  plugins: [
    react({
      plugins: conditionalPlugins,
    }),
    // Only include tempo plugin when TEMPO env is true
    process.env.TEMPO === "true" && tempo(),
  ].filter(Boolean),
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: true,
  },
  build: {
    // Configure build based on whether we're building for Tempo or not
    rollupOptions: {
      input: process.env.TEMPO === "true" 
        ? path.resolve(__dirname, 'src/tempobook/main.tsx')
        : path.resolve(__dirname, 'src/main.tsx'),
    },
  },
});
