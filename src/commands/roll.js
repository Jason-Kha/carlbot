import {
    ActionRowBuilder,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a n sided die')
        .addIntegerOption((option) =>
            option
                .setName('sides')
                .setDescription('Amount of sides the die has')
                .setRequired(true)
                .setMaxValue(10000)
        ),
    async execute(interaction) {
        // get options
        const sides = interaction.options.getInteger('sides');

        // calculate roll
        const roll = Math.floor(Math.random() * sides) + 1;

        // reply with roll
        await interaction.reply(`You rolled a ${sides}-sided die and got ${roll}`);
        return;
    }
};
