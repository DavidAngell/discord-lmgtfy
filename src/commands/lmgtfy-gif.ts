import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder, User } from "discord.js";
import { Command } from "../command";
import path from 'node:path';
import fs from 'node:fs';

export default <Command> {
    data: new SlashCommandBuilder()
        .setName("lmgtfy-gif")
        .setDescription("Shames the user for not using Google")
        .addUserOption(option => option.setName('user').setDescription('User to shame').setRequired(true))
        .addStringOption(option => option.setName('query').setDescription('Search query or last message sent by user').setRequired(false)),
    
    execute: (interaction) => {
        try {
            const userToShame = interaction.options.getUser('user');
            if (!userToShame) {
                interaction.reply({ content: 'No user provided!', ephemeral: true });
                return;
            }

            const query = interaction.options.getString('query');

            // If a query is provided, use that
            if (query) {
                sendAndDeleteGif(interaction, query, userToShame?.id);
            } else {
                // Otherwise, get the last message from the user to shame
                interaction.channel?.messages.fetch({ limit: 50, before: interaction.id }).then(messages => {
                    const lastMessage = messages.find(message => message.author.id === userToShame?.id);
                    if (!lastMessage) {
                        interaction.reply({ content: 'No message found from the user to shame!', ephemeral: true });
                        return;
                    }
    
                    sendAndDeleteGif(interaction, lastMessage.content, userToShame?.id);
                });
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

async function makeGif(query: string): Promise<string[]> {
    // Create browser and page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Create a unique ID for the gif
    const gifId = uuidv4();

    // Start recording
    const recorder = new PuppeteerScreenRecorder(page);
    await recorder.start(`./images/${gifId}.mp4`); // supports extension - mp4, avi, webm and mov
    await page.goto(`https://letmegooglethat.com/?q=${query.replaceAll(' ', '%20')}`);
    await page.waitForTimeout(7000);
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

function sendAndDeleteGif(
    interaction: ChatInputCommandInteraction<CacheType>, 
    query: string, 
    userToShameId: string
    ) {
    interaction.deferReply({ ephemeral: true });
    makeGif(query).then(gifPath => {
        const url = `https://letmegooglethat.com/?q=${query?.replaceAll(' ', '%20')}`;
        interaction.channel?.send({ 
            files: [gifPath[0]], 
            content: `<@${userToShameId}> Here, let me Google that for you: <${url}>` 
        }).then(() => {
            interaction.editReply({ content: 'Shamed!' });
            fs.unlink(gifPath[0], err => { if (err) console.error(err) });
            fs.unlink(gifPath[1], err => { if (err) console.error(err) });
        });
    });
}