import { ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('order').setDescription('Order your favorite Meal'),
    async execute(interaction) {
        // build food options
        const actionRowFoodComponent = new ActionRowBuilder().setComponents(
            new SelectMenuBuilder()
                .setCustomId('order_foodoptions')
                .setPlaceholder('Select Food')
                .setOptions([
                    { label: 'Hands', description: 'Yummy hands', value: 'hands' },
                    { label: 'Feet', value: 'feet' }
                ])
        );

        // build drink options
        const actionRowDrinkComponent = new ActionRowBuilder().setComponents(
            new SelectMenuBuilder()
                .setCustomId('order_drinkoptions')
                .setPlaceholder('Select Drink')
                .setOptions([
                    { label: 'Water', value: 'water' },
                    { label: 'Milk', value: 'milk' },
                    { label: 'Blood', value: 'blood' }
                ])
        );

        // send menu
        await interaction.reply({
            components: [actionRowFoodComponent.toJSON(), actionRowDrinkComponent.toJSON()],
            ephemeral: true
        });
    },
    async response(interaction) {
        // delete replies
        interaction.deferReply();
        interaction.deleteReply();

        // send message based on selection
        switch (interaction.customId) {
            case 'order_foodoptions': {
                await interaction.channel.send(`Yum hungry for ${interaction.values}`);
                break;
            }
            case 'order_drinkoptions': {
                await interaction.channel.send(`Thirsty for ${interaction.values}`);
                break;
            }
        }
    }
};
