#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
多重签名地址创建示例
基于第07讲《比特币交易进阶》的实战演练

作者: beihaili
日期: 2025-01-04
"""

import requests
import json
import hashlib
import hmac
import time
from typing import List, Dict, Any

class BitcoinRPC:
    """比特币RPC客户端"""
    
    def __init__(self, url: str = "http://localhost:8332", 
                 username: str = "user", password: str = "password"):
        self.url = url
        self.username = username
        self.password = password
        self.headers = {'content-type': 'application/json'}
    
    def call(self, method: str, params: List = None) -> Dict[str, Any]:
        """调用RPC方法"""
        if params is None:
            params = []
            
        payload = {
            "method": method,
            "params": params,
            "jsonrpc": "2.0",
            "id": int(time.time())
        }
        
        try:
            response = requests.post(
                self.url, 
                data=json.dumps(payload), 
                headers=self.headers, 
                auth=(self.username, self.password),
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"RPC调用失败: {e}")
            return {"error": str(e)}
    
    def test_connection(self) -> bool:
        """测试RPC连接"""
        try:
            result = self.call("getblockchaininfo")
            if "error" not in result:
                print(f"✅ 成功连接到比特币节点")
                print(f"   当前区块高度: {result['result']['blocks']}")
                print(f"   网络: {result['result']['chain']}")
                return True
            else:
                print(f"❌ RPC连接失败: {result['error']}")
                return False
        except Exception as e:
            print(f"❌ 连接测试失败: {e}")
            return False

class MultiSigManager:
    """多重签名管理器"""
    
    def __init__(self, rpc_client: BitcoinRPC):
        self.rpc = rpc_client
    
    def generate_key_pair(self) -> Dict[str, str]:
        """生成新的密钥对（模拟）"""
        # 注意：这里只是演示，实际应用中应该使用真实的密钥生成
        import secrets
        
        # 生成随机私钥（32字节）
        private_key = secrets.token_hex(32)
        
        # 这里应该使用真实的椭圆曲线算法生成公钥
        # 为了演示，我们使用一个模拟的公钥
        public_key = f"03{secrets.token_hex(32)}"
        
        return {
            "private_key": private_key,
            "public_key": public_key
        }
    
    def create_multisig_address(self, required_signatures: int, 
                               public_keys: List[str]) -> Dict[str, Any]:
        """
        创建多重签名地址
        
        Args:
            required_signatures: 需要的签名数量 (如2-of-3中的2)
            public_keys: 公钥列表 (如2-of-3中的3个公钥)
        
        Returns:
            包含地址和赎回脚本的字典
        """
        print(f"🔧 创建 {required_signatures}-of-{len(public_keys)} 多重签名地址...")
        
        # 验证参数
        if required_signatures > len(public_keys):
            raise ValueError("需要的签名数量不能超过公钥总数")
        
        if required_signatures <= 0:
            raise ValueError("需要的签名数量必须大于0")
        
        # 调用RPC创建多重签名
        result = self.rpc.call("createmultisig", [required_signatures, public_keys])
        
        if "error" in result:
            print(f"❌ 创建多重签名地址失败: {result['error']}")
            return result
        
        multisig_info = result['result']
        
        print(f"✅ 多重签名地址创建成功!")
        print(f"   地址: {multisig_info['address']}")
        print(f"   赎回脚本: {multisig_info['redeemScript']}")
        print(f"   类型: {multisig_info.get('type', 'unknown')}")
        
        return multisig_info
    
    def get_address_info(self, address: str) -> Dict[str, Any]:
        """获取地址信息"""
        result = self.rpc.call("getaddressinfo", [address])
        
        if "error" in result:
            print(f"❌ 获取地址信息失败: {result['error']}")
            return result
        
        return result['result']
    
    def validate_multisig_setup(self, address: str, 
                               required_signatures: int, 
                               total_keys: int) -> bool:
        """验证多重签名设置"""
        print(f"🔍 验证多重签名设置...")
        
        # 获取地址信息
        address_info = self.get_address_info(address)
        
        if "error" in address_info:
            return False
        
        # 检查地址类型
        if address_info.get('iswitness') and address_info.get('witness_version') == 0:
            print(f"   ✅ SegWit多重签名地址")
        elif address_info.get('isscript'):
            print(f"   ✅ P2SH多重签名地址")
        else:
            print(f"   ⚠️  未知地址类型")
        
        print(f"   📊 签名要求: {required_signatures}-of-{total_keys}")
        print(f"   🔑 公钥数量: {total_keys}")
        
        return True

def demo_multisig_creation():
    """演示多重签名地址创建"""
    print("🚀 多重签名地址创建演示")
    print("=" * 50)
    
    # 初始化RPC客户端
    rpc = BitcoinRPC()
    
    # 测试连接
    if not rpc.test_connection():
        print("⚠️  无法连接到比特币节点，使用模拟模式...")
        print("   在实际使用中，请确保比特币节点正在运行")
        print("   并正确配置RPC用户名和密码")
        return
    
    # 创建多重签名管理器
    multisig_manager = MultiSigManager(rpc)
    
    # 生成示例公钥（在实际应用中，这些应该来自真实的钱包）
    print("\n📝 生成示例公钥...")
    sample_keys = []
    for i in range(3):
        key_pair = multisig_manager.generate_key_pair()
        sample_keys.append(key_pair['public_key'])
        print(f"   公钥 {i+1}: {key_pair['public_key'][:20]}...")
    
    # 创建2-of-3多重签名地址
    print(f"\n🔧 创建2-of-3多重签名地址...")
    try:
        multisig_info = multisig_manager.create_multisig_address(2, sample_keys)
        
        if "error" not in multisig_info:
            # 验证设置
            multisig_manager.validate_multisig_setup(
                multisig_info['address'], 2, 3
            )
            
            print(f"\n📋 多重签名地址信息:")
            print(f"   地址: {multisig_info['address']}")
            print(f"   赎回脚本: {multisig_info['redeemScript']}")
            print(f"   类型: {multisig_info.get('type', 'unknown')}")
            
            print(f"\n💡 使用说明:")
            print(f"   - 需要3个公钥中的任意2个签名才能花费资金")
            print(f"   - 赎回脚本用于在花费时证明多重签名设置")
            print(f"   - 建议将赎回脚本安全备份")
            
        else:
            print(f"❌ 创建失败: {multisig_info['error']}")
            
    except Exception as e:
        print(f"❌ 创建过程中发生错误: {e}")

def demo_offline_multisig():
    """演示离线多重签名创建（不依赖RPC）"""
    print("\n🖥️  离线多重签名地址创建演示")
    print("=" * 50)
    
    # 模拟的公钥（实际应用中应该来自真实的钱包）
    sample_public_keys = [
        "03a1b2c3d4e5f678901234567890123456789012345678901234567890123456",
        "03b1c2d3e4f5a678901234567890123456789012345678901234567890123456",
        "03c1d2e3f4a5b678901234567890123456789012345678901234567890123456"
    ]
    
    print("📝 使用以下公钥创建2-of-3多重签名:")
    for i, pubkey in enumerate(sample_public_keys):
        print(f"   公钥 {i+1}: {pubkey[:20]}...")
    
    print(f"\n🔧 创建多重签名地址...")
    print(f"   签名要求: 2-of-3")
    print(f"   地址类型: P2SH (兼容性最好)")
    
    # 模拟创建结果
    multisig_address = "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy"
    redeem_script = "522103a1b2c3d4e5f6789012345678901234567890123456789012345678901234562103b1c2d3e4f5a6789012345678901234567890123456789012345678901234562103c1d2e3f4a5b67890123456789012345678901234567890123456789012345653ae"
    
    print(f"\n✅ 多重签名地址创建成功!")
    print(f"   地址: {multisig_address}")
    print(f"   赎回脚本: {redeem_script}")
    
    print(f"\n💡 安全建议:")
    print(f"   - 将赎回脚本安全备份到多个位置")
    print(f"   - 私钥分散存储，避免单点故障")
    print(f"   - 定期测试多重签名功能")
    print(f"   - 考虑使用硬件钱包增强安全性")

if __name__ == "__main__":
    print("🔐 比特币多重签名地址创建工具")
    print("基于第07讲《比特币交易进阶》实战演练")
    print("=" * 60)
    
    # 演示在线创建（需要比特币节点）
    demo_multisig_creation()
    
    # 演示离线创建（不需要比特币节点）
    demo_offline_multisig()
    
    print(f"\n🎉 演示完成!")
    print(f"📚 更多信息请参考: https://github.com/beihaili/Get-Started-with-Web3") 