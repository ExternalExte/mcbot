import 'dotenv/config';
import { exit } from 'process';

function EnvironmentVariableChecker() {
  console.log('checking environment variable....');
  console.log('----Discord----');
  if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT)
    exit(1);
  console.log('----Google Cloud Platform----');
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS || !process.env.FUNCTION_URL || !process.env.INSTANCE)
    exit(1);
  console.log('----Minecraft----');
  if (!process.env.MINECRAFT_HOST || !process.env.MINECRAFT_PASS)
    exit(1);
  return {
    'Discord': {
      'token': process.env.DISCORD_TOKEN,
      'client': process.env.DISCORD_CLIENT
    },
    'Google': {
      'application credentials': process.env.GOOGLE_APPLICATION_CREDENTIALS,
      'function url': process.env.FUNCTION_URL,
      'instance name': process.env.INSTANCE
    },
    'Minecraft': {
      'server url': process.env.MINECRAFT_HOST,
      'rcon password': process.env.MINECRAFT_PASS
    }
  };
}
export const EnvironmentVariable = EnvironmentVariableChecker();
export const DiscordEnv = EnvironmentVariable.Discord;
export const GoogleEnv = EnvironmentVariable.Google;
export const MinecraftEnv = EnvironmentVariable.Minecraft;
