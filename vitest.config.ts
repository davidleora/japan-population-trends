import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.ts',
    coverage: {
      exclude: [
        'src/main.tsx', 
        'src/types.ts', 
        'src/vite-env.d.ts',
        '**/*.config.js', 
        '**/*.config.ts', 
        'dist/**',
        'node_modules/**'
      ],
    },
  },
});
