# Discord Game Bot

Steam の人気ゲーム情報を取得し、Discord チャンネルへ投稿する TypeScript 製 Discord Bot です。  
Steam API を利用してゲーム情報を取得し、OpenAI による紹介文生成にも対応しています。

---

## 主な機能

- Steam のゲーム情報取得
- 人気ゲームランキング取得
- プレイ人数取得
- Discord Embed 投稿
- OpenAI によるゲーム紹介文生成
- Cron による定期実行
- ログ出力対応
- Slash Command による処理の実行

---

## 使用技術

- TypeScript
- Node.js
- Discord.js
- Steam Web API
- OpenAI API
- node-cron
- dotenv
- winston
- PM2

---

## 必要環境

- Node.js 20 以上
- npm
- Discord Bot Token
- Steam API Key
- OpenAI API Key（任意）

---

## 動作確認環境

- Ubuntu 22.04.5 LTS
- Node.js v22.22.2
- npm 10.9.7

---

## インストール

```bash
git clone https://github.com/skaltanukiman/discord-game-bot.git
cd discord-game-bot

npm install
```

---

## 環境変数設定

ルートに `.env` を作成してください。

```env
DISCORD_TOKEN=xxxxxxxx        # Discord Bot Token
CLIENT_ID=xxxxxxxx            # Discord Application Client ID
GUILD_ID=xxxxxxxx             # サーバーID

STEAM_API_KEY=xxxxxxxx        # Steam Web API Key

OPENAI_API_KEY=xxxxxxxx       # OpenAI API Key（任意）

CHANNEL_ID=xxxxxxxx           # 投稿先DiscordチャンネルID
```

---

## コンパイル設定

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "nodenext",
    "target": "esnext",
    "strict": true
  }
}
```

## package.json scripts

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts",
    "deploy": "tsx src/deployCommands.ts"
  }
}
```

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発モード起動 |
| `npm run build` | TypeScript ビルド |
| `npm run start` | 本番起動 |
| `npm run deploy` | Discord Slash Commands デプロイ |

---

## 開発起動

```bash
npm run dev
```

---

## ビルド

```bash
npm run build
```

---

## 本番起動

```bash
npm run start
```

---

## PM2 起動

```bash
pm2 start dist/index.js --name discord-game-bot
```

### ログ確認

```bash
pm2 logs discord-game-bot
```

### 停止

```bash
pm2 stop discord-game-bot
```

---

## Discord Bot 招待

Discord Developer Portal で Bot を作成し、以下権限を付与してください。

### Bot Permissions

- Send Messages
- Embed Links
- Read Message History
- View Channels

### OAuth2 Scopes

- bot
- applications.commands

---

## OpenAI による紹介文生成

OpenAI API Key を設定すると、ゲーム紹介文を AI 生成できます。

### 例

```txt
圧倒的自由度を持つサバイバルクラフトゲーム。
仲間と協力して広大な世界を探索できます。
```

---

## 定期実行

Cron を利用して定期投稿できます。

### 例

```ts
cron.schedule("0 9 * * *", async () => {
          // (秒) 分 時 日 月 曜日
    // 定期実行処理;
});
```

---

## ログ出力

```ts
logger.info("Bot起動完了");
logger.warn("Steam API取得失敗");
logger.error("Discord送信失敗", error);
```

## ライセンス

MIT License

---

## 使用方法

環境変数で指定した Discord サーバー内のテキストチャンネルで、
Slash Command を実行すると対応する処理が実行されます。

---

### コマンド実行例

```txt
/(実行コマンド) (各種オプション)

例: /period_ranking count:5 sort_mode:ランク順 use_openai:True
```

---

### 実行コマンド

```txt
/period_ranking:    ## STEAM同時接続ランキング（一定期間）よりおすすめマルチプレイゲームを表示します
```

---

### オプション

#### `/period_ranking`

| オプション | 内容 |
|---|---|
| `count` | 取得件数（最大20件） |
| `sort_mode` | `ランク順` または `ランダム` |
| `use_openai` | OpenAI による説明文生成を行うか指定 |

---

## 今後追加予定

- ゲームジャンル検索
- シングルプレイ/マルチプレイ対応ゲーム切替
- Steam セール情報通知
- おすすめゲーム抽出ロジックの強化