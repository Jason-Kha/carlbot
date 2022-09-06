import { SlashCommandBuilder } from 'discord.js';

const roleCommand = new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Add a role')
    .addRoleOption((option) =>
        option.setName('newrole').setDescription('Add a new role').setRequired(true)
    );

export default roleCommand.toJSON();
