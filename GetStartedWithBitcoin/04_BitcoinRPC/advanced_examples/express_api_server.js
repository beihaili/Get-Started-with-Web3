const express = require('express');
const Client = require('bitcoin-core');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 比特币RPC客户端
const bitcoinClient = new Client({
  host: '127.0.0.1',
  port: 8332,           // 使用用户实际端口
  username: 'beihaili', // 使用用户实际用户名
  password: 'your_password'
});

// 获取区块链信息
app.get('/api/blockchain/info', async (req, res) => {
  try {
    const info = await bitcoinClient.getBlockchainInfo();
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取特定区块信息
app.get('/api/block/:hash', async (req, res) => {
  try {
    const block = await bitcoinClient.getBlock(req.params.hash);
    res.json(block);
  } catch (error) {
    res.status(404).json({ error: 'Block not found' });
  }
});

// 获取钱包余额
app.get('/api/wallet/balance', async (req, res) => {
  try {
    const balance = await bitcoinClient.getBalance();
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新地址
app.post('/api/wallet/address', async (req, res) => {
  try {
    const label = req.body.label || '';
    const address = await bitcoinClient.getNewAddress(label);
    res.json({ address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 发送比特币
app.post('/api/wallet/send', async (req, res) => {
  try {
    const { address, amount } = req.body;
    
    if (!address || !amount) {
      return res.status(400).json({ error: 'Address and amount are required' });
    }
    
    const txid = await bitcoinClient.sendToAddress(address, parseFloat(amount));
    res.json({ 
      txid,
      address,
      amount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bitcoin RPC API server running on port ${PORT}`);
});
