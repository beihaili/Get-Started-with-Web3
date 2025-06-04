#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
比特币地址监控器
监控指定比特币地址的交易活动，当检测到新交易时发出提醒。
"""

import requests
import json
import time
import argparse
from datetime import datetime

class BitcoinRPC:
    def __init__(self, url, user=None, password=None):
        self.url = url
        self.user = user
        self.password = password
        self.id_counter = 0

    def call(self, method, params=None):
        """调用比特币RPC方法"""
        if params is None:
            params = []
            
        headers = {"Content-Type": "application/json"}
        self.id_counter += 1
        payload = {
            "jsonrpc": "1.0",
            "id": f"btc-monitor-{self.id_counter}",
            "method": method,
            "params": params
        }
        
        try:
            if self.user and self.password:
                response = requests.post(self.url, json=payload, headers=headers, auth=(self.user, self.password))
            else:
                response = requests.post(self.url, json=payload, headers=headers)
                
            if response.status_code == 200:
                return response.json().get("result")
            else:
                print(f"API错误: 状态码 {response.status_code}")
                return None
        except Exception as e:
            print(f"RPC调用错误: {e}")
            return None

def get_address_transactions(address):
    """从 mempool.space API 获取地址交易"""
    try:
        url = f"https://mempool.space/api/address/{address}/txs"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"获取地址交易失败: 状态码 {response.status_code}")
            return []
    except Exception as e:
        print(f"API调用错误: {e}")
        return []

def monitor_address(address, check_interval=60):
    """监控比特币地址的交易"""
    print(f"开始监控地址: {address}")
    print(f"检查间隔: {check_interval} 秒")
    
    # 获取初始交易列表
    known_txids = set()
    initial_txs = get_address_transactions(address)
    
    for tx in initial_txs:
        known_txids.add(tx['txid'])
    
    print(f"初始交易数量: {len(known_txids)}")
    
    try:
        while True:
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"[{current_time}] 检查新交易...")
            
            # 获取当前交易
            current_txs = get_address_transactions(address)
            new_txs = []
            
            for tx in current_txs:
                if tx['txid'] not in known_txids:
                    new_txs.append(tx)
                    known_txids.add(tx['txid'])
            
            # 如果有新交易，显示提醒
            if new_txs:
                print(f"\n*** 检测到 {len(new_txs)} 个新交易! ***")
                for tx in new_txs:
                    tx_time = datetime.fromtimestamp(tx.get('status', {}).get('block_time', time.time()))
                    amount = sum([output.get('value', 0) for output in tx.get('vout', []) 
                                 if address in output.get('scriptpubkey_address', '')])
                    amount_btc = amount / 100000000  # Satoshi to BTC
                    
                    print(f"交易ID: {tx['txid']}")
                    print(f"时间: {tx_time}")
                    print(f"收到: {amount_btc} BTC")
                    print(f"查看: https://mempool.space/tx/{tx['txid']}\n")
            
            # 等待指定时间后再次检查
            time.sleep(check_interval)
            
    except KeyboardInterrupt:
        print("\n监控已停止")

def main():
    parser = argparse.ArgumentParser(description="比特币地址监控器")
    parser.add_argument("address", help="要监控的比特币地址")
    parser.add_argument("-i", "--interval", type=int, default=60, 
                        help="检查间隔（秒），默认 60秒")
    args = parser.parse_args()
    
    monitor_address(args.address, args.interval)

if __name__ == "__main__":
    main()
