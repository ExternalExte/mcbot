import { Client, REST, Routes } from 'discord.js';
import { CommandInterface } from './CommandInterface.js';

export async function CommandRegister(client: Client, commands: CommandInterface[]) {
	const Token = process.env.DISCORD_TOKEN;
	if(!Token)
		throw Error('Please set $DISCORD_TOKEN');
	const ClientID = process.env.DISCORD_CLIENT_ID;
	if(!ClientID)
		throw Error('Please set $DISCORD_CLIENT_ID');
	const rest = new REST({ version: '10' }).setToken(Token);
	console.log(`${commands.length}件のコマンドの登録を試みます`)
	for (const guild of client.guilds.cache) {
		await rest.put(
			Routes.applicationGuildCommands(ClientID, guild[1].id),
			{ body: commands.map(c => c.data.toJSON()) },
		);
	}
	console.log(`コマンドの登録が完了しました`)
}