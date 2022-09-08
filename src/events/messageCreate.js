export default {
    name: 'messageCreate',
    async execute(message) {
        const content = message.content;

        // gamer moment
        if (content.toLowerCase().includes('gamer') && !message.author.bot) {
            await message.reply('gamer');
        }
        return;
    }
};
