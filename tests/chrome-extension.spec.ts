import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pathToExtension = path.join(__dirname, '../extension');

test.describe('Chrome拡張機能テスト（Web版）', () => {
  test.beforeEach(async ({ page }) => {
    // 開発サーバーの新規タブページにアクセス
    await page.goto('/src/newtab.html');
  });

  test('新規タブページが正しく表示される', async ({ page }) => {
    // ページタイトルを確認
    await expect(page).toHaveTitle(/Playwright Test Extension/);
    
    // 基本的なUIコンポーネントが表示されることを確認
    const appContainer = page.locator('[data-testid="app-container"]');
    await expect(appContainer).toBeVisible();
    
    // ヘッダーテキストを確認
    const header = page.locator('h1');
    await expect(header).toContainText('Playwright Chrome Extension Test');
    
    // ページ全体のスクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/web-app-main-page.png', fullPage: true });
  });

  test('時刻表示が動作する', async ({ page }) => {
    // アプリケーションコンテナが読み込まれるまで待機
    await page.waitForSelector('[data-testid="app-container"]');
    
    // 時刻表示要素が存在することを確認
    const timeElement = page.locator('#time');
    await expect(timeElement).toBeVisible();
    
    // 時刻が表示されていることを確認
    const timeText = await timeElement.textContent();
    expect(timeText).toBeTruthy();
    expect(timeText).toMatch(/\d{1,2}:\d{2}:\d{2}/);
    
    // 1秒待って時刻が更新されることを確認
    const initialTime = await timeElement.textContent();
    await page.waitForTimeout(1100);
    const updatedTime = await timeElement.textContent();
    expect(updatedTime).not.toBe(initialTime);
    
    // 時刻表示のスクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/web-app-time-display.png', fullPage: true });
  });

  test('スタイルが正しく適用される', async ({ page }) => {
    // コンテナの背景色を確認
    const container = page.locator('.container');
    const backgroundColor = await container.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // 白い背景のコンテンツボックスを確認
    const content = page.locator('.content');
    const contentBgColor = await content.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(contentBgColor).toBe('rgb(255, 255, 255)');
    
    // スタイル確認のスクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/web-app-styles.png', fullPage: true });
  });
});