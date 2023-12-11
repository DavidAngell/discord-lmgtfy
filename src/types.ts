import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export type Command = {
    data: SlashCommandBuilder,
    execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>,
};


export enum CommandErrorName {
    NoUserProvided = 'NoUserProvided',
    NoMessageFound = 'NoMessageFound',
    GifCreationFailed = 'GifCreationFailed',
}

export class CommandError extends Error {
    name: CommandErrorName;
    message: string;
    cause: any;

    constructor({ name, message, cause }: { name: CommandErrorName, message?: string, cause?: any }) {
        super();
        this.name = name;
        this.message = message || name;
        this.cause = cause;
    }
}