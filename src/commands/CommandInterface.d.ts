import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export type CommandExecutable = (interaction: CommandInteraction) => Promise<void>
export type CommandInterface = { data: SlashCommandBuilder, execute: CommandExecutable }