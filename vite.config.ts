import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' so the build works on GitHub Pages project sites
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
