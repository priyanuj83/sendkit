# Sendkit

A small command-line tool for sending messages from the terminal. The first command posts a text message to a Telegram chat through the [Telegram Bot API](https://core.telegram.org/bots/api).

## Requirements

- [Bun](https://bun.sh) 1.x
- A Telegram bot token from [@BotFather](https://t.me/BotFather)
- The numeric chat ID of the chat the bot should message

## Setup

Clone the repository and install dependencies from the workspace root:

```bash
bun install
```

Export your bot token before running the CLI. The token is read from the environment and is never stored in the repo (`.env` and `.env.*` are gitignored):

```bash
export TELEGRAM_BOT_TOKEN="your-bot-token"
```

## Usage

From the workspace root:

```bash
bun run dev:cli telegram <chatID> "<message>"
```

Example:

```bash
bun run dev:cli telegram 123456789 "Hello from Sendkit"
```

You can also run the entry file directly:

```bash
bun run packages/cli/src/index.ts telegram 123456789 "Hello from Sendkit"
```

On success the CLI prints the destination chat and the Telegram message ID. If the token is missing, an argument is empty, or the API returns an error, it prints the reason to stderr and exits with code 1.

| Argument | Description |
| --- | --- |
| `chatID` | Telegram chat ID the bot should send to |
| `message` | Text of the message |

| Environment variable | Description |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Bot token used to authenticate with `https://api.telegram.org` |

## Project layout

```
sendkit/
├── package.json              # Bun workspace root
├── tsconfig.json             # TypeScript (ES2022, NodeNext, strict)
└── packages/
    └── cli/
        ├── package.json      # CLI package (`sendkit`)
        └── src/
            └── index.ts      # Commander CLI and Telegram command
```

The root package `sendkit-workspace` is private and lists `packages/*` as workspaces. The CLI package depends on [Commander](https://github.com/tj/commander.js) and is written as an ES module.

## How the Telegram command works

1. Read `TELEGRAM_BOT_TOKEN` from the environment.
2. `POST` `{ chat_id, text }` to `https://api.telegram.org/bot<token>/sendMessage`.
3. Treat a non-OK HTTP status or a Telegram `ok: false` body as a failure and print `description` when the API provides one.
