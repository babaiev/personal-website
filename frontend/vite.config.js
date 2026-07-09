import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import tailwindcss from '@tailwindcss/vite'

const getVersion = () => {
  try {
    const featCount = execSync('git log --grep="^feat:" --oneline | wc -l').toString().trim()
    const fixCount = execSync('git log --grep="^fix:\\|^chore:\\|^refactor:\\|^style:\\|^docs:" --oneline | wc -l').toString().trim()
    return `2.0.${featCount}.${fixCount}`
  } catch (e) {
    return '2.0.0.00'
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(getVersion())
  },
  plugins: [react(), tailwindcss()],
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
