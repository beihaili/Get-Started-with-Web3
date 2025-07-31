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
