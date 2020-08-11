const { MessageEmbed } = require('discord.js');
const Currency = require('../../models/currency');

module.exports = {
    name: 'daily',
    aliases: ['collect', 'claim'],
    category: 'currency',
    description: 'Collect Super Deluxe Cheese Coins',
    run: async (client, message, args) => {
        let coinBonus = 50 + Math.ceil(Math.random() * 50);

        const embedSuccess = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(':moneybag: Daily')
            .setDescription(
                `You have recieved **${coinBonus}** Super Deluxe Cheese Coins!`
            )
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        // search for user in db
        await Currency.findOne(
            { userID: message.member.user.id },
            (err, user) => {
                if (err) console.error(err.message);

                try {
                    // if user does not exist in db, create new record
                    if (!user) {
                        const currency = new Currency({
                            userID: message.member.user.id,
                            balance: coinBonus,
                            redemptionDate: Date.now(),
                        });

                        currency.save();

                        message.channel.send(embedSuccess);
                    } else {
                        let timeDiff =
                            Date.now() - user.redemptionDate.getTime();
                        let secondsLeft =
                            user.redemptionDate.getTime() -
                            Date.now() +
                            79200000;

                        // 22 hours
                        if (timeDiff >= 79200000) {
                            user.balance = user.balance + coinBonus;
                            user.redemptionDate = Date.now();
                            user.save();

                            message.channel.send(embedSuccess);
                        } else {
                            secondsLeft = secondsLeft / 1000;
                            let hours = Math.floor(secondsLeft / 3600);
                            secondsLeft %= 3600;
                            let minutes = Math.floor(secondsLeft / 60);
                            secondsLeft %= 60;
                            let seconds = Math.floor(secondsLeft);

                            const embedClaimed = new MessageEmbed()
                                .setColor('RED')
                                .setTitle(':no_entry_sign: Error')
                                .setDescription(
                                    `You have already claimed your Super Deluxe Cheese Coins!\nPlease wait **${hours} hour(s)**, **${minutes} minute(s)**, and **${seconds} second(s)** before trying again.`
                                )
                                .setFooter(
                                    client.user.username,
                                    client.user.displayAvatarURL()
                                )
                                .setTimestamp();

                            message.channel.send(embedClaimed);
                        }
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
