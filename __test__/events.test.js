import { default as messageCreate } from '../src/events/messageCreate.js';
import jest from 'jest-mock';

describe('events', () => {
    // sample data
    const message = {
        content: 'gamer',
        author: {
            bot: false
        },
        reply: jest.fn()
    };

    it('should be called with reply on gamer', async () => {
        messageCreate.execute(message);
        expect(message.reply).toHaveBeenCalledWith('gamer');
    });
});
