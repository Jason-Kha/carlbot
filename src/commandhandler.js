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
        // console.log(interaction);
        if (interaction.isChatInputCommand()) {
            switch (interaction.commandName) {
                case 'order':
                    {
                        console.log('Order Command');
                        console.log(interaction.commandName);

                        const actionRowFoodComponent = new ActionRowBuilder().setComponents(
                            new SelectMenuBuilder().setCustomId('food_options').setOptions([
                                { label: 'Hands', value: 'hands' },
                                { label: 'Feet', value: 'feet' }
                            ])
                        );
                        /*
                        const actionRowDrinkComponent = new ActionRowBuilder().setComponents(
                            new SelectMenuBuilder().setCustomId('drink_options').setOptions([
                                { label: 'Water', value: 'water' },
                                { label: 'Sea water', value: 'seawater' }
                            ])
                        );
                        */
                        await interaction.reply({
                            components: [
                                actionRowFoodComponent.toJSON()
                                //actionRowDrinkComponent.toJSON()
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
                        const user = interaction.options.get('user');
                        console.log(user);
                        const roles =
                            user.member._roles.map((i) => `<@&${i}>`).join(', ') || 'None';
                        const joined = Intl.DateTimeFormat('en-US').format(
                            user.member.guild.joinedTimestamp
                        );
                        const created = Intl.DateTimeFormat('en-US').format(
                            user.member.user.createdAt
                        );
                        const displayName = user.member.nickname || user.member.user.username;
                        const embed = new EmbedBuilder()
                            .setTitle(
                                `${user.member.user.username} #${user.member.user.discriminator}`
                            )
                            .setColor(user.member.displayColor)
                            .addFields(
                                {
                                    name: 'Member Information',
                                    value: `**\\> Display name:** ${displayName}\n**\\> Joined on:** ${joined}\n**\\> Roles:** ${roles}\n**\\> Balance:** ${1}`,
                                    inline: true
                                },
                                {
                                    name: 'User Information',
                                    value: `**\\> Status:** ${
                                        // user.member.presence.status.charAt(0).toUpperCase() +
                                        // user.member.presence.status.slice(1)
                                        1
                                    }\n**\\> Username:** ${user.member.user.tag}\n**\\> ID:** ${
                                        user.member.user.id
                                    }\n**\\> Created on:** ${created}`,
                                    inline: true
                                }
                            )
                            .setThumbnail(user.member.user.displayAvatarURL({ size: 4096 }))
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
