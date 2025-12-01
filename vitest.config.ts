import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', '.next', 'dist', 'playwright', 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'test/',
        '__tests__/',
        'e2e/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types.ts',
        '**/*.spec.ts',
        '**/*.test.ts',
      ],
      // Coverage thresholds disabled for pre-launch flexibility
      // Uncomment and adjust if you want to enforce minimum coverage
      // thresholds: {
      //   lines: 50,
      //   functions: 50,
      //   branches: 45,
      //   statements: 50,
      // },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});

