import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import tailwindcss from '@tailwindcss/vite'

import fs from 'fs';
import path from 'path';

const getVersion = () => {
  try {
    // Find the latest version tag (e.g., "v3.0")
    const latestVersionTag = execSync('git describe --tags --match="v*" --abbrev=0').toString().trim();
    
    // Extract the major version number (x) from the tag (e.g., "v3.0" -> "3")
    const majorVersion = latestVersionTag.replace('v', '').split('.')[0];

    // Count commits exclusively since that specific tag
    const epicCount = execSync(`git log ${latestVersionTag}..HEAD --grep="^epic:" --oneline | wc -l`).toString().trim();
    const featCount = execSync(`git log ${latestVersionTag}..HEAD --grep="^feat:" --oneline | wc -l`).toString().trim();
    const fixCount = execSync(`git log ${latestVersionTag}..HEAD --grep="^fix:\\|^chore:\\|^refactor:\\|^style:\\|^docs:\\|^test:" --oneline | wc -l`).toString().trim();
    
    // Format: x.y.a.bb (Major.Epic.Feat.Fix)
    return `${majorVersion}.${epicCount}.${featCount}.${fixCount}`;
  } catch (e) {
    return '3.0.0.0';
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
