import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

import { REST, Routes } from 'discord.js';

import { config } from 'dotenv';

// directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// dotenv setup
config();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// command setup
const commands = [];
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

// command files
for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = await import(filePath);
    commands.push(command.default.data.toJSON());
}

// rest
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

// update commands
rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
