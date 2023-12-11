import { SlashCommandBuilder } from "discord.js";
import { Command } from "../command";
import path from 'node:path';

export default <Command> {
    data: new SlashCommandBuilder()
        .setName("lmgtfy")
        .setDescription("Shames the user for not using Google")
        .addUserOption(option => option.setName('user').setDescription('User to shame').setRequired(true))
        .addStringOption(option => option.setName('query').setDescription('Search query or last message sent by user').setRequired(false)),

    execute: (interaction) => {
        try {
            const userToShame = interaction.options.getUser('user');
            const query = interaction.options.getString('query');

            // If a query is provided, use that
            if (query) {
                const url = `https://letmegooglethat.com/?q=${query.replaceAll(' ', '%20')}`;
                interaction.channel?.send({ content: `<@${userToShame?.id}> Here, let me Google that for you: <${url}>` });
                interaction.reply({ content: 'Shamed!', ephemeral: true });
                return;
            }

            // Otherwise, get the last message from the user to shame
            interaction.channel?.messages.fetch({ limit: 50, before: interaction.id }).then(messages => {
                console.log(messages.filter(message => message.author.id === userToShame?.id));
                const lastMessage = messages.find(message => message.author.id === userToShame?.id);
                if (!lastMessage) {
                    interaction.reply({ content: 'No message found from the user to shame!', ephemeral: true });
                    return;
                }

                const url = `https://letmegooglethat.com/?q=${lastMessage.content?.replaceAll(' ', '%20')}`;
                interaction.channel?.send({ content: `<@${userToShame?.id}> Here, let me Google that for you: <${url}>` });
                interaction.reply({ content: 'Shamed!', ephemeral: true });
            });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};