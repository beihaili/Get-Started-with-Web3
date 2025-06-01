# Get Started With Web3: 比特币RPC接口开发

---

自学入门 `Web3` 不是一件容易的事，作为一个刚刚入门 Web3 的新人，梳理一下最简单直观的 `Web3` 小白入门教程。整合开源社区优质资源，为大家从入门到精通 Web3 指路。每周更新 1-3 讲。

欢迎关注我的推特：[@bhbtc1337](https://twitter.com/bhbtc1337)

北航区块链协会 DAO 推特：[@BHBA_DAO](https://twitter.com/BHBA_DAO)

进入微信交流群请填表：[表格链接](https://forms.gle/QMBwL6LwZyQew1tX8)

文章开源在 GitHub：[Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)

购买BTC/ETH/USDT 等加密货币推荐 [币安](https://www.binance.com/zh-CN)[注册链接](https://accounts.marketwebb.me/register?ref=39797374)

---

## 前言：通过代码连接比特币世界

在前面的章节中，我们学习了如何运行比特币全节点，以及如何使用比特币核心客户端。然而，作为开发者，我们通常需要通过代码来与比特币区块链交互，实现自动化操作和自定义功能。比特币核心提供了强大的RPC接口，允许我们通过编程方式与节点通信，这正是本章将要探讨的内容。

## 1. 比特币RPC接口基础

### 1.1 什么是RPC？

RPC（Remote Procedure Call，远程过程调用）是一种允许程序调用另一个地址空间（通常是网络中的另一台计算机）上的过程或函数的协议。在比特币网络中，RPC允许我们通过HTTP请求与运行的比特币节点进行通信。

### 1.2 比特币核心的RPC架构

比特币核心客户端内置了RPC服务器，可以接收JSON-RPC请求并返回响应。这使得开发者能够通过简单的HTTP请求与比特币网络进行交互，而无需深入了解底层协议细节。

### 1.3 RPC接口的应用场景

+ 开发比特币钱包应用
+ 创建区块浏览器
+ 构建交易监控系统
+ 自动化资产管理
+ 开发交易所后端系统

## 2. 配置比特币核心RPC接口

### 2.1 修改配置文件

要启用比特币核心的RPC功能，需要修改bitcoin.conf配置文件。根据不同操作系统，文件位置如下：
+ Windows: `%APPDATA%\Bitcoin\bitcoin.conf`
+ macOS: `~/Library/Application Support/Bitcoin/bitcoin.conf`
+ Linux: `~/.bitcoin/bitcoin.conf`

### 2.2 关键配置参数

在配置文件中添加以下内容：

```
server=1
rpcuser=your_username
rpcpassword=your_strong_password
rpcallowip=127.0.0.1
```

### 2.3 重启比特币核心

配置修改后，需要重启比特币核心客户端使配置生效：
+ GUI方式：关闭并重新打开bitcoin-qt
+ 命令行方式：`bitcoin-cli stop` 然后 `bitcoind -daemon`

## 3. 基本RPC命令详解

### 3.1 区块链信息查询

+ `getblockchaininfo` - 获取区块链状态信息
+ `getblockcount` - 获取当前区块高度
+ `getblock <hash>` - 获取指定区块的详细信息
+ `getblockhash <height>` - 获取指定高度的区块哈希

### 3.2 钱包操作命令

+ `getbalance` - 获取钱包余额
+ `getnewaddress` - 生成新地址
+ `listunspent` - 列出未花费的交易输出
+ `dumpprivkey <address>` - 导出私钥（谨慎使用）

### 3.3 交易相关命令

+ `createrawtransaction` - 创建原始交易
+ `signrawtransactionwithwallet` - 签名交易
+ `sendrawtransaction` - 广播交易到网络
+ `gettransaction <txid>` - 获取交易详情

## 4. 使用编程语言连接比特币节点

### 4.1 Python示例

使用python-bitcoinrpc库与比特币节点交互：

```python
from bitcoinrpc.authproxy import AuthServiceProxy

# 连接到本地比特币节点
rpc_connection = AuthServiceProxy("http://your_username:your_password@127.0.0.1:8332")

# 获取区块链信息
blockchain_info = rpc_connection.getblockchaininfo()
print("当前区块高度:", blockchain_info['blocks'])
print("当前区块链大小:", blockchain_info['size_on_disk'] / (1024**3), "GB")

# 获取最新区块哈希
best_block_hash = rpc_connection.getbestblockhash()
print("最新区块哈希:", best_block_hash)

# 获取区块详情
block = rpc_connection.getblock(best_block_hash)
print("区块时间:", block['time'])
print("交易数量:", len(block['tx']))

# 获取钱包余额
balance = rpc_connection.getbalance()
print("钱包余额:", balance, "BTC")
```

### 4.2 JavaScript/Node.js示例

使用bitcoind-rpc库与比特币节点交互：

```javascript
const Client = require('bitcoin-core');

// 连接到本地比特币节点
const client = new Client({
  host: '127.0.0.1',
  port: 8332,
  username: 'your_username',
  password: 'your_password'
});

// 获取区块链信息
client.getBlockchainInfo()
  .then(blockchainInfo => {
    console.log("当前区块高度:", blockchainInfo.blocks);
    console.log("当前区块链大小:", blockchainInfo.size_on_disk / (1024**3), "GB");
    
    // 获取最新区块哈希
    return client.getBestBlockHash();
  })
  .then(bestBlockHash => {
    console.log("最新区块哈希:", bestBlockHash);
    
    // 获取区块详情
    return client.getBlock(bestBlockHash);
  })
  .then(block => {
    console.log("区块时间:", new Date(block.time * 1000).toISOString());
    console.log("交易数量:", block.tx.length);
    
    // 获取钱包余额
    return client.getBalance();
  })
  .then(balance => {
    console.log("钱包余额:", balance, "BTC");
  })
  .catch(error => {
    console.error("发生错误:", error);
  });
```

### 4.3 其他语言的调用方式

#### Java (使用 bitcoinj)

```java
import wf.bitcoin.javabitcoindrpcclient.BitcoinJSONRPCClient;

public class BitcoinRpcExample {
    public static void main(String[] args) {
        try {
            // 连接到本地比特币节点
            BitcoinJSONRPCClient client = new BitcoinJSONRPCClient(
                "http://your_username:your_password@127.0.0.1:8332");
            
            // 获取区块链信息
            System.out.println("区块高度: " + client.getBlockCount());
            
            // 获取钱包余额
            System.out.println("钱包余额: " + client.getBalance() + " BTC");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### Go

```go
package main

import (
	"fmt"
	"log"
	
	"github.com/btcsuite/btcd/rpcclient"
)

func main() {
	// 连接配置
	connCfg := &rpcclient.ConnConfig{
		Host:         "127.0.0.1:8332",
		User:         "your_username",
		Pass:         "your_password",
		HTTPPostMode: true,
		DisableTLS:   true,
	}
	
	// 创建新客户端
	client, err := rpcclient.New(connCfg, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Shutdown()
	
	// 获取区块链信息
	blockCount, err := client.GetBlockCount()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("区块高度: %d\n", blockCount)
	
	// 获取区块哈希
	blockHash, err := client.GetBlockHash(blockCount)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("最新区块哈希: %s\n", blockHash.String())
}
```

## 5. 构建简单应用示例

### 5.1 创建区块链浏览器

这是一个简单的区块链浏览器Web应用，使用Flask框架实现。它允许您浏览区块链上的区块和交易信息，并提供搜索功能。

![区块链浏览器主界面](./img/浏览器主界面.jpg)

区块链浏览器的主要功能包括：
- 显示区块链的基本信息（区块高度、难度、同步进度等）
- 列出最近的区块
- 查看区块详情
- 查看交易详情
- 搜索特定区块或交易

以下是区块链浏览器的核心代码：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
比特币区块链浏览器 - 基于Flask的Web应用
演示如何使用比特币RPC接口构建简单的区块链浏览器
"""

from flask import Flask, render_template, request, redirect
from bitcoinrpc.authproxy import AuthServiceProxy
import datetime

app = Flask(__name__)

# 添加时间戳转日期过滤器
@app.template_filter('timestamp_to_date')
def timestamp_to_date(timestamp):
    """将Unix时间戳转换为可读日期"""
    return datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')

# 比特币RPC连接
def get_rpc_connection():
    # Bitcoin RPC settings
    rpc_user = "your_username"
    rpc_password = "your_password"
    rpc_host = "127.0.0.1"
    rpc_port = 8332
    rpc_url = f"http://{rpc_user}:{rpc_password}@{rpc_host}:{rpc_port}"
    return AuthServiceProxy(rpc_url)

@app.route('/')
def index():
    rpc = get_rpc_connection()
    
    # 获取区块链信息
    blockchain_info = rpc.getblockchaininfo()
    best_block_hash = rpc.getbestblockhash()
    latest_blocks = []
    
    # 获取最近10个区块
    current_hash = best_block_hash
    for _ in range(10):
        if current_hash:
            block = rpc.getblock(current_hash)
            latest_blocks.append({
                'height': block['height'],
                'hash': block['hash'],
                'time': block['time'],
                'tx_count': len(block['tx'])
            })
            if 'previousblockhash' in block:
                current_hash = block['previousblockhash']
            else:
                break
    
    return render_template('index.html', 
                          blockchain_info=blockchain_info,
                          latest_blocks=latest_blocks)

@app.route('/block/<blockhash>')
def block_detail(blockhash):
    rpc = get_rpc_connection()
    
    try:
        # 获取区块详情
        block = rpc.getblock(blockhash)
        return render_template('block.html', block=block)
    except:
        return "区块未找到", 404

@app.route('/tx/<txid>')
def transaction_detail(txid):
    rpc = get_rpc_connection()
    
    try:
        # 获取交易详情
        raw_tx = rpc.getrawtransaction(txid, 1)
        return render_template('transaction.html', tx=raw_tx)
    except:
        return "交易未找到", 404

@app.route('/search')
def search():
    query = request.args.get('q', '')
    
    if not query:
        return redirect('/')
    
    rpc = get_rpc_connection()
    
    # 尝试作为区块高度处理
    try:
        height = int(query)
        block_hash = rpc.getblockhash(height)
        return redirect(f'/block/{block_hash}')
    except:
        pass
    
    # 尝试作为区块哈希处理
    try:
        rpc.getblock(query)
        return redirect(f'/block/{query}')
    except:
        pass
    
    # 尝试作为交易ID处理
    try:
        rpc.getrawtransaction(query, 1)
        return redirect(f'/tx/{query}')
    except:
        pass
    
    return "未找到相关结果", 404

if __name__ == '__main__':
    app.run(debug=True)
```

![区块链浏览器区块详情](./img/浏览器区块详情.jpg)

要运行此应用，您需要创建以下目录结构：

```
/templates
  /index.html - 显示区块链概览和最近区块列表
  /block.html - 显示区块详情
  /transaction.html - 显示交易详情
```

使用方法：

```bash
# 安装依赖
pip install flask python-bitcoinrpc

# 运行应用
python blockchain_explorer.py

# 在浏览器中访问
# http://127.0.0.1:5000
```

### 5.2 交易监控工具

这是一个监控特定比特币地址交易的脚本，当检测到新交易时会自动提醒：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
比特币交易监控工具 - 监控指定地址的交易
演示如何使用比特币RPC接口监控特定地址的交易活动
"""

import time
import sys
import argparse
from bitcoinrpc.authproxy import AuthServiceProxy

def monitor_address(address, check_interval=60):
    """
    监控特定比特币地址的交易
    
    参数:
    address: 要监控的比特币地址
    check_interval: 检查间隔（秒）
    """
    # 比特币RPC连接配置
    rpc_user = "your_username"
    rpc_password = "your_password"
    rpc_host = "127.0.0.1"
    rpc_port = 8332
    rpc_url = f"http://{rpc_user}:{rpc_password}@{rpc_host}:{rpc_port}"
    
    rpc = AuthServiceProxy(rpc_url)
    
    # 记录已知交易
    known_txs = set()
    
    print(f"开始监控地址: {address}")
    print(f"检查间隔: {check_interval}秒")
    print("Ctrl+C 退出监控")
    print("="*50)
    # 确保输出立即显示
    sys.stdout.flush()
    
    try:
        while True:
            try:
                print("正在检查新交易...")
                sys.stdout.flush()
                # 获取地址相关交易
                received = rpc.listreceivedbyaddress(0, True)
                
                # 找到指定地址的记录
                address_found = False
                print(f"获取到 {len(received)} 个地址记录")
                sys.stdout.flush()
                for entry in received:
                    print(f"检查地址: {entry['address']}")
                    sys.stdout.flush()
                    if entry['address'] == address:
                        address_found = True
                        # 检查新交易
                        current_txs = set(entry['txids'])
                        new_txs = current_txs - known_txs
                        
                        # 处理新交易
                        for txid in new_txs:
                            tx = rpc.gettransaction(txid)
                            amount = sum([detail['amount'] for detail in tx['details'] 
                                        if detail['address'] == address and detail['category'] == 'receive'])
                            
                            print(f"\n检测到新交易: {txid}")
                            print(f"  金额: {amount} BTC")
                            print(f"  确认数: {tx['confirmations']}")
                            print(f"  时间: {time.ctime(tx['time'])}")
                            print("-" * 50)
                        
                        # 更新已知交易
                        known_txs = current_txs
                        
                        # 获取总余额
                        balance = rpc.getreceivedbyaddress(address)
                        print(f"当前地址余额: {balance} BTC")
                        break
                
                if not address_found:
                    print(f"警告: 地址 {address} 未在钱包中找到或尚无交易")
                
            except Exception as e:
                print(f"发生错误: {e}")
            
            # 显示当前时间
            print(f"最后检查时间: {time.ctime()}")
            print("等待下一次检查...\n")
            sys.stdout.flush()
            
            # 等待下一次检查
            time.sleep(check_interval)
            
    except KeyboardInterrupt:
        print("\n监控已停止")

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='比特币地址交易监控工具')
    parser.add_argument('address', help='要监控的比特币地址')
    parser.add_argument('-i', '--interval', type=int, default=60,
                        help='检查间隔（秒），默认60秒')
    
    args = parser.parse_args()
    
    try:
        monitor_address(args.address, args.interval)
    except Exception as e:
        print(f"监控过程中发生错误: {e}")

if __name__ == "__main__":
    main()
```

使用方法：

```bash
# 安装依赖
pip install python-bitcoinrpc

# 运行监控工具
python transaction_monitor.py <比特币地址>

# 自定义检查间隔（例如30秒）
python transaction_monitor.py <比特币地址> --interval 30
```

运行示例：

```
开始监控地址: bc1qn8gu85e8fkujheu5vt6229g0hcfuxh6nklthus
检查间隔: 10秒
Ctrl+C 退出监控
==================================================
正在检查新交易...
获取到 2 个地址记录
检查地址: bc1qwqw3mcx60ek4upr9c4xu4nfh36jzhk2qyg9zzp
检查地址: bc1qn8gu85e8fkujheu5vt6229g0hcfuxh6nklthus
当前地址余额: 0E-8 BTC
最后检查时间: Sun Jun  1 17:50:15 2025
等待下一次检查...
```

这个工具的主要功能：
- 持续监控指定比特币地址的交易
- 检测新的交易并显示详细信息
- 显示地址当前余额
- 支持自定义检查间隔
- 可以方便地通过命令行参数操作
- 提供详细的调试输出信息

## 6. 高级RPC应用

### 6.1 批量处理交易
下面是一个批量创建和发送交易的示例：

```python
from bitcoinrpc.authproxy import AuthServiceProxy
import time

def batch_send_transactions(outputs_list, fee_rate=10):
    """
    批量创建和发送交易
    
    参数:
    outputs_list: 收款地址和金额的列表，格式为 [{'address': '...', 'amount': 0.001}, ...]
    fee_rate: 费率（satoshi/byte）
    """
    rpc = AuthServiceProxy("http://your_username:your_password@127.0.0.1:8332")
    
    # 检查钱包余额
    balance = rpc.getbalance()
    total_to_send = sum(output['amount'] for output in outputs_list)
    
    print(f"钱包余额: {balance} BTC")
    print(f"需要发送: {total_to_send} BTC")
    
    if balance < total_to_send:
        print("错误: 余额不足")
        return
    
    # 创建批量交易
    txids = []
    for output in outputs_list:
        try:
            # 创建原始交易
            outputs = {output['address']: output['amount']}
            rawtx = rpc.createrawtransaction([], outputs)
            
            # 资金注入
            funded_tx = rpc.fundrawtransaction(rawtx, {'feeRate': fee_rate})
            
            # 签名交易
            signed_tx = rpc.signrawtransactionwithwallet(funded_tx['hex'])
            
            # 广播交易
            txid = rpc.sendrawtransaction(signed_tx['hex'])
            txids.append(txid)
            
            print(f"交易已发送: {txid}")
            print(f"  收款地址: {output['address']}")
            print(f"  金额: {output['amount']} BTC")
            
            # 短暂等待以避免节点过载
            time.sleep(1)
            
        except Exception as e:
            print(f"交易失败: {e}")
    
    print(f"批量处理完成，成功发送 {len(txids)}/{len(outputs_list)} 笔交易")
    return txids

# 使用示例
if __name__ == "__main__":
    # 定义要发送的交易列表
    outputs = [
        {'address': 'address1', 'amount': 0.001},
        {'address': 'address2', 'amount': 0.002},
        {'address': 'address3', 'amount': 0.003}
    ]
    
    # 执行批量发送
    batch_send_transactions(outputs)
```

### 6.2 与其他系统集成

这是一个将比特币RPC与Web服务集成的Express.js应用示例：

```javascript
const express = require('express');
const Client = require('bitcoin-core');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 比特币RPC客户端
const bitcoinClient = new Client({
  host: '127.0.0.1',
  port: 8332,
  username: 'your_username',
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
```

## 7. 安全与性能最佳实践

### 7.1 RPC安全配置

1. **使用SSL加密**

通过修改bitcoin.conf启用SSL加密：

```
rpcssl=1
rpcsslcertificatechainfile=server.cert
rpcsslprivatekeyfile=server.key
```

2. **防火墙设置**

只允许必要的IP地址访问RPC端口：

```
rpcallowip=192.168.1.100/32
```

3. **限制RPC用户权限**

为不同的应用创建不同的RPC用户，限制权限：

```
rpcauth=user1:hash$salt
```

4. **定期更改密码**

定期更改RPC用户密码，尤其是在人员变动后。

### 7.2 性能优化

1. **使用批处理请求**

批处理多个RPC请求可以减少网络开销：

```python
# 批处理请求示例
results = rpc_connection.batch_([
    ["getblock", latest_block_hash],
    ["getbalance"],
    ["getmempoolinfo"]
])
```

2. **缓存常用数据**

对不经常变化的数据进行缓存：

```python
import functools
from datetime import datetime, timedelta

# 带超时的缓存装饰器
def cache_with_timeout(timeout_seconds=60):
    def decorator(func):
        cache = {}
        
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            key = str(args) + str(kwargs)
            current_time = datetime.now()
            
            if key in cache:
                result, timestamp = cache[key]
                if current_time - timestamp < timedelta(seconds=timeout_seconds):
                    return result
            
            result = func(*args, **kwargs)
            cache[key] = (result, current_time)
            return result
        
        return wrapper
    return decorator

# 使用缓存装饰器
@cache_with_timeout(300)  # 缓存5分钟
def get_blockchain_info(rpc):
    return rpc.getblockchaininfo()
```

3. **异步处理**

对于大量RPC调用，使用异步处理避免阻塞：

```python
import asyncio
import aiohttp
import json
import base64

async def async_rpc_call(method, params=None):
    """异步RPC调用"""
    url = "http://127.0.0.1:8332"
    auth = base64.b64encode(b"your_username:your_password").decode()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {auth}"
    }
    
    payload = {
        "jsonrpc": "1.0",
        "id": "curltest",
        "method": method,
        "params": params or []
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload, headers=headers) as response:
            if response.status == 200:
                return await response.json()
            else:
                raise Exception(f"RPC错误: {response.status}")

async def process_blocks(start_height, count):
    """异步处理多个区块"""
    tasks = []
    
    # 创建任务
    for height in range(start_height, start_height + count):
        # 获取区块哈希
        hash_task = asyncio.create_task(
            async_rpc_call("getblockhash", [height])
        )
        tasks.append(hash_task)
    
    # 等待所有任务完成
    block_hashes = await asyncio.gather(*tasks)
    
    # 获取区块详情
    block_tasks = []
    for result in block_hashes:
        if 'result' in result:
            block_task = asyncio.create_task(
                async_rpc_call("getblock", [result['result']])
            )
            block_tasks.append(block_task)
    
    blocks = await asyncio.gather(*block_tasks)
    return blocks

# 使用示例
if __name__ == "__main__":
    # 处理最近的10个区块
    loop = asyncio.get_event_loop()
    current_height = loop.run_until_complete(async_rpc_call("getblockcount"))
    start_height = current_height['result'] - 10
    
    blocks = loop.run_until_complete(process_blocks(start_height, 10))
    print(f"异步处理了 {len(blocks)} 个区块")
```

## 8. 故障排除与常见问题

### 8.1 连接问题

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 无法连接到RPC服务器 | 比特币核心未运行 | 确保比特币核心已启动并正在运行 |
| | RPC未启用 | 在bitcoin.conf中设置server=1 |
| | 防火墙阻止 | 检查防火墙设置，确保允许8332端口 |
| 认证失败 | 用户名或密码错误 | 检查bitcoin.conf中的rpcuser和rpcpassword设置 |
| | 访问IP不在允许列表 | 添加客户端IP到rpcallowip设置 |
| 连接超时 | 节点负载过高 | 增加客户端超时设置，减少并发请求 |

### 8.2 性能问题

1. **节点同步问题**

如果节点尚未完全同步，某些RPC调用可能会失败或返回不完整数据。使用以下命令检查同步状态：

```python
# 检查节点同步状态
sync_status = rpc.getblockchaininfo()
is_synced = sync_status['initialblockdownload'] == False
progress = sync_status['verificationprogress'] * 100

print(f"节点同步进度: {progress:.2f}%")
print(f"是否已完成同步: {'是' if is_synced else '否'}")
```

2. **内存使用过高**

处理大量交易或区块数据时，可能导致内存使用过高：

```python
# 分批处理大量数据
def process_large_dataset(start_item, total_items, batch_size=100):
    results = []
    
    for offset in range(0, total_items, batch_size):
        end = min(offset + batch_size, total_items)
        print(f"处理项目 {start_item + offset} 到 {start_item + end - 1}")
        
        # 处理当前批次
        batch = process_batch(start_item + offset, start_item + end)
        results.extend(batch)
        
        # 主动释放内存
        import gc
        gc.collect()
    
    return results
```

3. **处理错误响应**

优雅地处理RPC错误：

```python
def safe_rpc_call(rpc_func, *args, max_retries=3, retry_delay=2):
    """安全地调用RPC函数，处理常见错误"""
    import time
    
    retries = 0
    while retries < max_retries:
        try:
            return rpc_func(*args)
        except Exception as e:
            error_str = str(e)
            
            # 检查是否为临时错误
            if "timeout" in error_str or "connection" in error_str:
                retries += 1
                wait_time = retry_delay * retries
                print(f"RPC调用失败，将在{wait_time}秒后重试: {e}")
                time.sleep(wait_time)
            else:
                # 永久性错误，不再重试
                print(f"RPC调用出现永久性错误: {e}")
                raise
    
    raise Exception(f"达到最大重试次数({max_retries})后依然失败")
```

## 参考

+ [比特币核心RPC文档](https://developer.bitcoin.org/reference/rpc/)
+ [比特币开发者指南](https://developer.bitcoin.org/devguide/index.html)
+ [python-bitcoinrpc](https://github.com/jgarzik/python-bitcoinrpc)
+ [bitcoind-rpc for Node.js](https://github.com/bitpay/bitcoind-rpc)
