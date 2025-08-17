import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/custom-matchers.ts', './tests/vitest.setup.ts'],
  },
});
