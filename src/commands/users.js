import { SlashCommandBuilder } from 'discord.js';

const userCommand = new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get more information about a user.')
    .addUserOption((option) =>
        option.setName('user').setDescription('user to inspect').setRequired(true)
    );

export default userCommand.toJSON();
