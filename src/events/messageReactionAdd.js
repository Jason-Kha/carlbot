export default {
    name: 'messageReactionAdd',
    async execute(messageReaction, user) {
        if (user.bot) return;
        // const id = '257303326184570880';
        const id = '173490982023593984';
        // console.log(messageReaction);

        // if id matches user
        if (user.id === id) {
            //messageReaction.message.react('😎');
        }
        return;
    }
};
