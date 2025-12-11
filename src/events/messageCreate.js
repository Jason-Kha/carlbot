import {Events} from "discord.js";

export default {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const content = message.content;

        if(content.includes('<:Carl:676493897932734494>')) {
            await message.react(message.guild.emojis.cache.get('676493897932734494'))
        }

        // gamer moment
        if (content.toLowerCase().includes('gamer')) {
            await message.reply('gamer?');
        }

        // letter reactions
        if (
            content.toLowerCase().split(' ').includes('g') ||
            content.toLowerCase().split(' ').includes('ñ') ||
            content.toLowerCase().split(' ').includes('h')
        ) {
            await message.react('🇬');
        }

        // proof
        if (content.toLowerCase().includes('proof?')) {
            await message.reply('ur moms house');
        }

        return;
    }
};
