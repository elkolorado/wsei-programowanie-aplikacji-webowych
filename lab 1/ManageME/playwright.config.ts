import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e', // Directory where your tests are located
  timeout: 30000, // Timeout for each test (30 seconds)
  retries: 1, // Retry failed tests once
  reporter: 'html', // Generate an HTML report
  use: {
    headless: true, // Run tests in headless mode
    baseURL: 'http://localhost:4321', // Base URL of your application
    viewport: { width: 1280, height: 720 }, // Browser viewport size
  },
});