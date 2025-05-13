require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const tail = require("tail");
const { exec } = require("child_process");

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
    console.log("Bot is ready!");

    factorioConsoleLogListener();
    discordMessageListener();
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

function discordMessageListener() {
    // Listen for messages in the specified channel
    client.on("messageCreate", async (message) => {
        // Only respond to messages in the specified channel
        if (message.channel.id !== process.env.CHANNEL_ID) return;

        // Don't respond to bot messages
        if (message.author.bot) return;

        // Echo the message to the console
        console.log(`[Discord] ${message.author.username}: ${message.content}`);

        sendFactorioMessage(message);
    });
}

function factorioConsoleLogListener() {
    if (!process.env.CONSOLE_LOG_PATH) {
        console.error("CONSOLE_LOG_PATH is not set, not starting factorio console log listener");
        return;
    }

    const tailFile = new tail.Tail(process.env.CONSOLE_LOG_PATH);

    tailFile.on("line", async (line) => {
        console.log(`[Factorio] ${line}`);

        try {
            const channel = await client.channels.fetch(process.env.CHANNEL_ID);
            if (channel) {
                if (line.includes("<server>")) {
                    return;
                }

                if (line.includes("[CHAT]") || line.includes("[JOIN]") || line.includes("[LEAVE]")) {
                    if (line.includes("[gps=")) {
                        // Don't send GPS-messages
                        return;
                    }

                    // Clean up the message by removing datetime and tags
                    let cleanMessage = line;
                    if (line.includes("[CHAT]")) {
                        // Remove datetime and [CHAT] tag
                        cleanMessage = line.replace(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \[CHAT\] /, "");
                    } else if (line.includes("[JOIN]")) {
                        // Remove datetime and [JOIN] tag
                        cleanMessage = line.replace(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \[JOIN\] /, "");
                    } else if (line.includes("[LEAVE]")) {
                        // Remove datetime and [LEAVE] tag
                        cleanMessage = line.replace(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \[LEAVE\] /, "");
                    }

                    await channel.send(cleanMessage);
                }
            }
        } catch (error) {
            console.error("Error sending message to Discord:", error);
        }
    });

    tailFile.on("error", (error) => {
        console.error("Error monitoring file:", error);
    });
}

function sendFactorioMessage(discordMessage) {
    if (!process.env.TMUX_SESSION) {
        console.error("TMUX_SESSION is not set, not sending message to factorio");
        return;
    }

    // Execute tmux command to send message to factorio
    let tmux_session = process.env.TMUX_SESSION;

    let message = `[D] ${discordMessage.author.username}: ${discordMessage.content}`;

    exec(`tmux send -t ${tmux_session}:0.0 -l "${message}" && tmux send -t ${tmux_session}:0.0 Enter`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing tmux command: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`tmux stderr: ${stderr}`);
        }
    });
}
