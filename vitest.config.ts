import { defineConfig } from 'vitest/config';

// TODO: Add support for test files with .test.ts extension.

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
});
