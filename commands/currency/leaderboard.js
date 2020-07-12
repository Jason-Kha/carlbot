const ascii = require('ascii-table');
const Currency = require('../../models/currency');
const { MessageEmbed } = require('discord.js');
const AsciiTable = require('ascii-table/ascii-table');

module.exports = {
    name: 'leaderboard',
    aliases: ['top'],
    category: 'currency',
    description: 'Display list of users containing the most Super Deluxe Cheese Coins',
    run: async (client, message, args) => {
        await Currency.find({ }, (err, user) => {
            if (err) console.error(err.message);

            try {
                // if there are no users in the db
                if (!user.length) {
                    const embedNoUsers = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(':no_entry_sign: No users in database')
                        .setDescription(`There are no recorded users in the database.`)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setTimestamp();
                    return message.channel.send(embedNoUsers);
                }

                let leaderboardOutput = '';

                // list out top ten users
                var setup = new Promise((resolve, reject) => {  
                    const table = new ascii()
                        .setHeading('#', 'Username', 'Balance');

                    user.forEach(async function(user, i) {
                        const username = await client.users.cache.get(user.userID).tag;
                        const balance = user.balance;

                        var list = new Object();
                        list = {
                            'username': username,
                            'balance' : balance
                        };

                        table.addRow(i + 1, username, balance);

                        leaderboardOutput = `\`\`\`${table.setAlign(0, AsciiTable.CENTER).setAlign(2, AsciiTable.CENTER).toString()}\`\`\``;
                    });

                    resolve();
                });
                
                setup.then(() => {
                    const embed = new MessageEmbed()
                        .setColor("YELLOW")
                        .setTitle(':moneybag: Leaderboard')
                        .setDescription(`${leaderboardOutput}`)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setTimestamp();

                    return message.channel.send(embed);
                });
    
            } catch(err) {
                console.error(err.message);

                const embedErr = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(':no_entry_sign: Error')
                    .setDescription(`Something went wrong, try again later!`)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setTimestamp();
                message.channel.send(embedErr);
            }
        }).sort({ balance: -1 }).limit(10);
    }
}