import { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { config } from 'dotenv';

export default {
    data: new SlashCommandBuilder()
        .setName('3dprint')
        .setDescription('3d print screenshot')
        .addBooleanOption((option) =>
            option
                .setName('visible')
                .setDescription('Show this message to other users (default: false) [true|false]')
        ),
    async execute(interaction) {
        // options
        const { options } = interaction;

        // dotenv setup
        config();
        const API = process.env.OCTOPRINT;

        // get data
        const url = 'http://192.168.1.129:4000';
        const print_result = await axios.get(url + '/api/printer?history=false', {
            headers: { 'X-Api-Key': API }
        });

        // get printer state
        const state = print_result.data.state.flags.printing;

        if (!state) {
            await interaction.reply({
                content: 'Nothing is being printed right now!',
                ephemeral: true
            });
            return;
        }

        const extruder_temp = print_result.data.temperature.tool0.actual;
        const bed_temp = print_result.data.temperature.bed.actual;

        const job_result = await axios.get(url + '/api/job', {
            headers: { 'X-Api-Key': API }
        });

        const fileNameRaw = job_result.data.job.file.name;
        const fileName = fileNameRaw.substring(0, fileNameRaw.lastIndexOf('.'));
        const fileNameScreenshot = fileName.replace(/ /g, '_');
        const fileNameThumbnail = fileName.replace(/ /g, '_').concat('-thumbnail');
        const progress = job_result.data.progress.completion.toFixed(2);
        const est_print_time = secondsToTime(job_result.data.job.estimatedPrintTime);
        const print_time = secondsToTime(job_result.data.progress.printTime);
        const print_time_left = secondsToTime(job_result.data.progress.printTimeLeft);

        // get camera screenshot
        const screenshot = await getImage(
            'http://192.168.1.129:3000/?action=snapshot',
            fileNameScreenshot,
            'jpg'
        );

        // get thumbnail screnshot if exists
        const thumbnail = await getImage(
            `${url}/plugin/prusaslicerthumbnails/thumbnail/${fileName}.png`,
            fileNameThumbnail,
            'png'
        );

        // create embeds
        const imageEmbed = new EmbedBuilder()
            //.setTitle(`LlamaPrint-3000`)
            // using google.com since discord js requires a url to attach multiple images unfortunately
            .setURL('https://google.com')
            .addFields(
                {
                    name: 'Job Information',
                    value: `**\\> File:** ${fileName}\n**\\> Progress (height):** ${progress}%\n**\\> Est. Print Time:** ${est_print_time}\n**\\> Cur. Print Time:** ${print_time}\n**\\> Time Left:** ${print_time_left}`,
                    inline: true
                },
                {
                    name: 'Printer Information',
                    value: `**\\> Extruder Temp:** ${extruder_temp} C°\n**\\> Bed Temp:** ${bed_temp} C°`,
                    inline: true
                }
            )
            .setImage(`attachment://${fileNameScreenshot}.jpg`)
            .setFooter({
                text: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTimestamp();

        const thumbnailEmbed = new EmbedBuilder()
            .setURL('https://google.com')
            .setImage(`attachment://${fileNameThumbnail}.png`);

        // send embed
        if (typeof thumbnail === 'undefined' || thumbnail === null) {
            await interaction.reply({
                embeds: [imageEmbed],
                files: [screenshot],
                ephemeral: !options.getBoolean('visible')
            });
        } else {
            await interaction.reply({
                embeds: [imageEmbed, thumbnailEmbed],
                files: [screenshot, thumbnail],
                ephemeral: !options.getBoolean('visible')
            });
        }
        return;
    }
};

// convert seconds to time (hh:mm:ss)
function secondsToTime(seconds) {
    return new Date(seconds * 1000).toISOString().substring(11, 19);
}

async function getImage(url, fileName, fileType) {
    // get image
    try {
        const image = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        // convert to buffer
        const buffer = Buffer.from(image.data, 'base64');

        // convert to image attachment
        const imageAttachment = new AttachmentBuilder(buffer, {
            name: `${fileName}.${fileType}}`
        });

        // return Attachment
        return imageAttachment;
    } catch (err) {
        console.log(err);
    }

    // if nothing return undefined
    return undefined;
}
