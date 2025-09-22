#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
QuikNode比特币RPC客户端示例
演示如何使用QuikNode API访问比特币区块链
"""

import requests
import json

class BitcoinRPC:
    def __init__(self, url):
        self.url = url
        self.id_counter = 0

    def call(self, method, params=None):
        """调用比特币RPC方法"""
        if params is None:
            params = []
            
        headers = {"Content-Type": "application/json"}
        self.id_counter += 1
        payload = {
            "jsonrpc": "1.0",
            "id": f"btc-explorer-{self.id_counter}",
            "method": method,
            "params": params
        }
        
        try:
            response = requests.post(self.url, json=payload, headers=headers)
            if response.status_code == 200:
                return response.json().get("result")
            else:
                print(f"API错误: 状态码 {response.status_code}")
                return None
        except Exception as e:
            print(f"RPC调用错误: {e}")
            return None

def main():
    # 替换为你的QuikNode API URL
    quiknode_url = "https://example.quiknode.pro/your-api-key/"
    rpc = BitcoinRPC(quiknode_url)
    
    # 获取区块链信息
    blockchain_info = rpc.call("getblockchaininfo")
    if blockchain_info:
        print("\n=== 区块链信息 ===")
        print(f"当前区块高度: {blockchain_info['blocks']}")
        print(f"当前链: {blockchain_info['chain']}")
        print(f"验证进度: {blockchain_info['verificationprogress']:.4%}")
    
    # 获取最新区块哈希
    best_block_hash = rpc.call("getbestblockhash")
    if best_block_hash:
        print(f"\n最新区块哈希: {best_block_hash}")
    
    # 获取区块详情
    if best_block_hash:
        block = rpc.call("getblock", [best_block_hash])
        if block:
            print("\n=== 最新区块信息 ===")
            print(f"区块高度: {block['height']}")
            print(f"时间戳: {block['time']} (区块时间)")
            print(f"交易数量: {len(block['tx'])}")
            print(f"难度: {block['difficulty']}")
            
            # 查看第一笔交易 (coinbase交易)
            if len(block['tx']) > 0:
                tx_id = block['tx'][0]
                print(f"\n=== 区块第一笔交易 (通常是coinbase交易) ===")
                print(f"交易ID: {tx_id}")
                
                # 获取交易详情
                tx = rpc.call("getrawtransaction", [tx_id, 1])
                if tx:
                    print(f"输出数量: {len(tx['vout'])}")
                    # 显示第一个输出的价值
                    if len(tx['vout']) > 0:
                        value = tx['vout'][0]['value']
                        print(f"第一个输出的价值: {value} BTC")

if __name__ == "__main__":
    main()
