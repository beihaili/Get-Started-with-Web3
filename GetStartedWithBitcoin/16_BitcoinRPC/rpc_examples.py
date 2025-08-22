#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
比特币RPC开发完整示例
包含本章节涉及的所有RPC操作实现

依赖安装:
pip install python-bitcoinrpc requests flask

使用方法:
python rpc_examples.py
"""

from bitcoinrpc.authproxy import AuthServiceProxy
import requests
import json
import time
import sys
import argparse
import datetime
from flask import Flask, render_template, request, redirect

class BitcoinRPCClient:
    """比特币RPC客户端封装"""
    
    def __init__(self, username="your_username", password="your_password", 
                 host="127.0.0.1", port=8332):
        self.rpc_url = f"http://{username}:{password}@{host}:{port}"
        self.rpc = AuthServiceProxy(self.rpc_url)
    
    def get_blockchain_info(self):
        """获取区块链基本信息"""
        print("=== 区块链信息 ===")
        info = self.rpc.getblockchaininfo()
        print(f"当前区块高度: {info['blocks']}")
        print(f"区块链大小: {info['size_on_disk'] / (1024**3):.2f} GB")
        print(f"同步进度: {info['verificationprogress'] * 100:.2f}%")
        return info
    
    def get_latest_blocks(self, count=5):
        """获取最新区块信息"""
        print(f"\n=== 最新 {count} 个区块 ===")
        best_hash = self.rpc.getbestblockhash()
        current_hash = best_hash
        
        blocks = []
        for i in range(count):
            if current_hash:
                block = self.rpc.getblock(current_hash)
                blocks.append(block)
                print(f"区块 {block['height']}: {block['hash'][:16]}... ({len(block['tx'])}笔交易)")
                current_hash = block.get('previousblockhash')
            else:
                break
        
        return blocks
    
    def get_wallet_info(self):
        """获取钱包信息"""
        print("\n=== 钱包信息 ===")
        try:
            balance = self.rpc.getbalance()
            print(f"钱包余额: {balance} BTC")
            
            unspent = self.rpc.listunspent()
            print(f"UTXO数量: {len(unspent)}")
            
            # 生成新地址示例
            new_address = self.rpc.getnewaddress("", "bech32")
            print(f"新生成地址: {new_address}")
            
        except Exception as e:
            print(f"钱包操作错误: {e}")
    
    def demonstrate_transaction_commands(self):
        """演示交易相关命令"""
        print("\n=== 交易命令演示 ===")
        
        # 获取内存池信息
        mempool_info = self.rpc.getmempoolinfo()
        print(f"内存池交易数: {mempool_info['size']}")
        print(f"内存池大小: {mempool_info['bytes'] / 1024:.2f} KB")
        
        # 获取最新交易
        best_hash = self.rpc.getbestblockhash()
        block = self.rpc.getblock(best_hash)
        if block['tx']:
            tx_id = block['tx'][0]  # 获取第一笔交易
            tx = self.rpc.gettransaction(tx_id)
            print(f"示例交易ID: {tx_id}")
            print(f"交易金额: {tx.get('amount', 0)} BTC")

class QuikNodeClient:
    """第三方RPC服务客户端示例"""
    
    def __init__(self, url):
        self.url = url
        self.id_counter = 0
    
    def call(self, method, params=None):
        """发送JSON-RPC请求"""
        self.id_counter += 1
        payload = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params or [],
            "id": self.id_counter
        }
        
        try:
            response = requests.post(self.url, json=payload, timeout=30)
            response.raise_for_status()
            result = response.json()
            
            if 'error' in result and result['error']:
                raise Exception(f"RPC错误: {result['error']}")
            
            return result.get('result')
        except Exception as e:
            print(f"请求失败: {e}")
            return None
    
    def demonstrate_third_party_rpc(self):
        """演示第三方RPC服务使用"""
        print("\n=== 第三方RPC服务演示 ===")
        
        # 获取区块链信息
        blockchain_info = self.call("getblockchaininfo")
        if blockchain_info:
            print(f"区块高度: {blockchain_info.get('blocks', 'N/A')}")
            print(f"链: {blockchain_info.get('chain', 'N/A')}")
        
        # 获取最新区块哈希
        best_hash = self.call("getbestblockhash")
        if best_hash:
            print(f"最新区块哈希: {best_hash[:16]}...")

class BlockchainExplorer:
    """简化的区块链浏览器"""
    
    def __init__(self, rpc_client):
        self.rpc = rpc_client.rpc
        self.app = Flask(__name__)
        self._setup_routes()
    
    def _setup_routes(self):
        """设置路由"""
        
        @self.app.route('/')
        def index():
            # 获取区块链基本信息
            blockchain_info = self.rpc.getblockchaininfo()
            best_hash = self.rpc.getbestblockhash()
            
            # 获取最近10个区块
            latest_blocks = []
            current_hash = best_hash
            
            for _ in range(10):
                if current_hash:
                    block = self.rpc.getblock(current_hash)
                    latest_blocks.append({
                        'height': block['height'],
                        'hash': block['hash'],
                        'time': datetime.datetime.fromtimestamp(block['time']),
                        'tx_count': len(block['tx'])
                    })
                    current_hash = block.get('previousblockhash')
                else:
                    break
            
            return f"""
            <h1>比特币区块链浏览器</h1>
            <h2>区块链信息</h2>
            <p>当前高度: {blockchain_info['blocks']}</p>
            <p>同步进度: {blockchain_info['verificationprogress']*100:.2f}%</p>
            
            <h2>最新区块</h2>
            <ul>
            {''.join([f"<li>区块 {block['height']}: {block['hash'][:16]}... ({block['tx_count']}笔交易)</li>" for block in latest_blocks])}
            </ul>
            """
        
        @self.app.route('/block/<block_hash>')
        def block_detail(block_hash):
            try:
                block = self.rpc.getblock(block_hash)
                return f"""
                <h1>区块详情</h1>
                <p>高度: {block['height']}</p>
                <p>哈希: {block['hash']}</p>
                <p>时间: {datetime.datetime.fromtimestamp(block['time'])}</p>
                <p>交易数: {len(block['tx'])}</p>
                <p>大小: {block['size']} 字节</p>
                """
            except Exception as e:
                return f"区块未找到: {e}", 404
    
    def run(self, debug=True, port=5000):
        """运行浏览器"""
        print(f"区块链浏览器启动: http://127.0.0.1:{port}")
        self.app.run(debug=debug, port=port)

class AddressMonitor:
    """地址监控工具"""
    
    def __init__(self, rpc_client):
        self.rpc = rpc_client.rpc
    
    def monitor_address(self, address, check_interval=60):
        """监控特定地址的交易"""
        print(f"开始监控地址: {address}")
        print(f"检查间隔: {check_interval}秒")
        print("Ctrl+C 退出监控\n")
        
        known_txs = set()
        
        try:
            while True:
                print(f"检查时间: {datetime.datetime.now()}")
                
                try:
                    # 获取地址相关交易
                    received = self.rpc.listreceivedbyaddress(0, True)
                    
                    for entry in received:
                        if entry['address'] == address:
                            current_txs = set(entry['txids'])
                            new_txs = current_txs - known_txs
                            
                            for txid in new_txs:
                                tx = self.rpc.gettransaction(txid)
                                amount = sum([detail['amount'] for detail in tx['details'] 
                                            if detail['address'] == address])
                                
                                print(f"🔔 新交易: {txid}")
                                print(f"   金额: {amount} BTC")
                                print(f"   确认数: {tx['confirmations']}")
                                print(f"   时间: {datetime.datetime.fromtimestamp(tx['time'])}")
                            
                            known_txs = current_txs
                            balance = self.rpc.getreceivedbyaddress(address)
                            print(f"   当前余额: {balance} BTC\n")
                            break
                    else:
                        print("地址未找到或无交易")
                
                except Exception as e:
                    print(f"检查错误: {e}")
                
                time.sleep(check_interval)
                
        except KeyboardInterrupt:
            print("\n监控已停止")

class PerformanceOptimizer:
    """性能优化示例"""
    
    def __init__(self, rpc_client):
        self.rpc = rpc_client.rpc
        self.cache = {}
    
    def batch_requests(self):
        """批处理请求示例"""
        print("=== 批处理请求演示 ===")
        
        # 批量获取多个信息
        try:
            results = self.rpc.batch_([
                ["getblockchaininfo"],
                ["getmempoolinfo"],
                ["getnetworkinfo"]
            ])
            
            print(f"区块高度: {results[0]['blocks']}")
            print(f"内存池大小: {results[1]['size']}")
            print(f"连接节点数: {results[2]['connections']}")
            
        except Exception as e:
            print(f"批处理请求失败: {e}")
    
    def cached_request(self, method, *args, cache_time=300):
        """带缓存的请求"""
        cache_key = f"{method}_{args}"
        now = time.time()
        
        if cache_key in self.cache:
            result, timestamp = self.cache[cache_key]
            if now - timestamp < cache_time:
                print(f"从缓存返回: {method}")
                return result
        
        # 执行实际请求
        result = getattr(self.rpc, method)(*args)
        self.cache[cache_key] = (result, now)
        print(f"执行请求: {method}")
        return result

def main():
    """主程序"""
    parser = argparse.ArgumentParser(description='比特币RPC开发示例')
    parser.add_argument('--action', choices=[
        'basic', 'monitor', 'explorer', 'performance', 'thirdparty'
    ], default='basic', help='选择要运行的示例')
    parser.add_argument('--address', help='监控的地址（用于monitor）')
    parser.add_argument('--quiknode-url', help='QuikNode URL（用于thirdparty）')
    
    args = parser.parse_args()
    
    try:
        if args.action == 'basic':
            print("🔗 比特币RPC基础操作演示")
            client = BitcoinRPCClient()
            client.get_blockchain_info()
            client.get_latest_blocks()
            client.get_wallet_info()
            client.demonstrate_transaction_commands()
        
        elif args.action == 'monitor':
            if not args.address:
                print("请提供监控地址: --address <bitcoin_address>")
                return
            
            print("📡 地址监控演示")
            client = BitcoinRPCClient()
            monitor = AddressMonitor(client)
            monitor.monitor_address(args.address, 30)
        
        elif args.action == 'explorer':
            print("🌐 区块链浏览器演示")
            client = BitcoinRPCClient()
            explorer = BlockchainExplorer(client)
            explorer.run()
        
        elif args.action == 'performance':
            print("⚡ 性能优化演示")
            client = BitcoinRPCClient()
            optimizer = PerformanceOptimizer(client)
            optimizer.batch_requests()
        
        elif args.action == 'thirdparty':
            if not args.quiknode_url:
                print("请提供QuikNode URL: --quiknode-url <url>")
                return
            
            print("☁️ 第三方RPC服务演示")
            client = QuikNodeClient(args.quiknode_url)
            client.demonstrate_third_party_rpc()
    
    except Exception as e:
        print(f"执行错误: {e}")

if __name__ == "__main__":
    main()
