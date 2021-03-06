const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'info',
    description: 'Returns all commands, or one specific command help',
    usage: '[ command | alias ]',
    run: async (client, message, args) => {
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return getAll(client, message);
        }
    }
};

function getAll(client, message) {
    const embed = new MessageEmbed()
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    const commands = (category) => {
        return client.commands
            .filter((cmd) => cmd.category === category)
            .map((cmd) => `- \`${cmd.name}\``)
            .join('\n');
    };

    const info = client.categories
        .map(
            (cat) =>
                `**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`
        )
        .reduce((string, category) => string + '\n\n' + category);

    return message.channel.send(embed.setDescription(info));
}

function getCMD(client, message, input) {
    const embed = new MessageEmbed()
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    const cmd =
        client.commands.get(input.toLowerCase()) ||
        client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `No information found for the command **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send(embed.setColor('RED').setDescription(info));
    }

    if (cmd.name) info = `**Command name**: ${cmd.name}`;
    if (cmd.aliases)
        info += `\n**Aliases**: ${cmd.aliases
            .map((a) => `\`${a}\``)
            .join(', ')}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}\n**Syntax**: <> = required, [] = optional`;
        embed.setFooter(client.user.username, client.user.displayAvatarURL());
    }

    return message.channel.send(embed.setColor('GREEN').setDescription(info));
}
