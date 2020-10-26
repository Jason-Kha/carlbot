const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'sourcecode',
    aliases: ['code', 'opensource', 'source'],
    category: 'info',
    description: 'carlbot source code',
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setTitle('Source code')
            .setDescription(
                'Here is my source code:\nhttps://github.com/Jason-Kha/carlbot\n',
                true
            )
            .setThumbnail(
                'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
            )
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        await message.channel.send(embed);
    }
};
