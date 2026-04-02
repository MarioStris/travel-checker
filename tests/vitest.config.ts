import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['unit/**/*.test.ts'],
    exclude: ['node_modules', 'component/**'],
    setupFiles: ['./setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: [
        '../apps/api/src/routes/**',
        '../apps/api/src/services/**',
        '../apps/api/src/middleware/**',
        '../apps/api/src/lib/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, '../apps/api/src'),
    },
  },
});
