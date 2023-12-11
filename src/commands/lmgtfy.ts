import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder, User } from "discord.js";
import { Command } from "../types";
import fs from 'node:fs';

export default <Command> {
    data: new SlashCommandBuilder()
        .setName("lmgtfy")
        .setDescription("Shames the user for not using Google")
        .addUserOption(option => option.setName('user').setDescription('User to shame').setRequired(true))
        .addStringOption(option => option.setName('query').setDescription('Search query or last message sent by user').setRequired(false))
        .addBooleanOption(option => option.setName('send-gif').setDescription('Whether to send a gif or not').setRequired(false)),
    
    execute: async (interaction) => {
        try {
            const userToShame = interaction.options.getUser('user');
            if (!userToShame) {
                interaction.reply({ content: 'No user provided!', ephemeral: true });
                return;
            }
            
            const query = interaction.options.getString('query');
            const sendGif = interaction.options.getBoolean('send-gif');

            // If a query is provided, use that
            if (query) {
                // If the user wants to send a gif, create and send it
                if (sendGif === false) {
                    const url = `https://letmegooglethat.com/?q=${query.replaceAll(' ', '%20')}`;
                    await interaction.channel?.send({ content: `<@${userToShame?.id}> Here, let me Google that for you: <${url}>` })
                    interaction.reply({ content: 'Shamed!', ephemeral: true })
                } else {
                    createAndSendGif(interaction, query, userToShame?.id);
                }
            } else {
                // Otherwise, get the last message from the user to shame
                const messages = await interaction.channel?.messages.fetch({ limit: 50, before: interaction.id })
                const lastMessage = messages?.find(message => message.author.id === userToShame?.id);
                if (!lastMessage) {
                    interaction.reply({ content: 'No message found from the user to shame!', ephemeral: true });
                    return;
                }

                // If the user wants to send a gif, create and send it
                if (sendGif === false) {
                    const url = `https://letmegooglethat.com/?q=${lastMessage.content?.replaceAll(' ', '%20')}`;
                    await interaction.channel?.send({ content: `<@${userToShame?.id}> Here, let me Google that for you: <${url}>` })
                    interaction.reply({ content: 'Shamed!', ephemeral: true }); 
                } else {
                    createAndSendGif(interaction, lastMessage.content, userToShame?.id);
                }
            }

        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};

import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';

async function createGif(query: string): Promise<string[]> {
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