import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'setup',
      testDir: './e2e/setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        baseURL: 'http://localhost:4200',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'Desktop Chrome',
      testDir: './e2e/tests',
      use: {
        baseURL: 'http://localhost:4200',
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
        baseURL: 'http://localhost:4200',
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
