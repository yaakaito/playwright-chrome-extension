import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pathToExtension = path.join(__dirname, '../extension');

let context: BrowserContext;

test.describe('実際のChrome拡張機能テスト', () => {
  test.beforeAll(async () => {
    // Chrome拡張機能を読み込んだコンテキストを作成
    context = await chromium.launchPersistentContext('', {
      // headless: true, // CI環境ではheadlessで実行
      channel: 'chromium',
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
      // executablePath: '/usr/bin/chromium'
    });

    // 拡張機能がロードされるまで少し待機
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test('Chrome拡張機能が正常にロードされる', async () => {
    const page = await context.newPage();

    // 新規タブページに移動
    await page.goto('chrome://newtab/');
    await page.waitForLoadState('domcontentloaded');

    // ページタイトルを確認
    await expect(page).toHaveTitle(/Playwright Test Extension/, { timeout: 10000 });

    // アプリケーションコンテナが表示されることを確認
    const appContainer = page.locator('[data-testid="app-container"]');
    await expect(appContainer).toBeVisible({ timeout: 10000 });

    // 拡張機能一覧ページのスクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/chrome-extension-loaded.png', fullPage: true });
  });

  test('新規タブページが拡張機能に置き換わる', async () => {
    const page = await context.newPage();

    // 新しいタブを開く
    await page.goto('chrome://newtab/');
    await page.waitForLoadState('domcontentloaded');

    // ページタイトルを確認
    await expect(page).toHaveTitle(/Playwright Test Extension/, { timeout: 10000 });

    // アプリケーションコンテナが表示されることを確認
    const appContainer = page.locator('[data-testid="app-container"]');
    await expect(appContainer).toBeVisible({ timeout: 10000 });

    // Chrome拡張機能の新規タブページのスクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/chrome-extension-newtab.png', fullPage: true });
  });

  test('拡張機能の新規タブで時刻が表示される', async () => {
    const page = await context.newPage();
    await page.goto('chrome://newtab/');
    await page.waitForLoadState('domcontentloaded');

    // アプリケーションコンテナが読み込まれるまで待機
    await page.waitForSelector('[data-testid="app-container"]', { timeout: 10000 });

    // 時刻表示要素が存在し、正しく動作することを確認
    const timeElement = page.locator('#time');
    await expect(timeElement).toBeVisible();

    const timeText = await timeElement.textContent();
    expect(timeText).toBeTruthy();
    expect(timeText).toMatch(/\d{1,2}:\d{2}:\d{2}/);

    // 時刻表示のスクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/chrome-extension-time.png', fullPage: true });
  });

  test('拡張機能ページのコンテンツが正しく表示される', async () => {
    const page = await context.newPage();
    await page.goto('chrome://newtab/');
    await page.waitForLoadState('domcontentloaded');

    // 各要素が正しく表示されることを確認
    await expect(page.locator('h1')).toContainText('Playwright Chrome Extension Test');
    await expect(page.locator('text=これは Playwright でテストするための簡単な Chrome 拡張機能です。')).toBeVisible();
    await expect(page.locator('text=新しいタブページが正常に置き換えられました。')).toBeVisible();

    // コンテンツ確認のスクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/chrome-extension-content.png', fullPage: true });
  });
});
