# Carta - Structured Knowledge Poster Generator (構造化知識ポスタージェネレーター)

[English](#english) | [日本語](#日本語)

---

## English

Carta is a web application that generates educational posters (cards) from structured YAML or JSON data. It supports Markdown, mathematical equations, diagrams, and graphs.

### Features

- **Editor & Validation**: Live preview of YAML/JSON input. Validates schema using Zod and verifies Mermaid syntax.
- **Bilingual Interface**: Support for English and Japanese with automatic language detection.
- **Content Formats**:
  - **Markdown**: Support for lists and tables.
  - **Equations**: LaTeX equation rendering using KaTeX.
  - **Diagrams**: Flowcharts, sequence diagrams, and other diagrams via Mermaid.js.
  - **Graphs**: Charts and visualizations using Vega-Lite.
- **AI Prompt**: System prompt to configure custom AI instances (custom GPTs, Skills, or Gems) to output valid YAML.
- **Local Processing**: Data processing and rendering occurs in the browser. No data is transmitted to external servers.
- **Export**: Export to PNG, SVG, PDF, or a single HTML file.

---

## 日本語

Cartaは、YAMLまたはJSONの構造化データから学習用ポスター（カード）を自動生成するWebアプリケーションです。Markdown、数式、ダイアグラム、グラフに対応しています。

### 機能

- **エディタとバリデーション**: YAML/JSONの記述内容をプレビュー。Zodによるスキーマ検証、およびMermaidの構文エラー検証機能を搭載。
- **バイリンガル対応**: 英語と日本語のUIをサポート。ブラウザ設定に基づく自動言語検出。
- **コンテンツ表示**:
  - **Markdown**: リスト、テーブルなどに対応。
  - **数式**: KaTeXによるLaTeX数式レンダリング。
  - **ダイアグラム**: Mermaid.jsによるフローチャートやシーケンス図。
  - **グラフ**: Vega-Liteによるグラフ表示。
- **AI用プロンプト**: AI（GPTs、Skills、Gemsなど）にYAMLを出力させるためのシステムプロンプト。
- **ローカル処理**: すべてのデータ処理がブラウザ内で完結し、外部サーバーへのデータ送信は行いません。
- **エクスポート**: PNG、SVG、PDF、単一HTMLファイル（Single HTML）へのエクスポート。

---

## Technical Stack (技術スタック)

- **Frontend**: React 19, Vite 8, TypeScript, Tailwind CSS v4, shadcn/ui.
- **Languages / i18n**: i18next, react-i18next.
- **Testing**: Vitest, Playwright (E2E).

---

## Quick Start (クイックスタート)

### Prerequisites (動作環境)

- Node.js 18+
- pnpm 8+ (Recommended)

### Setup & Commands (セットアップとコマンド)

1. **Install Dependencies**

   ```bash
   pnpm install
   ```

2. **Start Development Server**

   ```bash
   pnpm dev
   ```

   Open `http://localhost:5173` in your browser.

3. **Build Project**

   ```bash
   pnpm build
   ```

   _Note: Built assets will be output to the `/carta` directory (configured in `vite.config.ts`)._

4. **Testing**
   - **Unit Tests (Vitest)**:
     ```bash
     pnpm test
     ```
   - **E2E Tests (Playwright)**:
     ```bash
     pnpm test:e2e
     ```

5. **Lint & Format**
   - Run Linting:
     ```bash
     pnpm lint
     ```
   - Auto-format with Prettier:
     ```bash
     pnpm format
     ```

---

## License (ライセンス)

This project is licensed under the [MIT License](LICENSE).
