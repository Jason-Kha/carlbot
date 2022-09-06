import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import CommandHandler from './commandhandler.js';
import OrderCommand from './commands/order.js';
import RoleCommand from './commands/roles.js';
import UserCommand from './commands/users.js';
import BanCommand from './commands/ban.js';
import RegisterCommand from './commands/register.js';

// dotenv setup
config();
const TOKEN = process.env.DISCORD_TOKEN;
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
client.login(TOKEN);

// on ready
client.on('ready', () => {
    console.log(`${client.user.tag} ready`);
});

// on interaction, pass to handler
client.on('interactionCreate', async (interaction) => {
    await CommandHandler.handle(interaction);
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

// main function
async function main() {
    // build commands
    const commands = [OrderCommand, RoleCommand, UserCommand, BanCommand, RegisterCommand];

    // update slash commands to guild (for now)
    try {
        console.log('Updating Slash Commands.');

        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands
        });
    } catch (err) {
        console.log(err);
    }
}

main();
