import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export type CommandExecutable = (interaction: CommandInteraction) => Promise<void>
export type Permission = {
  description: string,
  filter: (interaction: CommandInteraction) => Boolean
};
export type CommandInterface = { data: SlashCommandBuilder, execute: CommandExecutable, permission?: Permission }