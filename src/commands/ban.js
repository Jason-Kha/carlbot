import { SlashCommandBuilder } from 'discord.js';

const banCommand = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Add a user')
    .addSubcommand((subcommand) =>
        subcommand
            .setName('temp')
            .setDescription('Temporarily bans user')
            .addUserOption((option) => option.setName('user').setDescription('user to be banned'))
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('perma')
            .setDescription('Permanently bans user')
            .addUserOption((option) => option.setName('user').setDescription('user to be banned'))
    );

export default banCommand.toJSON();
