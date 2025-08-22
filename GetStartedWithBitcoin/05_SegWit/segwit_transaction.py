#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SegWit交易创建示例
基于第07讲《比特币交易进阶》的实战演练

作者: beihaili
日期: 2025-01-04
"""

import requests
import json
import time
from typing import List, Dict, Any, Optional
from decimal import Decimal

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

class SegWitTransactionManager:
    """SegWit交易管理器"""
    
    def __init__(self, rpc_client: BitcoinRPC):
        self.rpc = rpc_client
    
    def get_utxos(self, address: str) -> List[Dict[str, Any]]:
        """获取地址的UTXO列表"""
        print(f"🔍 获取地址 {address} 的UTXO...")
        
        # 获取地址的UTXO
        result = self.rpc.call("listunspent", [0, 9999999, [address]])
        
        if "error" in result:
            print(f"❌ 获取UTXO失败: {result['error']}")
            return []
        
        utxos = result['result']
        print(f"✅ 找到 {len(utxos)} 个UTXO")
        
        # 显示UTXO信息
        for i, utxo in enumerate(utxos):
            print(f"   UTXO {i+1}: {utxo['txid'][:16]}... (vout: {utxo['vout']})")
            print(f"       金额: {utxo['amount']} BTC")
            print(f"       确认数: {utxo['confirmations']}")
            print(f"       地址: {utxo['address']}")
        
        return utxos
    
    def estimate_fee(self, input_count: int, output_count: int, 
                    segwit: bool = True) -> float:
        """估算交易费用"""
        # SegWit交易的权重计算
        if segwit:
            # P2WPKH输入: 67.75权重单位
            # P2WPKH输出: 31权重单位
            # 交易头: 10.5权重单位
            total_weight = (input_count * 67.75) + (output_count * 31) + 10.5
            # 转换为虚拟大小（权重/4）
            virtual_size = total_weight / 4
        else:
            # 传统P2PKH交易
            virtual_size = (input_count * 148) + (output_count * 34) + 10
        
        # 获取当前费率（这里使用固定费率，实际应该从mempool获取）
        fee_rate = 10  # sat/vB
        
        fee_sats = virtual_size * fee_rate
        fee_btc = fee_sats / 100000000
        
        print(f"💰 费用估算:")
        print(f"   输入数量: {input_count}")
        print(f"   输出数量: {output_count}")
        print(f"   交易类型: {'SegWit' if segwit else 'Legacy'}")
        print(f"   虚拟大小: {virtual_size:.2f} vB")
        print(f"   费率: {fee_rate} sat/vB")
        print(f"   估算费用: {fee_btc:.8f} BTC ({fee_sats} sats)")
        
        return fee_btc
    
    def create_segwit_transaction(self, 
                                from_address: str,
                                to_address: str,
                                amount: float,
                                fee_rate: Optional[float] = None) -> Dict[str, Any]:
        """
        创建SegWit交易
        
        Args:
            from_address: 发送地址
            to_address: 接收地址
            amount: 发送金额（BTC）
            fee_rate: 费率（sat/vB），如果为None则自动估算
        
        Returns:
            交易信息字典
        """
        print(f"🔧 创建SegWit交易...")
        print(f"   从: {from_address}")
        print(f"   到: {to_address}")
        print(f"   金额: {amount} BTC")
        
        # 1. 获取UTXO
        utxos = self.get_utxos(from_address)
        if not utxos:
            return {"error": "没有可用的UTXO"}
        
        # 2. 选择UTXO（这里简化处理，选择第一个）
        selected_utxo = utxos[0]
        available_amount = selected_utxo['amount']
        
        print(f"📦 选择UTXO: {selected_utxo['txid'][:16]}...")
        print(f"   可用金额: {available_amount} BTC")
        
        # 3. 估算费用
        if fee_rate is None:
            estimated_fee = self.estimate_fee(1, 2, segwit=True)  # 1输入，2输出（包括找零）
        else:
            estimated_fee = fee_rate / 100000000  # 转换为BTC
        
        # 4. 计算找零
        change_amount = available_amount - amount - estimated_fee
        
        if change_amount < 0:
            return {"error": f"余额不足。需要: {amount + estimated_fee} BTC，可用: {available_amount} BTC"}
        
        # 5. 构建交易输入
        inputs = [{
            "txid": selected_utxo['txid'],
            "vout": selected_utxo['vout']
        }]
        
        # 6. 构建交易输出
        outputs = {
            to_address: amount
        }
        
        # 添加找零输出（如果找零金额足够大）
        if change_amount > 0.00001:  # 大于粉尘限制
            outputs[from_address] = change_amount
            print(f"💰 找零: {change_amount} BTC")
        
        print(f"📋 交易结构:")
        print(f"   输入: {len(inputs)} 个")
        print(f"   输出: {len(outputs)} 个")
        print(f"   费用: {estimated_fee:.8f} BTC")
        
        # 7. 创建原始交易
        print(f"🔨 创建原始交易...")
        raw_tx_result = self.rpc.call("createrawtransaction", [inputs, outputs])
        
        if "error" in raw_tx_result:
            print(f"❌ 创建原始交易失败: {raw_tx_result['error']}")
            return raw_tx_result
        
        raw_tx_hex = raw_tx_result['result']
        print(f"✅ 原始交易创建成功")
        print(f"   交易数据: {raw_tx_hex[:64]}...")
        
        # 8. 解码交易以验证
        decoded_result = self.rpc.call("decoderawtransaction", [raw_tx_hex])
        if "error" not in decoded_result:
            decoded_tx = decoded_result['result']
            print(f"📊 交易详情:")
            print(f"   版本: {decoded_tx['version']}")
            print(f"   输入数量: {len(decoded_tx['vin'])}")
            print(f"   输出数量: {len(decoded_tx['vout'])}")
            print(f"   锁定时间: {decoded_tx['locktime']}")
        
        return {
            "raw_tx": raw_tx_hex,
            "inputs": inputs,
            "outputs": outputs,
            "fee": estimated_fee,
            "change": change_amount
        }
    
    def sign_transaction(self, raw_tx_hex: str) -> Dict[str, Any]:
        """签名交易"""
        print(f"✍️  签名交易...")
        
        # 使用钱包签名
        sign_result = self.rpc.call("signrawtransactionwithwallet", [raw_tx_hex])
        
        if "error" in sign_result:
            print(f"❌ 签名失败: {sign_result['error']}")
            return sign_result
        
        signed_tx = sign_result['result']
        
        if signed_tx['complete']:
            print(f"✅ 交易签名完成")
            print(f"   签名状态: 完整")
            print(f"   签名交易: {signed_tx['hex'][:64]}...")
        else:
            print(f"⚠️  交易签名不完整")
            print(f"   错误: {signed_tx.get('errors', '未知错误')}")
        
        return signed_tx
    
    def broadcast_transaction(self, signed_tx_hex: str) -> Dict[str, Any]:
        """广播交易"""
        print(f"📡 广播交易...")
        
        broadcast_result = self.rpc.call("sendrawtransaction", [signed_tx_hex])
        
        if "error" in broadcast_result:
            print(f"❌ 广播失败: {broadcast_result['error']}")
            return broadcast_result
        
        txid = broadcast_result['result']
        print(f"✅ 交易广播成功!")
        print(f"   交易ID: {txid}")
        print(f"   区块浏览器: https://blockstream.info/tx/{txid}")
        
        return {"txid": txid}
    
    def analyze_segwit_benefits(self, legacy_size: int, segwit_weight: int):
        """分析SegWit的优势"""
        print(f"📊 SegWit优势分析")
        print("=" * 40)
        
        # 计算虚拟大小
        segwit_vsize = segwit_weight / 4
        
        # 计算费用节省
        fee_rate = 10  # sat/vB
        legacy_fee = legacy_size * fee_rate
        segwit_fee = segwit_vsize * fee_rate
        fee_savings = legacy_fee - segwit_fee
        savings_percent = (fee_savings / legacy_fee) * 100
        
        print(f"传统交易大小: {legacy_size} 字节")
        print(f"SegWit交易权重: {segwit_weight} 权重单位")
        print(f"SegWit虚拟大小: {segwit_vsize:.2f} vB")
        print(f"传统交易费用: {legacy_fee} sats")
        print(f"SegWit交易费用: {segwit_fee:.2f} sats")
        print(f"费用节省: {fee_savings:.2f} sats ({savings_percent:.1f}%)")
        
        # 容量提升
        block_size_limit = 1000000  # 1MB
        segwit_block_capacity = 4000000  # 4M权重单位
        
        legacy_txs_per_block = block_size_limit // legacy_size
        segwit_txs_per_block = segwit_block_capacity // segwit_weight
        
        print(f"\n📈 区块容量提升:")
        print(f"传统交易/区块: {legacy_txs_per_block}")
        print(f"SegWit交易/区块: {segwit_txs_per_block}")
        print(f"容量提升: {(segwit_txs_per_block / legacy_txs_per_block - 1) * 100:.1f}%")

def demo_segwit_transaction():
    """演示SegWit交易创建"""
    print("🚀 SegWit交易创建演示")
    print("=" * 50)
    
    # 初始化RPC客户端
    rpc = BitcoinRPC()
    
    # 创建SegWit交易管理器
    segwit_manager = SegWitTransactionManager(rpc)
    
    # 示例地址（实际使用时应该替换为真实的地址）
    from_address = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
    to_address = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
    
    print(f"📝 使用示例地址:")
    print(f"   发送地址: {from_address}")
    print(f"   接收地址: {to_address}")
    
    # 创建SegWit交易
    try:
        # 创建交易（不实际广播）
        tx_info = segwit_manager.create_segwit_transaction(
            from_address=from_address,
            to_address=to_address,
            amount=0.001,  # 0.001 BTC
            fee_rate=10    # 10 sat/vB
        )
        
        if "error" in tx_info:
            print(f"❌ 创建交易失败: {tx_info['error']}")
            print(f"💡 提示: 请确保地址有足够的UTXO，或者使用真实的比特币地址")
            return
        
        print(f"\n✅ 交易创建成功!")
        print(f"   原始交易: {tx_info['raw_tx'][:64]}...")
        print(f"   估算费用: {tx_info['fee']:.8f} BTC")
        
        # 分析SegWit优势
        print(f"\n📊 SegWit优势分析:")
        segwit_manager.analyze_segwit_benefits(
            legacy_size=225,    # 传统P2PKH交易大小
            segwit_weight=579   # SegWit P2WPKH交易权重
        )
        
    except Exception as e:
        print(f"❌ 演示过程中发生错误: {e}")

def demo_segwit_vs_legacy():
    """演示SegWit vs 传统交易的对比"""
    print("\n🔄 SegWit vs 传统交易对比")
    print("=" * 50)
    
    # 交易大小对比
    print("📏 交易大小对比:")
    print("   传统P2PKH交易: 225 字节")
    print("   SegWit P2WPKH交易: 579 权重单位 (≈ 144.75 vB)")
    print("   大小减少: 35.7%")
    
    # 费用对比
    print("\n💰 费用对比 (费率: 10 sat/vB):")
    print("   传统P2PKH交易: 2,250 sats")
    print("   SegWit P2WPKH交易: 1,447.5 sats")
    print("   费用节省: 801.5 sats (35.6%)")
    
    # 安全性对比
    print("\n🔒 安全性对比:")
    print("   传统交易: 容易受到交易延展性攻击")
    print("   SegWit交易: 修复了交易延展性问题")
    print("   安全性: 显著提升")
    
    # 兼容性对比
    print("\n🔗 兼容性对比:")
    print("   传统交易: 所有节点都支持")
    print("   SegWit交易: 需要SegWit支持，但向后兼容")
    print("   兼容性: 完全向后兼容")

if __name__ == "__main__":
    print("⚡ 比特币SegWit交易创建工具")
    print("基于第07讲《比特币交易进阶》实战演练")
    print("=" * 60)
    
    # 演示SegWit交易创建
    demo_segwit_transaction()
    
    # 演示SegWit vs 传统交易对比
    demo_segwit_vs_legacy()
    
    print(f"\n💡 使用说明:")
    print(f"   - 确保比特币节点支持SegWit")
    print(f"   - 使用bc1开头的地址获得最佳SegWit效果")
    print(f"   - SegWit交易费用更低，安全性更高")
    print(f"   - 所有现代钱包都支持SegWit")
    
    print(f"\n🎉 演示完成!")
    print(f"📚 更多信息请参考: https://github.com/beihaili/Get-Started-with-Web3") 