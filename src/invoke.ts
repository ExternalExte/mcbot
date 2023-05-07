import { GoogleAuth } from 'google-auth-library';
if (!process.env.FUNCTION_URL)
  throw Error('Cloud FunctionのURLを"FUNCTION_URL"に指定してください');
const url = process.env.FUNCTION_URL;

const auth = new GoogleAuth();
export async function invokeCloudFunction(instanceName: string, boot: 'on' | 'off') {
  const client = await auth.getIdTokenClient(url);
  const res = await client.request({
    method: 'POST',
    url,
    data: {
      target: instanceName,
      switch: boot
    }
  });
  console.info(res.data);
}