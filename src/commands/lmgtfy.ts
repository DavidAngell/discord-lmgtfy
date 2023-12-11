import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder, User } from "discord.js";
import { Command, CommandError, CommandErrorName } from "../types";
import fs from 'node:fs';

export default <Command> {
    data: new SlashCommandBuilder()
        .setName("lmgtfy")
        .setDescription("Shames the user for not using Google")
        .addUserOption(option => option.setName('user').setDescription('User to shame').setRequired(true))
        .addStringOption(option => option.setName('query').setDescription('Search query or last message sent by user').setRequired(false))
        .addBooleanOption(option => option.setName('send-gif').setDescription('Whether to send a gif or not').setRequired(false)),
    
    execute: async (interaction) => {
        const userToShame = interaction.options.getUser('user');
        if (!userToShame)  throw new CommandError({ 
            name: CommandErrorName.NoUserProvided,
            message: 'Please provide a user to shame.',
        });
        
        const queryRevieved = interaction.options.getString('query');
        const query = (queryRevieved) 
            ? queryRevieved                                             // If the user provided a query, use that
            : await getLastMessageFromUser(interaction, userToShame);   // Otherwise, get the last message from the user

        // If the user wants to send a gif
        if (interaction.options.getBoolean('send-gif') === false) {
            const url = `https://letmegooglethat.com/?q=${query.replaceAll(' ', '%20')}`;
            await interaction.channel?.send({ content: `<@${userToShame?.id}> Here, let me Google that for you: <${url}>` })
            interaction.reply({ content: 'Shamed!', ephemeral: true }); 
        } else {
            createAndSendGif(interaction, query, userToShame?.id);
        }
    },
};

// Get the last message from a user in a channel
async function getLastMessageFromUser(interaction: ChatInputCommandInteraction<CacheType>, user: User) {
    const messages = await interaction.channel?.messages.fetch({ limit: 50, before: interaction.id })
    const lastMessage = messages?.find(message => message.author.id === user?.id);
    if (!lastMessage) throw new CommandError({
        name: CommandErrorName.NoMessageFound,
        message: `No message found from <@${user?.id}> in this channel.`,
    });

    return lastMessage.content;
}

import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';

// Create a gif of letmegooglethat.com using the passed search query
async function createGif(query: string): Promise<string[]> {
    try {
        // Create browser and page
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Create a unique ID for the gif
        const gifId = uuidv4();

        // Start recording
        const recorder = new PuppeteerScreenRecorder(page);
        await recorder.start(`./images/${gifId}.mp4`); // supports extension - mp4, avi, webm and mov
        await page.goto(`https://letmegooglethat.com/?q=${query.replaceAll(' ', '%20')}`);

        // TODO: Speed up animation (doesn't work)
        // await page._client.send('Animation.setPlaybackRate', { playbackRate: 2 });

        // TODO: come up with a better way to wait for the animation to finish
        await page.waitForTimeout(8000);

        await recorder.stop();
        await browser.close();

        // Convert the video to a gif
        await new Promise((resolve, reject) => {
            ffmpeg(`./images/${gifId}.mp4`)
                .withVideoFilter('setpts=0.3*PTS')
                .output(`./images/${gifId}.gif`)
                .on('end', resolve)
                .on('error', reject)
                .run();
        });

        return [`./images/${gifId}.gif`, `./images/${gifId}.mp4`];
    } catch (error) {
        console.error(error);
        throw new CommandError({
            name: CommandErrorName.GifCreationFailed,
            message: 'There was an error creating the gif.',
            cause: error,
        });
    }
}

async function createAndSendGif(
    interaction: ChatInputCommandInteraction<CacheType>, 
    query: string, 
    userToShameId: string
    ) {
    // Defer the reply to avoid the timeout
    interaction.deferReply({ ephemeral: true });
    
    // Create the gif
    const gifPath = await createGif(query);
    
    // Send the gif
    const url = `https://letmegooglethat.com/?q=${query?.replaceAll(' ', '%20')}`;
    await interaction.channel?.send({ 
        files: [gifPath[0]],
        content: `<@${userToShameId}> Here, let me Google that for you: <${url}>` 
    });

    // Update reply to user who used the command
    interaction.editReply({ content: 'Shamed!' });

    // Delete the gif and mp4
    fs.unlink(gifPath[0], err => { if (err) console.error(err) });
    fs.unlink(gifPath[1], err => { if (err) console.error(err) });
}