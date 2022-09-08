import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('flipcoin').setDescription('Flip a coin'),
    async execute(interaction) {
        // calculate roll
        const roll = Math.floor(Math.random() * 2);

        // reply with roll
        await interaction.reply(
            `${'<@' + interaction.member.user.id + '>'} flipped a coin and got ${
                roll ? 'heads' : 'tails'
            }`
        );
        return;
    }
};
