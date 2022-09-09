import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a n sided die')
        .addIntegerOption((option) =>
            option
                .setName('sides')
                .setDescription('Amount of sides the die has')
                .setRequired(true)
                .setMaxValue(9999999999)
        ),
    async execute(interaction) {
        // get options
        const sides = interaction.options.getInteger('sides');

        // calculate roll
        const roll = Math.floor(Math.random() * sides) + 1;

        // reply with roll
        await interaction.reply(
            `${'<@' + interaction.member.user.id + '>'} rolled a ${sides}-sided die and got ${roll}`
        );
        return;
    }
};
