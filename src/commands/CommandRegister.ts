import { Client, REST, Routes } from 'discord.js';
import { CommandInterface } from './CommandInterface.js';
import { DiscordEnv } from '../config.js';

export async function CommandRegister(client: Client, commands: CommandInterface[]) {
	const rest = new REST({ version: '10' }).setToken(DiscordEnv.token);
	console.log(`${commands.length}件のコマンドの登録を試みます`)
	for (const guild of client.guilds.cache) {
		await rest.put(
			Routes.applicationGuildCommands(DiscordEnv.client, guild[1].id),
			{ body: commands.map(c => c.data.toJSON()) },
		);
	}
	console.log(`コマンドの登録が完了しました`)
}