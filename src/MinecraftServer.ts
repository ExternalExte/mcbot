import { GoogleAuth, IdTokenClient } from 'google-auth-library';
import { Rcon } from 'rcon-client/lib/rcon.js';
import { MinecraftEnv, GoogleEnv } from './config.js'
export class MinecraftServer {
  isBooting = true;
  private rconClient: Rcon | undefined = undefined;
  private gcfInvoker = new gcfInvoker();
  async send(command: string) {
    if (this.isBooting && this.rconClient) return this.rconClient.send(command);
    return 'サーバーは停止しています';
  }
  async start() {
    if (!this.isBooting) {
      await this.gcfInvoker.switch('on');
      this.rconClient = await Rcon.connect({
        host: MinecraftEnv['server url'],
        port: 25575,
        password: MinecraftEnv['rcon password']
      });
      this.isBooting = true;
      return 'サーバーを起動しました';
    }
    return 'サーバーは既に起動しています';
  }
  async stop() {
    if (this.isBooting) {
      await this.send('stop');
      await this.gcfInvoker.switch('off');
      this.isBooting = false;
      this.rconClient = undefined;
      return 'サーバーを停止しました';
    }
    return 'サーバーは既に停止しています';
  }
}
class gcfInvoker {
  private gcfClient: Promise<IdTokenClient>;
  constructor() {
    this.gcfClient = new GoogleAuth().getIdTokenClient(GoogleEnv['function url']);
  }
  async switch(boot: 'on' | 'off') {
    const client = await this.gcfClient;
    const res = await client.request({
      method: 'POST',
      url: GoogleEnv['function url'],
      data: {
        target: GoogleEnv['instance name'],
        switch: boot
      }
    });
    return res.status == 200;
  }
}