import {Events} from "discord.js";

export default {
    name: Events.MessageReactionAdd,
    async execute(messageReaction, user) {
        if (user.bot) return;

        // const id = '257303326184570880';
        const id = '173490982023593984';
        // console.log(messageReaction);

        // if id matches user
        if (user.id === id) {
            //messageReaction.message.react('😎');
        }

        if (messageReaction.emoji.name === 'Carl') {
            messageReaction.message.react(messageReaction.message.guild.emojis.cache.get('676493897932734494'))
        }

        return;
    }
};
