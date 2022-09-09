export default {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const content = message.content;

        // gamer moment
        if (content.toLowerCase().includes('gamer')) {
            await message.reply('gamer');
            return;
        }

        // letter reactions
        if (
            content.toLowerCase().split(' ').includes('g') ||
            content.toLowerCase().split(' ').includes('ñ') ||
            content.toLowerCase().split(' ').includes('h')
        ) {
            await message.react('🇬');
            return;
        }
        return;
    }
};
