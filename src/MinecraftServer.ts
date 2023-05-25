import { GoogleAuth, IdTokenClient } from 'google-auth-library';
import { Rcon } from 'rcon-client/lib/rcon.js';
export class MinecraftServer {
  isBooting = false;
  private readonly host: string;
  private readonly pass: string;
  private rconClient: Rcon | undefined = undefined;
  private gcfInvoker = new gcfInvoker();
  constructor() {
    if (!process.env.MINECRAFT_HOST) throw Error('サーバーのアドレスをMINECRAFT_HOSTに指定してください');
    this.host = process.env.MINECRAFT_HOST;
    if (!process.env.MINECRAFT_PASS) throw Error('サーバーのパスワードをMINECRAFT_PASSに指定してください');
    this.pass = process.env.MINECRAFT_PASS;
  }
  async send(command: string) {
    if (this.isBooting && this.rconClient) return this.rconClient.send(command);
    return 'サーバーは停止しています';
  }
  async start() {
    if (!this.isBooting) {
      await this.gcfInvoker.switch('on');
      this.rconClient = await Rcon.connect({
        host: this.host,
        port: 25575,
        password: this.pass
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
  private readonly function_url: string;
  private readonly instance: string;
  private gcfClient: Promise<IdTokenClient>;
  constructor() {
    if (!process.env.FUNCTION_URL) throw Error('Cloud FunctionのURLを"FUNCTION_URL"に指定してください');
    this.function_url = process.env.FUNCTION_URL;
    if (!process.env.INSTANCE) throw Error('インスタンス名をINSTANCEに指定してください');
    this.instance = process.env.INSTANCE;
    this.gcfClient = new GoogleAuth().getIdTokenClient(this.function_url);
  }
  async switch(boot: 'on' | 'off') {
    const client = await this.gcfClient;
    const res = await client.request({
      method: 'POST',
      url: this.function_url,
      data: {
        target: this.instance,
        switch: boot
      }
    });
    return res.status == 200;
  }
}