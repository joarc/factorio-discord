require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const tail = require("tail");

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
    console.log("Bot is ready!");

    // Start monitoring the console.log file
    const tailFile = new tail.Tail(process.env.CONSOLE_LOG_PATH);

    tailFile.on("line", async (line) => {
        try {
            const channel = await client.channels.fetch(process.env.CHANNEL_ID);
            if (channel) {
                if (line.includes("[CHAT]") || line.includes("[JOIN]") || line.includes("[LEAVE]")) {
                    await channel.send(`${line}`);
                }
            }
        } catch (error) {
            console.error("Error sending message to Discord:", error);
        }
    });

    tailFile.on("error", (error) => {
        console.error("Error monitoring file:", error);
    });
});

// Listen for messages in the specified channel
client.on("messageCreate", async (message) => {
    // Only respond to messages in the specified channel
    if (message.channel.id !== process.env.CHANNEL_ID) return;

    // Don't respond to bot messages
    if (message.author.bot) return;

    // Echo the message to the console
    console.log(`[Discord] ${message.author.username}: ${message.content}`);
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
