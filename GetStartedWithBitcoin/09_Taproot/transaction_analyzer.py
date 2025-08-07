#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
复杂交易分析工具
基于第07讲《比特币交易进阶》的实战演练

作者: beihaili
日期: 2025-01-04
"""

import requests
import json
import time
from typing import List, Dict, Any, Optional
from collections import defaultdict

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

class TransactionAnalyzer:
    """交易分析器"""
    
    def __init__(self, rpc_client: BitcoinRPC):
        self.rpc = rpc_client
    
    def get_transaction(self, txid: str) -> Dict[str, Any]:
        """获取交易详情"""
        print(f"🔍 获取交易 {txid}...")
        
        # 获取交易详情
        result = self.rpc.call("gettransaction", [txid])
        
        if "error" in result:
            print(f"❌ 获取交易失败: {result['error']}")
            return result
        
        return result['result']
    
    def decode_raw_transaction(self, raw_tx_hex: str) -> Dict[str, Any]:
        """解码原始交易"""
        result = self.rpc.call("decoderawtransaction", [raw_tx_hex])
        
        if "error" in result:
            print(f"❌ 解码交易失败: {result['error']}")
            return result
        
        return result['result']
    
    def analyze_transaction(self, txid: str) -> Dict[str, Any]:
        """
        分析交易类型和特征
        
        Args:
            txid: 交易ID
        
        Returns:
            交易分析结果
        """
        print(f"📊 分析交易: {txid}")
        print("=" * 50)
        
        # 获取交易详情
        tx_info = self.get_transaction(txid)
        if "error" in tx_info:
            return tx_info
        
        # 解码交易
        decoded_tx = self.decode_raw_transaction(tx_info['hex'])
        if "error" in decoded_tx:
            return decoded_tx
        
        # 初始化分析结果
        analysis = {
            'txid': txid,
            'size': len(tx_info['hex']) // 2,  # 十六进制字符串长度的一半
            'weight': 0,
            'virtual_size': 0,
            'input_count': len(decoded_tx['vin']),
            'output_count': len(decoded_tx['vout']),
            'input_types': [],
            'output_types': [],
            'segwit': False,
            'taproot': False,
            'multisig': False,
            'op_return': False,
            'fee_estimate': 0,
            'complexity_score': 0
        }
        
        # 分析输入
        print(f"📥 分析 {analysis['input_count']} 个输入...")
        for i, inp in enumerate(decoded_tx['vin']):
            input_type = self._analyze_input(inp)
            analysis['input_types'].append(input_type)
            print(f"   输入 {i+1}: {input_type}")
        
        # 分析输出
        print(f"📤 分析 {analysis['output_count']} 个输出...")
        for i, out in enumerate(decoded_tx['vout']):
            output_type = self._analyze_output(out)
            analysis['output_types'].append(output_type)
            print(f"   输出 {i+1}: {output_type}")
        
        # 计算权重和虚拟大小
        analysis['weight'] = self._calculate_weight(decoded_tx)
        analysis['virtual_size'] = analysis['weight'] / 4
        
        # 检测特殊特征
        analysis['segwit'] = any('witness' in inp and inp['witness'] for inp in decoded_tx['vin'])
        analysis['taproot'] = any('witness_v1_taproot' in out_type for out_type in analysis['output_types'])
        analysis['multisig'] = any('multisig' in out_type for out_type in analysis['output_types'])
        analysis['op_return'] = any('nulldata' in out_type for out_type in analysis['output_types'])
        
        # 估算费用
        analysis['fee_estimate'] = self._estimate_fee(analysis['virtual_size'])
        
        # 计算复杂度评分
        analysis['complexity_score'] = self._calculate_complexity_score(analysis)
        
        return analysis
    
    def _analyze_input(self, inp: Dict[str, Any]) -> str:
        """分析输入类型"""
        # 检查是否有witness数据
        if 'witness' in inp and inp['witness']:
            witness_count = len(inp['witness'])
            if witness_count == 2:
                return 'P2WPKH (SegWit)'
            elif witness_count == 3:
                return 'P2WSH (SegWit多签)'
            elif witness_count > 3:
                return 'Complex SegWit'
            else:
                return 'Unknown SegWit'
        
        # 检查scriptSig
        if 'scriptSig' in inp and inp['scriptSig']['hex']:
            script_hex = inp['scriptSig']['hex']
            if len(script_hex) == 130:  # 65字节签名 + 65字节公钥
                return 'P2PKH (Legacy)'
            elif len(script_hex) > 130:
                return 'P2SH (Legacy多签)'
            else:
                return 'Unknown Legacy'
        
        return 'Coinbase'  # 创币交易
    
    def _analyze_output(self, out: Dict[str, Any]) -> str:
        """分析输出类型"""
        script_pub_key = out['scriptPubKey']
        script_type = script_pub_key.get('type', 'unknown')
        
        if script_type == 'pubkeyhash':
            return 'P2PKH (Legacy)'
        elif script_type == 'scripthash':
            # 检查是否是多签
            if 'addresses' in script_pub_key and len(script_pub_key['addresses']) == 1:
                return 'P2SH (Legacy多签)'
            else:
                return 'P2SH (Legacy)'
        elif script_type == 'witness_v0_keyhash':
            return 'P2WPKH (SegWit)'
        elif script_type == 'witness_v0_scripthash':
            return 'P2WSH (SegWit多签)'
        elif script_type == 'witness_v1_taproot':
            return 'P2TR (Taproot)'
        elif script_type == 'nulldata':
            return 'OP_RETURN (数据)'
        elif script_type == 'pubkey':
            return 'P2PK (公钥)'
        else:
            return f'Unknown ({script_type})'
    
    def _calculate_weight(self, decoded_tx: Dict[str, Any]) -> int:
        """计算交易权重"""
        total_weight = 0
        
        # 交易头: 4字节 * 4 = 16权重单位
        total_weight += 16
        
        # 输入权重
        for inp in decoded_tx['vin']:
            # 输入头: 32字节txid + 4字节vout + 4字节sequence = 40字节 * 4 = 160权重单位
            total_weight += 160
            
            # scriptSig权重
            if 'scriptSig' in inp and inp['scriptSig']['hex']:
                script_size = len(inp['scriptSig']['hex']) // 2
                total_weight += script_size * 4
            
            # witness权重
            if 'witness' in inp and inp['witness']:
                for witness_item in inp['witness']:
                    if witness_item:
                        witness_size = len(witness_item) // 2
                        total_weight += witness_size
        
        # 输出权重
        for out in decoded_tx['vout']:
            # 输出头: 8字节金额 = 8字节 * 4 = 32权重单位
            total_weight += 32
            
            # scriptPubKey权重
            script_size = len(out['scriptPubKey']['hex']) // 2
            total_weight += script_size * 4
        
        return int(total_weight)
    
    def _estimate_fee(self, virtual_size: float, fee_rate: int = 10) -> int:
        """估算交易费用（sats）"""
        return int(virtual_size * fee_rate)
    
    def _calculate_complexity_score(self, analysis: Dict[str, Any]) -> int:
        """计算交易复杂度评分（0-100）"""
        score = 0
        
        # 基础分数
        score += analysis['input_count'] * 5
        score += analysis['output_count'] * 5
        
        # 特殊类型加分
        if analysis['segwit']:
            score += 10
        if analysis['taproot']:
            score += 15
        if analysis['multisig']:
            score += 20
        if analysis['op_return']:
            score += 10
        
        # 输入类型多样性
        unique_input_types = len(set(analysis['input_types']))
        score += unique_input_types * 5
        
        # 输出类型多样性
        unique_output_types = len(set(analysis['output_types']))
        score += unique_output_types * 5
        
        return min(score, 100)
    
    def print_analysis_report(self, analysis: Dict[str, Any]):
        """打印分析报告"""
        print(f"\n📋 交易分析报告")
        print("=" * 50)
        
        # 基本信息
        print(f"🔍 基本信息:")
        print(f"   交易ID: {analysis['txid']}")
        print(f"   大小: {analysis['size']} 字节")
        print(f"   权重: {analysis['weight']} 权重单位")
        print(f"   虚拟大小: {analysis['virtual_size']:.2f} vB")
        print(f"   输入数量: {analysis['input_count']}")
        print(f"   输出数量: {analysis['output_count']}")
        
        # 交易类型
        print(f"\n🏷️  交易类型:")
        if analysis['segwit']:
            print(f"   ✅ SegWit交易")
        if analysis['taproot']:
            print(f"   ✅ Taproot交易")
        if analysis['multisig']:
            print(f"   ✅ 多重签名交易")
        if analysis['op_return']:
            print(f"   ✅ 包含OP_RETURN数据")
        
        # 输入类型统计
        print(f"\n📥 输入类型统计:")
        input_counts = defaultdict(int)
        for input_type in analysis['input_types']:
            input_counts[input_type] += 1
        
        for input_type, count in input_counts.items():
            print(f"   {input_type}: {count} 个")
        
        # 输出类型统计
        print(f"\n📤 输出类型统计:")
        output_counts = defaultdict(int)
        for output_type in analysis['output_types']:
            output_counts[output_type] += 1
        
        for output_type, count in output_counts.items():
            print(f"   {output_type}: {count} 个")
        
        # 费用分析
        print(f"\n💰 费用分析:")
        print(f"   估算费用: {analysis['fee_estimate']} sats")
        print(f"   费率: 10 sat/vB")
        
        # 复杂度评分
        print(f"\n📊 复杂度评分:")
        score = analysis['complexity_score']
        if score < 30:
            complexity_level = "简单"
        elif score < 60:
            complexity_level = "中等"
        else:
            complexity_level = "复杂"
        
        print(f"   评分: {score}/100 ({complexity_level})")
        
        # 技术特征
        print(f"\n🔧 技术特征:")
        if analysis['segwit']:
            print(f"   ✅ 使用SegWit技术，费用更低")
        if analysis['taproot']:
            print(f"   ✅ 使用Taproot技术，隐私更好")
        if analysis['multisig']:
            print(f"   ✅ 多重签名，安全性更高")
        if analysis['op_return']:
            print(f"   ✅ 包含链上数据")
    
    def analyze_multiple_transactions(self, txids: List[str]) -> List[Dict[str, Any]]:
        """分析多个交易"""
        print(f"🔍 批量分析 {len(txids)} 个交易...")
        
        results = []
        for i, txid in enumerate(txids):
            print(f"\n📊 分析交易 {i+1}/{len(txids)}: {txid}")
            analysis = self.analyze_transaction(txid)
            
            if "error" not in analysis:
                results.append(analysis)
                self.print_analysis_report(analysis)
            else:
                print(f"❌ 分析失败: {analysis['error']}")
        
        return results
    
    def generate_statistics(self, analyses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """生成统计信息"""
        if not analyses:
            return {}
        
        stats = {
            'total_transactions': len(analyses),
            'avg_size': sum(a['size'] for a in analyses) / len(analyses),
            'avg_weight': sum(a['weight'] for a in analyses) / len(analyses),
            'avg_virtual_size': sum(a['virtual_size'] for a in analyses) / len(analyses),
            'avg_fee': sum(a['fee_estimate'] for a in analyses) / len(analyses),
            'segwit_count': sum(1 for a in analyses if a['segwit']),
            'taproot_count': sum(1 for a in analyses if a['taproot']),
            'multisig_count': sum(1 for a in analyses if a['multisig']),
            'op_return_count': sum(1 for a in analyses if a['op_return']),
            'complexity_distribution': {
                'simple': sum(1 for a in analyses if a['complexity_score'] < 30),
                'medium': sum(1 for a in analyses if 30 <= a['complexity_score'] < 60),
                'complex': sum(1 for a in analyses if a['complexity_score'] >= 60)
            }
        }
        
        return stats

def demo_transaction_analysis():
    """演示交易分析"""
    print("🔍 比特币交易分析工具")
    print("基于第07讲《比特币交易进阶》实战演练")
    print("=" * 60)
    
    # 初始化RPC客户端
    rpc = BitcoinRPC()
    
    # 创建交易分析器
    analyzer = TransactionAnalyzer(rpc)
    
    # 示例交易ID（实际使用时应该替换为真实的交易ID）
    sample_txids = [
        "f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16",  # 著名的披萨交易
        "a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d",  # 另一个历史交易
    ]
    
    print(f"📝 使用示例交易进行分析:")
    for i, txid in enumerate(sample_txids):
        print(f"   交易 {i+1}: {txid}")
    
    # 分析交易
    try:
        analyses = analyzer.analyze_multiple_transactions(sample_txids)
        
        if analyses:
            # 生成统计信息
            stats = analyzer.generate_statistics(analyses)
            
            print(f"\n📊 批量分析统计:")
            print("=" * 50)
            print(f"总交易数: {stats['total_transactions']}")
            print(f"平均大小: {stats['avg_size']:.2f} 字节")
            print(f"平均权重: {stats['avg_weight']:.2f} 权重单位")
            print(f"平均虚拟大小: {stats['avg_virtual_size']:.2f} vB")
            print(f"平均费用: {stats['avg_fee']:.2f} sats")
            print(f"SegWit交易: {stats['segwit_count']} 个")
            print(f"Taproot交易: {stats['taproot_count']} 个")
            print(f"多重签名交易: {stats['multisig_count']} 个")
            print(f"OP_RETURN交易: {stats['op_return_count']} 个")
            
            print(f"\n复杂度分布:")
            print(f"   简单交易: {stats['complexity_distribution']['simple']} 个")
            print(f"   中等交易: {stats['complexity_distribution']['medium']} 个")
            print(f"   复杂交易: {stats['complexity_distribution']['complex']} 个")
        
    except Exception as e:
        print(f"❌ 分析过程中发生错误: {e}")
        print(f"💡 提示: 请确保比特币节点正在运行，或者使用真实的交易ID")

def demo_offline_analysis():
    """演示离线分析（不依赖RPC）"""
    print("\n🖥️  离线交易分析演示")
    print("=" * 50)
    
    # 模拟分析结果
    sample_analysis = {
        'txid': 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
        'size': 225,
        'weight': 900,
        'virtual_size': 225.0,
        'input_count': 1,
        'output_count': 2,
        'input_types': ['P2PKH (Legacy)'],
        'output_types': ['P2PKH (Legacy)', 'P2PKH (Legacy)'],
        'segwit': False,
        'taproot': False,
        'multisig': False,
        'op_return': False,
        'fee_estimate': 2250,
        'complexity_score': 15
    }
    
    print("📊 模拟分析结果:")
    print(f"   交易ID: {sample_analysis['txid']}")
    print(f"   大小: {sample_analysis['size']} 字节")
    print(f"   输入: {sample_analysis['input_count']} 个")
    print(f"   输出: {sample_analysis['output_count']} 个")
    print(f"   类型: 传统P2PKH交易")
    print(f"   复杂度: 简单")
    
    print(f"\n💡 分析说明:")
    print(f"   - 这是一个典型的传统比特币交易")
    print(f"   - 使用P2PKH地址格式")
    print(f"   - 没有使用SegWit或Taproot技术")
    print(f"   - 交易结构简单，费用相对较高")

if __name__ == "__main__":
    # 演示在线分析（需要比特币节点）
    demo_transaction_analysis()
    
    # 演示离线分析（不需要比特币节点）
    demo_offline_analysis()
    
    print(f"\n💡 使用说明:")
    print(f"   - 确保比特币节点正在运行")
    print(f"   - 使用真实的交易ID进行分析")
    print(f"   - 分析结果包含交易类型、费用、复杂度等信息")
    print(f"   - 支持批量分析多个交易")
    
    print(f"\n🎉 演示完成!")
    print(f"📚 更多信息请参考: https://github.com/beihaili/Get-Started-with-Web3") 