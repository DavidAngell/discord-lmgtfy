// Based on https://discord.js.org/docs/packages/discord.js/main
import { REST, Routes } from 'discord.js';
import { env } from './env';
import { importCommands } from './commands';

const { CLIENT_ID, TOKEN } = env;

importCommands().then(commandsCollection => {
  // Log the commands
  console.log("Commands found:");
  commandsCollection.forEach(command => console.log(`- ${command.data.name}: ${command.data.description}`));
  console.log();

  // Convert the commands collection to an array
  const commands = commandsCollection.map(command => command.data.toJSON());

  // Register all the commands to Discord
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  console.log('Started refreshing application (/) commands.');
  rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
    .then(() => console.log('Successfully reloaded application (/) commands.'))
    .catch(console.error);
});