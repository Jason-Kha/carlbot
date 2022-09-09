export default {
    name: 'messageCreate',
    async execute(message) {
        if (message.content.bot) return;

        const content = message.content;

        // gamer moment
        if (content.toLowerCase().includes('gamer')) {
            await message.reply('gamer');
        }
        return;
    }
};
