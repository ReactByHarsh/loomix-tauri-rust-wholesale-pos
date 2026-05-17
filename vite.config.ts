import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Tauri expects a fixed port, fail if that port is not available
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },

  build: {
    minify: true,
    sourcemap: false,
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
  },

  plugins: [
    react(),
  ],
}))
