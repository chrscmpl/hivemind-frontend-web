import { defineConfig, devices } from '@playwright/test';

const origin = 'http://localhost:3000';

export default defineConfig({
  projects: [
    {
      name: 'setup',
      testDir: './e2e/setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        baseURL: origin,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'Desktop Chrome',
      testDir: './e2e/tests',
      use: {
        baseURL: origin,
        ...devices['Desktop Chrome'],
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'Galaxy S9+',
      testDir: './e2e/tests',
      use: {
        baseURL: origin,
        ...devices['Galaxy S9+'],
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  reporter: [['html', { outputFolder: 'playwright/report' }]],
  outputDir: 'playwright/results',
});
