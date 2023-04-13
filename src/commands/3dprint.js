import { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { config } from 'dotenv';

export default {
    data: new SlashCommandBuilder().setName('3dprint').setDescription('3d print screenshot'),
    async execute(interaction) {
        // dotenv setup
        config();
        const API = process.env.OCTOPRINT;

        // get data
        const url = 'http://192.168.1.129:4000';
        const print_result = await axios.get(url + '/api/printer?history=false', {
            headers: { 'X-Api-Key': API }
        });

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

        const fileName = job_result.data.job.file.name;
        const fileNameImage = fileName.replace(/ /g, '_');
        const progress = job_result.data.progress.completion.toFixed(2);
        const est_print_time = secondsToTime(job_result.data.job.estimatedPrintTime);
        const print_time = secondsToTime(job_result.data.progress.printTime);
        const print_time_left = secondsToTime(job_result.data.progress.printTimeLeft);

        const image = await axios.get('http://192.168.1.129:3000/?action=snapshot', {
            responseType: 'arraybuffer'
        });
        const buffer = Buffer.from(image.data, 'base64');
        const imageAttachment = new AttachmentBuilder(buffer, {
            name: `${fileNameImage}.jpg`
        });

        // create embed
        const imageEmbed = new EmbedBuilder()
            .setTitle(`LlamaPrint-3000`)
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
            .setImage(`attachment://${fileNameImage}.jpg`)
            .setFooter({
                text: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [imageEmbed],
            files: [imageAttachment]
        });
        return;
    }
};

function secondsToTime(seconds) {
    return new Date(seconds * 1000).toISOString().substring(11, 19);
}
