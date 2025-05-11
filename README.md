# Factorio Discord Bot

A Discord bot that monitors a specific channel and a console.log file, forwarding messages between them.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
DISCORD_TOKEN=your_discord_bot_token_here
CHANNEL_ID=your_channel_id_here
CONSOLE_LOG_PATH=/path/to/your/console.log
```

3. Get your Discord bot token:

    - Go to [Discord Developer Portal](https://discord.com/developers/applications)
    - Create a new application
    - Go to the "Bot" section
    - Create a bot and copy the token
    - Enable the "Message Content Intent" under Privileged Gateway Intents

4. Get your channel ID:
    - Enable Developer Mode in Discord (Settings > Advanced > Developer Mode)
    - Right-click the channel you want to monitor
    - Click "Copy ID"

## Running the Bot

Start the bot with:

```bash
npm start
```

## Features

-   Monitors a specific Discord channel for messages
-   Forwards messages from the channel to the console
-   Monitors a specified console.log file
-   Forwards console.log messages to the Discord channel
