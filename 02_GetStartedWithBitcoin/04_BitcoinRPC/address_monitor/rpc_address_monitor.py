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
    
    monitor_address(args.address, args.interval)

if __name__ == "__main__":
    main()
