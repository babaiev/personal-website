import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const versionPath = path.resolve(__dirname, '../VERSION')
const version = fs.existsSync(versionPath) ? fs.readFileSync(versionPath, 'utf-8').trim() : 'Unknown'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(version)
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.jsx', 'src/api.js'],
      exclude: ['src/main.jsx', 'src/setupTests.js'],
      all: true
    }
  },
})
