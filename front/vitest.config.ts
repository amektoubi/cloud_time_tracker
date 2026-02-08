
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      path.resolve(__dirname, 'tests/**/*.test.{ts,tsx}'),
    ],
    exclude: [
      'node_modules',
      'dist',
      '.git',
      '**/*.spec-d.ts',
    ],
    setupFiles: [path.resolve(__dirname, 'src/mocks/setup.ts')],
  },
})
