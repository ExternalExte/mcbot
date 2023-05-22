import 'dotenv/config';
import { Client, Events, GatewayIntentBits, InteractionReplyOptions } from 'discord.js';
import { CommandRegister } from './commands/CommandRegister.js';
import { CommandInterface } from './commands/CommandInterface.js';

// コマンドが増えたら一括importできるようにする
import { off, on, status, whitelist } from './commands/commands.js';
import { help } from './commands/help.js';

async function main() {
  const client = new Client({
    // 取り合えずIntentsは厳しめで動かなかったら増やせばいいよね
    intents: [
      GatewayIntentBits.Guilds
    ]
  });
  const commands: CommandInterface[] = [on, off, status, whitelist];
  help.generateHelpText(commands);
  commands.push(help);
  client.on(Events.ClientReady, async () => console.log('Discord Client ready!'));
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.inCachedGuild || !interaction.isChatInputCommand()) return;
    console.log(`interaction: ${interaction.commandName}`);
    const command = commands.find(c => c.data.name == interaction.commandName);
    if (!command) return;
    if (command.permission != undefined && !command.permission.filter(interaction)) {
      interaction.reply('そのコマンドを実行する権限がありません！');
      return;
    }
    return command.execute(interaction).catch(err => {
      console.error(err);
      const content: InteractionReplyOptions = { content: 'コマンドの実行中にエラーが起こったみたい', ephemeral: true };
      if (interaction.replied || interaction.deferred)
        interaction.followUp(content);
      else
        interaction.reply(content);
    });
  });

  // CommandRegisterよりclient.loginが先じゃないとダメっぽい
  // 何故かは知らん
  await client.login();
  await CommandRegister(client, commands);
};
main();