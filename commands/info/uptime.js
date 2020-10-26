const { formatDate, formatTime } = require('../../functions.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'uptime',
    aliases: ['bot', 'status', 'runtime'],
    category: 'info',
    description: 'Displays bot uptime information',
    run: async (client, message, args) => {
        let totalSeconds = client.uptime / 1000;
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600) % 24;
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);

        const date = formatDate(client.readyTimestamp);
        const time = formatTime(client.readyTimestamp);

        const embed = new MessageEmbed()
            .addField(
                'Bot uptime',
                `${days} day(s)
                ${hours} hour(s)
                ${minutes} minute(s) `,
                true
            )
            .addField(
                'Bot started',
                `${time} CST
                ${date}`,
                true
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();
        message.channel.send(embed);
    }
};
