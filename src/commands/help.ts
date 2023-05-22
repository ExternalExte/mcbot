import { SlashCommandBuilder } from 'discord.js';
import { CommandInterface } from './CommandInterface.js';

type HelpText = {
  generateHelpText: (commands: CommandInterface[]) => void;
  helpText: string;
};

export const help: CommandInterface & HelpText = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('各コマンドの詳細を確認できます')
    .setDMPermission(false),
  execute: async interaction => {
    interaction.reply(help.helpText);
  },
  generateHelpText(commands) {
    for (const cmd of commands) {
      this.helpText +=
        `- **\`${cmd.data.name}\`コマンド**
  - ${cmd.data.description}
  - 対象ユーザー: ${cmd.permission?.description ?? '全ユーザー'}
`
    }
  },
  helpText: ''

}