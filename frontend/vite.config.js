import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Important for deployment: set base to '/' or your subpath
  base: '/', // Change to '/my-app/' if deployed under a subfolder
  plugins: [
    react(),
    tailwindcss(),
  ],
})
