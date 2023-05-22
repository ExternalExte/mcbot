import { CommandInteractionOptionResolver, GuildMemberRoleManager, SlashCommandBuilder } from 'discord.js';
import { CommandInterface, Permission } from './CommandInterface.js';
import { invokeCloudFunction } from '../invoke.js';

if (!process.env.INSTANCE)
  throw Error('set instance Name');
const serverName = process.env.INSTANCE;
const roleChecker: (name: string) => Permission = name =>
({
  description: `\`${name}\`ロールを付与された人のみ`,
  filter: interaction => {
    const mcRole = interaction.guild?.roles.cache.find(r => r.name == name);
    if (!mcRole) return true;
    const roles = interaction.member?.roles
    if (roles instanceof GuildMemberRoleManager) {
      return roles.cache.has(mcRole.id);
    } else if (Array.isArray(roles)) {
      return roles.includes(mcRole.id);
    } else return false;
  }
});
export const on: CommandInterface = {
  data: new SlashCommandBuilder()
    .setName('on')
    .setDescription('サーバーを起動します')
    .setDMPermission(false),
  execute: async interaction => {
    interaction.reply('サーバーを起動しています....この操作には時間がかかる場合があります');
    await invokeCloudFunction(serverName, 'on');
  },
  permission: roleChecker('minecraft')
}
export const off: CommandInterface = {
  data: new SlashCommandBuilder()
    .setName('off')
    .setDescription('サーバーを停止します')
    .setDMPermission(false),
  execute: async interaction => {
    interaction.reply('サーバーを停止しています....');
    await invokeCloudFunction(serverName, 'off');
  },
  permission: roleChecker('minecraft')
}
export const status: CommandInterface = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('サーバーの現在の状態を確認できます')
    .setDMPermission(false),
  execute: async interaction => {
    interaction.reply('なんか色々出力できるようになったらいいな(現在開発中です)');
    // TODO!
  }
}

export const whitelist: CommandInterface = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('ホワイトリストにユーザーを追加できます')
        .addStringOption(op =>
          op.setName('user')
            .setDescription('マインクラフトID')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('ホワイトリストからユーザーを排除できます')
        .addStringOption(op =>
          op.setName('user')
            .setDescription('マインクラフトID')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('ホワイトリストに追加されているユーザー一覧を取得できます')
    )
    .setDescription('ホワイトリストを管理するコマンドです')
    .setDMPermission(false),
  execute: async interaction => {
    if (!(interaction.options instanceof CommandInteractionOptionResolver))
      throw Error('サブコマンドの取得が上手くいかなかったようです');
    switch (interaction.options.getSubcommand(true)) {
      case 'add': {
        const user = interaction.options.getString('user', true);
        console.log(`${user} is added`);
        break;
      }
      case 'remove': {
        const user = interaction.options.getString('user', true);
        console.log(`${user} is removed`);
        break;
      }
      case 'list': {
        console.log('cat whitelist');
        break;
      }
    }
    interaction.reply(`全然開発中やね`);
  },
  permission: roleChecker('operator')
}
