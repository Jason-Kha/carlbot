import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Get more information about a user.')
        .addRoleOption((option) => option.setName('role').setDescription('role').setRequired(true)),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setTitle('Register User Form')
            .setCustomId('registerUserID')
            .setComponents(
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setLabel('Username')
                        .setCustomId('username')
                        .setStyle(TextInputStyle.Short)
                )
            );
        await interaction.showModal(modal);
    }
};
