#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
比特币RPC接口示例脚本 - Python版本
按照文档中的示例创建，用于演示如何通过RPC接口与比特币核心交互
"""

import json
from datetime import datetime
import requests

# RPC连接配置
RPC_USER = "your_username"
RPC_PASSWORD = "your_password"
RPC_HOST = "127.0.0.1"
RPC_PORT = 8332
RPC_URL = f"http://{RPC_USER}:{RPC_PASSWORD}@{RPC_HOST}:{RPC_PORT}"

def call_rpc(method, params=None):
    """
    调用比特币RPC接口
    
    Args:
        method (str): RPC方法名
        params (list, optional): RPC参数. Defaults to None.
        
    Returns:
        dict: RPC响应结果
    """
    if params is None:
        params = []
        
    headers = {'content-type': 'application/json'}
    payload = {
        "jsonrpc": "1.0",
        "id": "python-bitcoin-rpc",
        "method": method,
        "params": params
    }
    
    try:
        response = requests.post(RPC_URL, json=payload, headers=headers)
        if response.status_code == 200:
            return response.json()['result']
        else:
            print(f"错误: 状态码 {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"调用RPC时发生错误: {str(e)}")
        return None

def main():
    """主函数，演示各种RPC调用"""
    print("===== 比特币RPC接口示例 - Python版本 =====")
    
    # 获取区块链信息
    print("\n>>> 获取区块链信息")
    blockchain_info = call_rpc("getblockchaininfo")
    if blockchain_info:
        print(f"区块链: {blockchain_info['chain']}")
        print(f"当前区块高度: {blockchain_info['blocks']}")
        print(f"区块头数量: {blockchain_info['headers']}")
        print(f"同步进度: {blockchain_info['verificationprogress'] * 100:.2f}%")
        print(f"修剪模式: {'是' if blockchain_info['pruned'] else '否'}")
    
    # 获取网络信息
    print("\n>>> 获取网络信息")
    network_info = call_rpc("getnetworkinfo")
    if network_info:
        print(f"版本: {network_info['version'] / 1000000:.1f}")
        print(f"连接数: {network_info['connections']}")
        print(f"协议版本: {network_info['protocolversion']}")
    
    # 获取钱包信息
    print("\n>>> 获取钱包信息")
    try:
        wallet_info = call_rpc("getwalletinfo")
        if wallet_info:
            print(f"钱包名称: {wallet_info['walletname']}")
            print(f"钱包余额: {wallet_info['balance']} BTC")
            print(f"交易数量: {wallet_info['txcount']}")
    except:
        print("获取钱包信息失败，可能需要先创建或加载钱包")
    
    # 获取最新区块信息
    print("\n>>> 获取最新区块信息")
    block_count = call_rpc("getblockcount")
    if block_count:
        block_hash = call_rpc("getblockhash", [block_count])
        if block_hash:
            block = call_rpc("getblock", [block_hash])
            if block:
                block_time = datetime.fromtimestamp(block['time'])
                print(f"区块哈希: {block['hash']}")
                print(f"区块高度: {block['height']}")
                print(f"区块时间: {block_time.strftime('%Y-%m-%d %H:%M:%S')}")
                print(f"交易数量: {len(block['tx'])}")
                print(f"难度: {block['difficulty']}")
    
    print("\n脚本执行完毕！")

if __name__ == "__main__":
    main()
