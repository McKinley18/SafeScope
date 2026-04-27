import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  use: {
    headless: true,
    viewport: { width: 390, height: 844 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
