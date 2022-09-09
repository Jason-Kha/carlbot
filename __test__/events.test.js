import { default as messageCreate } from '../src/events/messageCreate.js';
import { jest } from '@jest/globals';

describe('events', () => {
    // sample data
    const message = {
        content: 'hello gamers',
        author: {
            bot: false
        },
        reply: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be called with reply on gamer', async () => {
        messageCreate.execute(message);
        expect(message.reply).toHaveBeenCalledWith('gamer');
    });
});
