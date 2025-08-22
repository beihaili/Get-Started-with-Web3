#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
比特币批量交易处理示例
演示如何批量创建和发送比特币交易
"""

from bitcoinrpc.authproxy import AuthServiceProxy
import time

def batch_send_transactions(outputs_list, fee_rate=10):
    """
    批量创建和发送交易
    
    参数:
    outputs_list: 收款地址和金额的列表，格式为 [{'address': '...', 'amount': 0.001}, ...]
    fee_rate: 费率（satoshi/byte）
    """
    # 替换为你的比特币RPC连接信息
    rpc_user = "beihaili"  # 根据用户记忆设置为实际用户名
    rpc_password = "your_password"
    rpc_host = "127.0.0.1"
    rpc_port = 8332  # 根据用户记忆设置为实际端口
    
    rpc = AuthServiceProxy(f"http://{rpc_user}:{rpc_password}@{rpc_host}:{rpc_port}")
    
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
