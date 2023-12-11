import fs from 'node:fs';
import path from 'node:path';
import { Collection } from 'discord.js';
import { Command } from './types';

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