const axios = require('axios');

class BitcoinRPC {
  constructor(url) {
    this.url = url;
    this.idCounter = 0;
  }

  async call(method, params = []) {
    this.idCounter++;
    const payload = {
      jsonrpc: '1.0',
      id: `btc-explorer-${this.idCounter}`,
      method: method,
      params: params
    };

    try {
      const response = await axios.post(this.url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      return response.data.result;
    } catch (error) {
      console.error('RPC调用错误:', error.message);
      throw error;
    }
  }
}

// 使用示例
async function main() {
  const quiknodeUrl = 'https://example.quiknode.pro/your-api-key/';
  const rpc = new BitcoinRPC(quiknodeUrl);

  try {
    // 获取区块链信息
    const blockchainInfo = await rpc.call('getblockchaininfo');
    console.log('=== 区块链信息 ===');
    console.log('当前区块高度:', blockchainInfo.blocks);
    console.log('当前链:', blockchainInfo.chain);
    console.log('验证进度:', (blockchainInfo.verificationprogress * 100).toFixed(2) + '%');

    // 获取最新区块哈希
    const bestBlockHash = await rpc.call('getbestblockhash');
    console.log('\n最新区块哈希:', bestBlockHash);

    // 获取区块详情
    const block = await rpc.call('getblock', [bestBlockHash]);
    console.log('\n=== 最新区块信息 ===');
    console.log('区块高度:', block.height);
    console.log('时间:', new Date(block.time * 1000).toISOString());
    console.log('交易数量:', block.tx.length);
    console.log('难度:', block.difficulty);

    // 查看第一笔交易
    if (block.tx.length > 0) {
      const txid = block.tx[0];
      console.log('\n=== 区块第一笔交易 ===');
      console.log('交易ID:', txid);
      
      // 获取交易详情
      const tx = await rpc.call('getrawtransaction', [txid, 1]);
      if (tx) {
        console.log('输出数量:', tx.vout.length);
        if (tx.vout.length > 0) {
          console.log('第一个输出的价值:', tx.vout[0].value, 'BTC');
        }
      }
    }
  } catch (error) {
    console.error('发生错误:', error);
  }
}

main();
