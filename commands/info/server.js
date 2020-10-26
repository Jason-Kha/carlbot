const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'server',
    aliases: ['serverinfo'],
    category: 'info',
    description: 'Displays server info',
    run: async (client, message, args) => {
        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? ' day' : ' days') + ' ago';
        }

        let region = {
            brazil: ':flag_br: Brazil',
            'eu-central': ':flag_eu: Central Europe',
            singapore: ':flag_sg: Singapore',
            'us-central': ':flag_us: U.S. Central',
            sydney: ':flag_au: Sydney',
            'us-east': ':flag_us: U.S. East',
            'us-south': ':flag_us: U.S. South',
            'us-west': ':flag_us: U.S. West',
            'eu-west': ':flag_eu: Western Europe',
            'vip-us-east': ':flag_us: VIP U.S. East',
            london: ':flag_gb: London',
            amsterdam: ':flag_nl: Amsterdam',
            hongkong: ':flag_hk: Hong Kong',
            russia: ':flag_ru: Russia',
            southafrica: ':flag_za:  South Africa'
        };

        const embed = new MessageEmbed()
            .addField(
                'Owner',
                `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`,
                true
            )
            .addField('Region', region[message.guild.region], true)
            .addField(
                'Users',
                `${
                    message.guild.members.cache.filter(
                        (member) => !member.user.bot
                    ).size
                }`,
                true
            )
            .addField(
                'Creation Date',
                `${message.channel.guild.createdAt
                    .toUTCString()
                    .substr(0, 16)} (${checkDays(
                    message.channel.guild.createdAt
                )})`,
                true
            )
            .setThumbnail(message.guild.iconURL({ size: 4096 }))
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        await message.channel.send(embed);
    }
};
