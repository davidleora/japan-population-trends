# 都道府県別の総人口推移ビューア

都道府県別の人口推移を視覚的に表示する**React＋TypeScript**アプリケーションです。

## 概要

このプロジェクトは、日本の各都道府県の人口データを取得し、年ごとの人口推移をグラフで表示します。ユーザーは調べたい都道府県を選択し、「総人口」「年少人口」「生産年齢人口」「老年人口」のカテゴリー別に人口データを閲覧できます。

デモサイトはこちら：**[日本人口推移ビューア](https://japanpopulationtrends.web.app/)**

## 目次

- [インストール方法](#インストール方法)
- [使い方](#使い方)
- [使用技術](#使用技術)
- [APIについて](#apiについて)
- [プロジェクト構成](#プロジェクト構成)
- [ライセンス](#ライセンス)
- [著者](#著者)
- [謝辞](#謝辞)

## インストール方法

1. リポジトリをクローンします。

```bash
git clone https://github.com/davidleora/japan-population-trends.git
```

2. ディレクトリに移動します。

```bash
cd japan-population-trends
```

3. 必要なパッケージをインストールします。

```bash
npm install
```

4. RESAS APIのAPIキーを取得し、プロジェクトのルートディレクトリに`.env`ファイルを作成して設定します。

```bash
VITE_RESAS_API_KEY=あなたのAPIキー
```

## 使い方

1. アプリケーションを開発モードで起動します。

```bash
npm run dev
```

2. ブラウザで`http://localhost:5173/`を開きます。
3. 都道府県の一覧から興味のある都道府県を選択します。
4. 表示したい人口のカテゴリーを選択します（**総人口**、**年少人口**、**生産年齢人口**、**老年人口**）。
5. 選択した都道府県の人口推移がグラフに表示されます。

## 使用技術

- **React**：ユーザーインターフェースの構築
- **TypeScript**：型安全なコードのための静的型付け
- **Recharts**：レスポンシブなグラフ描画ライブラリ
- **Vite**：高速なフロントエンドビルドツール
- **RESAS API**：日本の統計データを取得

## APIについて

このアプリケーションは、[RESAS(地域経済分析システム)](https://opendata.resas-portal.go.jp/)のAPIを使用して人口データを取得しています。APIを利用するためには、RESASの公式サイトから**APIキーを取得**する必要があります。

## プロジェクト構成

<pre>
src
├── App.css
├── App.tsx
├── assets
│ └── react.svg
├── components
│ ├── LoadingDots.css
│ ├── LoadingDots.tsx
│ ├── PopulationDataDisplay.tsx
│ ├── PrefectureCheckboxList.tsx
│ └── **tests**
│ └── PrefectureCheckboxList.test.tsx
├── constants
│ └── regions.ts
├── hooks
│ ├── useFetchPrefectures.ts
│ └── usePopulationData.ts
├── main.tsx
├── types.ts
└── vite-env.d.ts
</pre>

## 主なファイルとディレクトリ

- `App.tsx`：アプリケーションのメインコンポーネント
  - 都道府県データの取得と、ユーザーインターフェースの統合を行います。
- `components/`：UIコンポーネントを格納
  - `PrefectureCheckboxList.tsx`：都道府県のチェックボックスリストを表示
  - `PopulationDataDisplay.tsx`：人口データをグラフで表示
  - `LoadingDots.tsx`：データ取得中のローディング表示
- `hooks/`：カスタムフックを格納
  - `useFetchPrefectures.ts`：都道府県データをAPIから取得するフック
  - `usePopulationData.ts`：人口データをAPIから取得し、状態管理するフック

## 著者

- David Leora - (https://github.com/davidleora)

## 謝辞

- [RESAS-API](https://opendata.resas-portal.go.jp/)を提供している**経済産業省と内閣官房デジタル田園都市国家構想実現会議事務局**
- **Recharts**の開発者コミュニティ
