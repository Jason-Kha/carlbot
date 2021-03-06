const config = require('config');
const { MessageEmbed } = require('discord.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

require('dotenv').config();

module.exports = {
    name: 'watch2gether',
    aliases: ['w2', 'wt', 'watch'],
    category: 'fun',
    description: 'Set up a Watch2Gether room',
    usage: '[url]',
    run: async (client, message, args) => {
        if (args.length > 1) {
            const embedErr = new MessageEmbed()
                .setColor('RED')
                .setTitle(':no_entry_sign: Too many arguments')
                .setDescription(
                    `Usage: ${
                        process.env.PREFIX || config.get('prefix')
                    }watch2gether [url]`
                )
                .setFooter(client.user.username, client.user.displayAvatarURL())
                .setTimestamp();
            return message.channel.send(embedErr);
        }

        // remove embeds, if any
        message.suppressEmbeds(true);

        const Http = new XMLHttpRequest();
        const url = 'https://www.watch2gether.com/rooms/create.json';

        // create POST request
        Http.open('POST', url, true);
        Http.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded'
        );
        Http.onload = function () {
            if (this.readyState === this.DONE) {
                if (this.status === 200) {
                    const json = this.responseText;
                    const data = JSON.parse(json);
                    const streamkey = data['streamkey'];

                    const embed = new MessageEmbed()
                        .setColor('YELLOW')
                        .setTitle('Watch2gether')
                        .setURL(
                            `https://www.watch2gether.com/rooms/${streamkey}`
                        )
                        .setDescription(
                            `Watch2Gether lets you watch videos with your friends, synchronized at the same time.\n\nhttps://www.watch2gether.com/rooms/${streamkey}`
                        )
                        .setThumbnail(
                            'https://www.watch2gether.com/static/watch2gether-share.jpg'
                        )
                        .setFooter(
                            client.user.username,
                            client.user.displayAvatarURL()
                        )
                        .setTimestamp();

                    message.channel.send(embed);
                } else {
                    const embedErr = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(':no_entry_sign: Error')
                        .setDescription(
                            'Something went wrong, try again later!'
                        )
                        .setFooter(
                            client.user.username,
                            client.user.displayAvatarURL()
                        )
                        .setTimestamp();

                    message.channel.send(embedErr);
                }
            }
        };

        var api_key = process.env.WATCH2GETHER || config.get('watch2gether');

        // send parameters
        if (args === null) {
            Http.send(`w2g_api_key=${api_key}&bg_color=#000000`);
        } else {
            const share = args[0];
            Http.send(`w2g_api_key=${api_key}&share=${share}&bg_color=#000000`);
        }
    }
};
