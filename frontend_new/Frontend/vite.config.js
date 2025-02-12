import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  rollupOptions: {
    input: './index.html', // specify your entry point
  },
  server: {
    host: '0.0.0.0',  // Allow access from any device in the network
  },
})
