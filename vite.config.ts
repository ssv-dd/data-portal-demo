import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/Data-Portal-AI-Native/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: parseInt(process.env.VITE_PORT || '5180'),
  },
  optimizeDeps: {
    include: ['react-grid-layout', 'react-resizable', 'react-draggable'],
  },
})
