import { ActivityType } from 'discord.js';
import axios from 'axios';
import { config } from 'dotenv';

// dotenv setup
config();
const API = process.env.OCTOPRINT;

const botStatus = {
    Idle: 'idle',
    Printing: 'printing'
};

const randomStatuses = [
    { name: `Factorio`, type: ActivityType.Playing },
    { name: `Stardew Valley`, type: ActivityType.Playing },
    { name: `Morrowind`, type: ActivityType.Playing },
    { name: `Vintage Story`, type: ActivityType.Playing }
    // { name: `Factorio`, type: ActivityType.Streaming },
    // { name: `Factorio`, type: ActivityType.Watching },
    // { name: `Factorio`, type: ActivityType.Listening },
    // { name: `Factorio`, type: ActivityType.Competing }
];

let bStatus = botStatus.Idle;
let activityStatus;
let requestNewStatus = true;

export default {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        // update bot status
        await UpdateBotStatus();
        client.user.setPresence({
            activities: [activityStatus],
            status: 'online'
        });

        // start intervals
        await startSetInterval();

        // update presence every 60 seconds
        setInterval(() => {
            client.user.setPresence({
                activities: [activityStatus],
                status: 'online'
            });
        }, 60 * 1000);


    }
};