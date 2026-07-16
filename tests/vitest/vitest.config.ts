import { defineConfig } from 'vitest/config'

export default defineConfig(
  {
    test: {
      globals: true,
      clearMocks: true,
      environment: 'node',
      setupFiles: ['./tests/vitest/setup.ts'],
      dir: './tests/vitest/tests/',
      coverage: {
        provider: 'v8'
      }
    }
  }
)
