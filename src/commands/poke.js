import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('poke')
        .setDescription('Poke someone')
        .addUserOption((option) =>
            option.setName('user').setDescription('User to poke').setRequired(true)
        ),
    async execute(interaction) {
        console.log(interaction.member);
        await interaction.reply(
            `${'<@' + interaction.member.user.id + '>'} poked ${
                '<@' + interaction.options.getUser('user').id + '>'
            }`
        );
        return;
    }
};
