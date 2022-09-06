import {
    ActionRowBuilder,
    EmbedBuilder,
    ModalBuilder,
    SelectMenuBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

const CommandHandler = {
    handle: async function (interaction) {
        console.log(interaction);
        if (interaction.isChatInputCommand()) {
            switch (interaction.commandName) {
                case 'order':
                    {
                        console.log('Order Command');
                        console.log(interaction.commandName);

                        const actionRowFoodComponent = new ActionRowBuilder().setComponents(
                            new SelectMenuBuilder().setCustomId('food_options').setOptions([
                                { label: 'Cake', value: 'cake' },
                                { label: 'Pizza', value: 'pizza' }
                            ])
                        );
                        const actionRowDrinkComponent = new ActionRowBuilder().setComponents(
                            new SelectMenuBuilder().setCustomId('drink_options').setOptions([
                                { label: 'Water', value: 'water' },
                                { label: 'Cola', value: 'cola' }
                            ])
                        );
                        await interaction.reply({
                            components: [
                                actionRowFoodComponent.toJSON(),
                                actionRowDrinkComponent.toJSON()
                            ]
                        });
                    }
                    break;
                case 'register':
                    {
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
                        interaction.showModal(modal);
                    }
                    break;
                case 'userinfo':
                    {
                        const roles =
                            interaction.member._roles.map((i) => `<@&${i}>`).join(', ') || 'None';
                        const joined = Intl.DateTimeFormat('en-US').format(
                            interaction.member.joinedTimestamp
                        );
                        const created = Intl.DateTimeFormat('en-US').format(
                            interaction.member.user.createdAt
                        );
                        const displayName =
                            interaction.member.nickname || interaction.member.user.username;
                        const embed = new EmbedBuilder()
                            .setTitle(
                                `${interaction.user.username} #${interaction.user.discriminator}`
                            )
                            .setColor(interaction.member.displayColor)
                            .addFields(
                                {
                                    name: 'Member Information',
                                    value: `**\\> Display name:** ${displayName}\n**\\> Joined on:** ${joined}\n**\\> Roles:** ${roles}\n**\\> Balance:** ${1}`,
                                    inline: true
                                },
                                {
                                    name: 'User Information',
                                    value: `**\\> Status:** ${
                                        // interaction.member.presence.status.charAt(0).toUpperCase() +
                                        // interaction.member.presence.status.slice(1)
                                        1
                                    }\n**\\> Username:** ${
                                        interaction.member.user.tag
                                    }\n**\\> ID:** ${
                                        interaction.member.user.id
                                    }\n**\\> Created on:** ${created}`,
                                    inline: true
                                }
                            )
                            .setThumbnail(interaction.member.user.displayAvatarURL({ size: 4096 }))
                            // .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTimestamp();
                        // console.log(interaction);
                        await interaction.reply({
                            embeds: [embed]
                        });
                    }
                    break;
            }
        } else if (interaction.isSelectMenu()) {
            switch (interaction.customId) {
                case 'food_options': {
                    console.log('g');
                    await interaction.reply(`Food selected: ${interaction.values}`);
                }
                case 'drink_options': {
                    console.log('g');
                    await interaction.reply(`Drink selected: ${interaction.values}`);
                }
            }
        } else return;
    }
};

export default CommandHandler;
