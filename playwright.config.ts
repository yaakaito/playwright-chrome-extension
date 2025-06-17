import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'web-app-test',
      testMatch: 'tests/chrome-extension.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8080',
      },
    },
    {
      name: 'chrome-extension-test',
      testMatch: 'tests/chrome-extension-real.spec.ts',
      use: {
        // Chrome拡張機能テスト用の設定
        // 実際のブラウザ起動はテスト内で行うため、ここでは最小限の設定
      },
    },
  ],

  webServer: {
    command: 'npx http-server ./extension -p 8080',
    port: 8080,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
