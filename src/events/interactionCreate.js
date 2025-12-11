import {Events} from "discord.js";

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        console.log(
            `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction`
        );

        // ChatInputCommand
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.default.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
            return;

            // SelectMenu, Modal
        } else if (interaction.isSelectMenu() || interaction.isModalSubmit()) {
            const customId = interaction.customId.split('_')[0];
            const command = interaction.client.commands.get(customId);

            if (!command) return;

            try {
                await command.default.response(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
            return;
        }
    }
};
