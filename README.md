# Playwright Chrome Extension Testing

 Dev ContainerとGHAをChrome拡張機能をPlaywrightでテストするための最小限のセットアップです。

## 構成

- **Chrome拡張機能**: `/newtab` を持つシンプルな新規タブページ拡張機能
- **Playwrightテスト**: Web版とChrome拡張機能版の2つのテストプロジェクト
- **Dev Container**: Playwright実行に必要な依存関係を含む開発環境
- **GitHub Actions**: CI/CDでの自動テスト実行

## セットアップ

### ローカル環境

```bash
# 依存関係のインストール
npm install

# Playwrightブラウザのインストール
npx playwright install --with-deps chromium

# テストの実行
npm test
```

### Dev Container環境

1. VS Codeで「Reopen in Container」を選択
2. コンテナが起動すると自動的に依存関係がインストールされます
3. `npm test` でテストを実行

## テストの実行

```bash
# 全てのテストを実行
npm test

# Web版のテストのみ実行
npx playwright test --project=web-app-test

# Chrome拡張機能の実テストのみ実行
npx playwright test --project=chrome-extension-test

# デバッグモードで実行
npm run test:debug

# UIモードで実行
npm run test:ui
```

## プロジェクト構造

```
.
├── extension/              # Chrome拡張機能
│   ├── manifest.json      # 拡張機能マニフェスト
│   └── src/               # 拡張機能のソースコード
│       ├── newtab.html    # 新規タブページ
│       ├── newtab.css     # スタイル
│       ├── newtab.js      # JavaScript
│       └── icon.png       # アイコン
├── tests/                 # Playwrightテスト
│   ├── chrome-extension.spec.ts      # Web版テスト
│   └── chrome-extension-real.spec.ts # 実際の拡張機能テスト
├── playwright.config.ts   # Playwright設定
├── .devcontainer/         # Dev Container設定
├── .github/workflows/     # GitHub Actions
└── package.json          # プロジェクト設定
```

## 特徴

- ヘッドレスモードでのChrome拡張機能テスト
- スクリーンショット自動撮影
- GitHub Actionsでの自動テスト実行
- Dev Container対応で環境構築が簡単
