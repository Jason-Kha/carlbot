import { ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('order').setDescription('Order your favorite Meal'),
    async execute(interaction) {
        console.log('Order Command');
        console.log(interaction.commandName);

        const actionRowFoodComponent = new ActionRowBuilder().setComponents(
            new SelectMenuBuilder().setCustomId('food_options').setOptions([
                { label: 'Hands', value: 'hands' },
                { label: 'Feet', value: 'feet' }
            ])
        );

        const actionRowDrinkComponent = new ActionRowBuilder().setComponents(
            new SelectMenuBuilder().setCustomId('drink_options').setOptions([
                { label: 'Water', value: 'water' },
                { label: 'Sea water', value: 'seawater' }
            ])
        );

        await interaction.reply({
            components: [actionRowFoodComponent.toJSON(), actionRowDrinkComponent.toJSON()]
        });
    }
};
