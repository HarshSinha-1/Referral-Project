import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    outDir: 'dist',  // avoid any source maps that use eval
  },
  
  // Render expects dist
  
  server: {
    // optional, but you can disable HMR if needed
    hmr: {
      overlay: false
    }
  }
})
