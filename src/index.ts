import { env } from './env';

const { TOKEN } = env;

import { Client, GatewayIntentBits } from 'discord.js';
import { importCommands } from './register';
import { Worker } from 'worker_threads';

importCommands().then(async commands => {
  const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
  });

  client.on('ready', () => console.log(`Logged in as ${client.user?.tag}!`));

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (!commands.has(interaction.commandName)) {
      console.log(`[WARNING] The command ${interaction.commandName} was not found.`);
      return;
    }

    commands.get(interaction.commandName)?.execute(interaction);
  });

  client.login(TOKEN);
});