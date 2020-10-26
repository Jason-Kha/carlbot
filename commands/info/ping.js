const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    category: 'info',
    description: 'Returns latency and API ping',
    run: async (client, message, args) => {
        msg = await message.channel.send(`Pinging...`);

        const embed = new MessageEmbed()
            .setTitle('🏓 Pong!')
            .setDescription(
                `Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms!`
            )
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        msg.delete();
        message.channel.send(embed);
    }
};
