const { MessageEmbed } = require('discord.js');
const Currency = require('../../models/currency');
const config = require('config');

module.exports = {
    name: 'coins',
    aliases: ['coin', 'sdcc', 'money'],
    category: 'currency',
    description: 'Display current amount of Super Deluxe Cheese Coins',
    run: async (client, message, args) => {
        await Currency.findOne(
            { userID: message.member.user.id },
            (err, user) => {
                if (err) console.error(err.message);

                try {
                    // check to see if the user is in the database
                    if (!user) {
                        const embedCoins = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle(':moneybag: Super Deluxe Cheese Coins')
                            .setDescription(
                                `You have **0** Super Deluxe Cheese Coins! Type ${
                                    config.util.getEnv('PREFIX') ||
                                    config.get('prefix')
                                }daily to collect!`
                            )
                            .setFooter(
                                client.user.username,
                                client.user.displayAvatarURL()
                            )
                            .setTimestamp();
                        message.channel.send(embedCoins);
                    } else {
                        const embedCoins = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle(':moneybag: Super Deluxe Cheese Coins')
                            .setDescription(
                                `You have **${user.balance}** Super Deluxe Cheese Coins!`
                            )
                            .setFooter(
                                client.user.username,
                                client.user.displayAvatarURL()
                            )
                            .setTimestamp();
                        message.channel.send(embedCoins);
                    }
                } catch (err) {
                    console.error(err.message);

                    const embedErr = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(':no_entry_sign: Error')
                        .setDescription(
                            `Something went wrong, try again later!`
                        )
                        .setFooter(
                            client.user.username,
                            client.user.displayAvatarURL()
                        )
                        .setTimestamp();
                    message.channel.send(embedErr);
                }
            }
        );
    },
};
