const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'squad',
    category: 'guild',
    description: 'Adds user to the squad role (ping to play games)',
    run: async (client, message, args) => {
        let role = message.guild.roles.cache.find(
            (role) => role.name === 'Squad'
        );

        const embed = new MessageEmbed()
            .setTitle(`Added to ${role.name}`)
            .setDescription(`You have been removed from the ${role} role!`)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        const embedRemoved = new MessageEmbed()
            .setTitle(`Removed from ${role.name}`)
            .setDescription(`You have been added to the ${role} role!`)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        // check if the user has role already
        if (message.member.roles.cache.has(role.id)) {
            // remove role from user
            message.member.roles.remove(role);
            message.channel.send(embedRemoved);
        } else {
            // give user role
            message.member.roles.add(role);
            message.channel.send(embed);
        }
    },
};
