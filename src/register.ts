// Based on https://discord.js.org/docs/packages/discord.js/main
import fs from 'node:fs';
import path from 'node:path';
import { Collection, REST, Routes } from 'discord.js';
import { env } from './env';
import { Command } from './types';

const { CLIENT_ID, TOKEN } = env;

// Import all the commands from the commands folder
export async function importCommands(): Promise<Collection<string, Command>> {
  const commands = new Collection<string, Command>();

  const foldersPath = path.join(__dirname, 'commands');
  const commandsFolder = fs.readdirSync(foldersPath);
  for (const file of commandsFolder.filter(file => file.endsWith('.js'))) {
    const filePath = path.join(foldersPath, file);

    // Import the command file
    const commandFile = await import(filePath);
    if (!('default' in commandFile)) {
      console.log(`[WARNING] The command at ${filePath} is missing a default export.`);
      continue;
    }

    // Add the command to the collection if it has data and execute properties
    const command = commandFile.default;
    if ('data' in command && 'execute' in command) {
      commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }

  return commands;
}

importCommands().then(async commandsCollection => {
  // Log the commands
  console.log("Commands found:");
  commandsCollection.forEach(command => console.log(`- ${command.data.name}: ${command.data.description}`));
  console.log();

  // Convert the commands collection to an array
  const commands = commandsCollection.map(command => command.data.toJSON());

  // Register all the commands to Discord
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});