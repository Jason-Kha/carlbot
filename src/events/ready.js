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
    { name: `Factorio`, type: ActivityType.Streaming },
    { name: `Factorio`, type: ActivityType.Watching },
    { name: `Factorio`, type: ActivityType.Listening },
    { name: `Factorio`, type: ActivityType.Competing }
];

let bStatus = botStatus.Idle;
let activityStatus;
let requestNewStatus = true;

export default {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        // bot initially chilling
        activityStatus = randomStatuses[Math.floor(Math.random() * randomStatuses.length)];

        // start intervals
        async function startSetInterval() {
            // initial status update
            UpdateBotStatus();

            // update status every 30 seconds
            setInterval(async () => {
                UpdateBotStatus();
            }, 60 * 1000);

            // update random status every half an hour
            setInterval(async () => {
                requestNewStatus = true;
            }, 1800 * 1000);
        }

        // start intervals
        startSetInterval(API);

        // update presence every 60 seconds
        setInterval(() => {
            client.user.setPresence({
                activities: [activityStatus],
                status: 'online'
            });
        }, 60 * 1000);

        return;
    }
};

async function IsPrinting() {
    // check print
    // get data
    const url = 'http://192.168.1.129:4000';
    const print_result = await axios.get(url + '/api/printer?history=false', {
        headers: { 'X-Api-Key': API }
    });

    // get printer state
    const state = print_result.data.state.flags.printing;

    return state;
}

async function GetPrintPercentage() {
    const url = 'http://192.168.1.129:4000';
    const job_result = await axios.get(url + '/api/job', {
        headers: { 'X-Api-Key': API }
    });
    const progress = job_result.data.progress.completion.toFixed(2);

    return progress;
}

function GetBotStatus() {
    if (IsPrinting()) {
        bStatus = botStatus.Printing;
    } else {
        bStatus = botStatus.Idle;
    }

    return bStatus;
}

async function UpdateBotStatus() {
    switch (GetBotStatus()) {
        case 'idle':
            if (requestNewStatus) {
                activityStatus = randomStatuses[Math.floor(Math.random() * randomStatuses.length)];
                requestNewStatus = false;
            }
            break;
        case 'printing':
            activityStatus = {
                name: `3D Prints (${await GetPrintPercentage()}%)`,
                type: ActivityType.Watching
            };
            break;

        default:
            activityStatus = randomStatuses[Math.floor(Math.random() * randomStatuses.length)];
            break;
    }
}
