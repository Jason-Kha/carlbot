const { MessageEmbed } = require('discord.js');
const Currency = require('../../models/currency');
const { formatDate, getMember } = require('../../functions.js');

module.exports = {
    name: 'whois',
    aliases: ['userinfo', 'user', 'who'],
    category: 'info',
    description: 'Returns user information',
    run: async (client, message, args) => {
        const member = getMember(message, args.join(' '));

        // User information
        const joined = formatDate(member.joinedTimestamp);
        const created = formatDate(member.user.createdAt);
        const displayName = member.nickname || member.user.username;
        let balance = 0;

        // user currency
        await Currency.findOne({ userID: member.user.id }, (err, user) => {
            if (err) console.error(err.message);

            try {
                if (user) {
                    balance = user.balance;
                } else {
                    balance = 0;
                }
            } catch (err) {
                console.error(err.message);

                const embedErr = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(':no_entry_sign: Error')
                    .setDescription(`Something went wrong, try again later!`)
                    .setFooter(
                        client.user.username,
                        client.user.displayAvatarURL()
                    )
                    .setTimestamp();
                message.channel.send(embedErr);
            }
        });

        const roles =
            member.roles.cache
                .filter((r) => r.id !== message.guild.id)
                .map((r) => r)
                .join(', ') || 'None';

        // Embeded message
        const embed = new MessageEmbed()
            .setColor(member.displayColor)
            .addFields(
                {
                    name: 'Member Information',
                    value: `**\\> Display name:** ${displayName}\n**\\> Joined on:** ${joined}\n**\\> Roles:** ${roles}\n**\\> Balance:** ${balance}`,
                    inline: true
                },
                {
                    name: 'User Information',
                    value: `**\\> Status:** ${
                        member.presence.status.charAt(0).toUpperCase() +
                        member.presence.status.slice(1)
                    }\n**\\> Username:** ${member.user.tag}\n**\\> ID:** ${
                        member.user.id
                    }\n**\\> Created on:** ${created}`,
                    inline: true
                }
            )
            .setThumbnail(member.user.displayAvatarURL({ size: 4096 }))
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        // Add user presence (if there are any)
        if (member.presence.activities) {
            embed.addFields({ name: '\u200B', value: '\u200B', inline: true });
        }

        if (
            member.presence.activities.filter((a) => a.type === 'CUSTOM_STATUS')
                .length > 0
        ) {
            embed.addFields({
                name: 'Status',
                value: `**\\>** ${
                    member.presence.activities.filter(
                        (a) => a.type === 'CUSTOM_STATUS'
                    )[0].state
                }`,
                inline: true
            });
        }

        if (
            member.presence.activities.filter((a) => a.type === 'PLAYING')
                .length > 0
        ) {
            embed.addFields({
                name: 'Currently playing',
                value: `**\\>** ${member.presence.activities.filter(
                    (a) => a.type == 'PLAYING'
                )}`,
                inline: true
            });
        }

        await message.channel.send(embed);
    }
};
