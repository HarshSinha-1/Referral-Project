import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    outDir: 'dist',
  },

  server: {
    host: true,
    hmr: {
      overlay: false
    }
  },

  preview: {
    host: true,
    // 👇 IMPORTANT: Add your Render URL here!!
    allowedHosts: ["referral-project-gl81.onrender.com"],
  }
})
