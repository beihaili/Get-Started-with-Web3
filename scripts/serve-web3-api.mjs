import { createServer } from 'node:http';
import { handleWeb3ApiRequest } from '../server/web3-api.mjs';

const port = Number.parseInt(process.env.PORT || '3001', 10);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

createServer(handleWeb3ApiRequest).listen(port, '127.0.0.1', () => {
  console.log(`Web3 API listening at http://127.0.0.1:${port}/api/v1`);
});
