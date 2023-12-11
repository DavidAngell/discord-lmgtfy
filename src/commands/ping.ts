import { SlashCommandBuilder } from "discord.js";
import { Command } from "../command";

export default <Command> {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    execute: (interaction) => {
        interaction.reply({ content: "Pong!", ephemeral: true });
    },
};