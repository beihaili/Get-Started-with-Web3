#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
比特币RPC性能优化 - 安全RPC调用
此模块提供可靠的RPC调用方法，包含错误处理和重试逻辑
"""

import time
from bitcoinrpc.authproxy import AuthServiceProxy

def safe_rpc_call(rpc_func, *args, max_retries=3, retry_delay=2):
    """
    安全地调用RPC函数，处理常见错误
    
    参数:
    rpc_func: 要调用的RPC函数
    *args: 传递给RPC函数的参数
    max_retries: 最大重试次数
    retry_delay: 初始重试延迟（秒），每次重试会增加
    
    返回:
    RPC调用的结果
    
    异常:
    Exception: 如果达到最大重试次数或遇到永久性错误
    """
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


# 使用示例
def get_blockchain_info_safely():
    """获取区块链信息并处理可能的错误"""
    # 根据用户配置设置RPC连接信息
    rpc_user = "beihaili"
    rpc_password = "your_password"
    rpc_host = "127.0.0.1"
    rpc_port = 8332
    
    rpc_connection = AuthServiceProxy(f"http://{rpc_user}:{rpc_password}@{rpc_host}:{rpc_port}")
    
    # 使用安全RPC调用
    try:
        blockchain_info = safe_rpc_call(rpc_connection.getblockchaininfo)
        print(f"当前区块高度: {blockchain_info['blocks']}")
        print(f"当前区块链大小: {blockchain_info['size_on_disk'] / (1024**3):.2f} GB")
        return blockchain_info
    except Exception as e:
        print(f"获取区块链信息失败: {e}")
        return None


if __name__ == "__main__":
    # 调用安全RPC方法示例
    get_blockchain_info_safely()
