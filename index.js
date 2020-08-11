const { Client, Collection, MessageEmbed } = require('discord.js');
const connectDB = require('./handler/db');
const config = require('config');
const fs = require('fs');

// connect DB
connectDB();

const client = new Client({
    disableEveryone: true,
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./commands/');

// command setup
['command'].forEach((handler) => {
    require(`./handler/${handler}`)(client);
});

// bot setup
client.on('ready', () => {
    console.log(`Bot by Jason K.\nLogged in as ${client.user.id}`);

    client.user.setPresence({
        activity: {
            name: 'Alpaca Blaster 2000',
        },
        status: 'online',
    });
});

// handle messages
client.on('message', async (message) => {
    const prefix = config.util.getEnv('PREFIX') || config.get('prefix');

    // ignore bot messages
    if (message.author.bot) return;

    // ignore message not sent in guild channels
    if (!message.guild) return;

    // cool letter
    if (message.content.toLowerCase() === 'g') message.react('👍');

    // dumb letters
    if (
        message.content.toLowerCase() === 'h' ||
        message.content.toLowerCase() === 'ñ'
    )
        message.react('👎');

    // ignore messages not starting with the prefix
    if (!message.content.startsWith(prefix)) return;

    if (!message.member)
        message.member = await message.guild.fetchMember(message);

    // output if command
    console.log(`${message.author.username} said ${message.content}`);

    // get arguments
    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    // get command
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) command.run(client, message, args);
    else {
        const embed = new MessageEmbed()
            .setColor('RED')
            .setTitle(':no_entry_sign: Invalid command')
            .setDescription(`Type **${prefix}help** for more information.`)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();
        message.channel.send(embed);
    }
});

// give new user role upon joining
client.on('guildMemberAdd', (guildMember) => {
    guildMember.roles.add(
        guildMember.guild.roles.cache.find((role) => role.name === 'Dinos')
    );
});

// discord login
client.login(config.util.getEnv('DISCORDTOKEN') || config.get('discordToken'));
