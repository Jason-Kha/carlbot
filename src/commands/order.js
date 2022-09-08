import { ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('order').setDescription('Order your favorite Meal'),
    async execute(interaction) {
        //console.log('Order Command');
        //console.log(interaction.commandName);

        const actionRowFoodComponent = new ActionRowBuilder().setComponents(
            new SelectMenuBuilder().setCustomId('order_foodoptions').setOptions([
                { label: 'Hands', value: 'hands' },
                { label: 'Feet', value: 'feet' }
            ])
        );

        const actionRowDrinkComponent = new ActionRowBuilder().setComponents(
            new SelectMenuBuilder().setCustomId('order_drinkoptions').setOptions([
                { label: 'Water', value: 'water' },
                { label: 'Sea water', value: 'seawater' }
            ])
        );

        await interaction.reply({
            components: [actionRowFoodComponent.toJSON(), actionRowDrinkComponent.toJSON()],
            ephemeral: true
        });
    },
    async response(interaction) {
        console.log(interaction.customId);
        switch (interaction.customId) {
            case 'order_foodoptions': {
                await interaction.reply(`Yum hungry for ${interaction.values}`);
                break;
            }
            case 'order_drinkoptions': {
                await interaction.reply(`Thirsty for ${interaction.values}`);
                break;
            }
        }
    }
};
