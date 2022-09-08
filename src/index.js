import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

import { Client, Collection, GatewayIntentBits } from 'discord.js';

import { config } from 'dotenv';

// directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// dotenv setup
config();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// discord.js setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// command setup
client.commands = new Collection();
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

// command files
for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = await import(filePath);
    client.commands.set(command.default.data.name, command);
}

// event setup
const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

// event files
for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const event = await import(filePath);

    // if one-time listener event
    if (event.default.once) {
        client.once(event.default.name, (...args) => event.default.execute(...args));
    } else {
        client.on(event.default.name, (...args) => event.default.execute(...args, client));
    }
}

/*
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.default.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
});
*/

// login
client.login(DISCORD_TOKEN);
