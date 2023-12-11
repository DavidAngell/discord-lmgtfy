import { env } from './env';

const { TOKEN } = env.unwrap();

import { Client, GatewayIntentBits } from 'discord.js';
import { importCommands } from './register';

importCommands().then(async commands => {
  const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
  });

  client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (!commands.has(interaction.commandName)) {
      console.log(`[WARNING] The command ${interaction.commandName} was not found.`);
      return;
    }

    try {
      commands.get(interaction.commandName)?.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  });

  client.login(TOKEN);
});