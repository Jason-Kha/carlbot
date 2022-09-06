import { SlashCommandBuilder } from 'discord.js';

const registerCommand = new SlashCommandBuilder()
    .setName('register')
    .setDescription('register username');

export default registerCommand.toJSON();
