import { ActivityType } from 'discord.js';

export default {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        // set presence
        client.user.setPresence({
            activities: [{ name: 'eating hands', type: ActivityType.Competing }],
            status: 'online'
        });
        return;
    }
};
