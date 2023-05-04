import { CloudFunctionsServiceClient, v2 } from '@google-cloud/functions';


const client = new CloudFunctionsServiceClient();
await client.initialize();
console.log(await client.getProjectId());
for await(const res of client.listFunctionsAsync())
  console.log(res);