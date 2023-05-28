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
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        // update bot status
        await UpdateBotStatus();
        client.user.setPresence({
            activities: [activityStatus],
            status: 'online'
        });

        // start intervals
        startSetInterval();

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
    let state;
    let print_result;
    try {
        print_result = await axios.get(url + '/api/printer?history=false', {
            headers: { 'X-Api-Key': API }
        });
        state = print_result.data.state.flags.printing;
    } catch (error) {
        if (error.response) {
            return false;
        } else if (error.request) {
            // The client never received a response, and the request was never left
            console.log(error.request);
        } else {
            // Anything else
            console.log(error.request);
        }
    }

    // get printer state

    return state;
}

// start intervals
async function startSetInterval() {
    // initial status update
    UpdateBotStatus();

    // update status every 60 seconds
    setInterval(async () => {
        UpdateBotStatus();
    }, 5 * 1000);

    // update random status every half an hour
    setInterval(async () => {
        requestNewStatus = true;
    }, 5 * 1000);
}

async function GetPrintPercentage() {
    const url = 'http://192.168.1.129:4000';

    let job_result;
    let progress = 0;

    try {
        if (await IsPrinting()) {
            job_result = await axios.get(url + '/api/job', {
                headers: { 'X-Api-Key': API }
            });
            progress = job_result.data.progress.completion.toFixed(2);
        }
    } catch (error) {
        console.log(error);
        progress = 0;
    }

    return progress;
}

async function GetBotStatus() {
    if (await IsPrinting()) {
        bStatus = botStatus.Printing;
    } else {
        bStatus = botStatus.Idle;
    }

    return bStatus;
}

async function UpdateBotStatus() {
    switch (await GetBotStatus()) {
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
