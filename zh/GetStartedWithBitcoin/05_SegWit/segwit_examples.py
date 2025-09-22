#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
SegWit技术完整示例
包含本章节涉及的所有SegWit操作实现

依赖安装:
pip install python-bitcoinrpc requests

使用方法:
python segwit_examples.py
"""

import requests
import json
import hashlib
import binascii
from bitcoinrpc.authproxy import AuthServiceProxy

class SegWitAnalyzer:
    """SegWit技术分析工具"""
    
    def __init__(self, username="your_username", password="your_password"):
        self.rpc_url = f"http://{username}:{password}@127.0.0.1:8332"
        self.rpc = AuthServiceProxy(self.rpc_url)
    
    def compare_transaction_formats(self, txid):
        """对比传统交易和SegWit交易格式"""
        print(f"=== 交易格式对比分析: {txid} ===")
        
        try:
            # 获取交易详情
            tx = self.rpc.getrawtransaction(txid, True)
            
            print(f"交易ID: {tx['txid']}")
            print(f"版本: {tx['version']}")
            print(f"大小: {tx['size']} 字节")
            
            # 检查是否为SegWit交易
            has_witness = any('witness' in vin for vin in tx['vin'])
            print(f"SegWit交易: {'是' if has_witness else '否'}")
            
            if has_witness:
                vsize = tx.get('vsize', tx['size'])
                weight = tx.get('weight', tx['size'] * 4)
                
                print(f"虚拟大小: {vsize} 字节")
                print(f"权重: {weight} 单位")
                print(f"权重效率: {tx['size'] / vsize:.2f}x")
                
                # 分析witness数据
                print("\nWitness数据分析:")
                for i, vin in enumerate(tx['vin']):
                    if 'witness' in vin:
                        witness_data = vin['witness']
                        witness_size = sum(len(w) // 2 for w in witness_data)
                        print(f"  输入 {i+1} witness大小: {witness_size} 字节")
                        print(f"  witness项目数: {len(witness_data)}")
            
            return tx
            
        except Exception as e:
            print(f"分析失败: {e}")
            return None
    
    def calculate_transaction_weight(self, tx_hex):
        """计算交易权重"""
        print("=== 交易权重计算 ===")
        
        try:
            # 解码交易
            decoded = self.rpc.decoderawtransaction(tx_hex)
            
            # 基础数据大小（不包括witness）
            base_size = decoded['size']
            total_size = decoded.get('size', base_size)
            
            # 检查是否有witness数据
            has_witness = any('witness' in vin for vin in decoded['vin'])
            
            if has_witness:
                vsize = decoded.get('vsize', base_size)
                weight = decoded.get('weight', base_size * 4)
                
                # 计算witness数据大小
                witness_size = total_size - base_size
                
                print(f"基础交易大小: {base_size} 字节")
                print(f"Witness数据大小: {witness_size} 字节")
                print(f"总大小: {total_size} 字节")
                print(f"权重: {weight} 单位")
                print(f"虚拟大小: {vsize} 字节")
                
                # 权重计算验证
                calculated_weight = base_size * 4 + witness_size
                print(f"计算权重: {calculated_weight} 单位")
                
                # 费用对比
                traditional_fee_rate = 10  # sat/byte
                segwit_fee_rate = 10      # sat/weight
                
                traditional_fee = total_size * traditional_fee_rate
                segwit_fee = vsize * segwit_fee_rate
                
                print(f"\n费用对比 (10 sat/unit):")
                print(f"传统方式: {traditional_fee} sat")
                print(f"SegWit方式: {segwit_fee} sat")
                print(f"节省: {traditional_fee - segwit_fee} sat ({(1 - segwit_fee/traditional_fee)*100:.1f}%)")
            
            else:
                print(f"传统交易大小: {total_size} 字节")
                print("无witness数据")
            
        except Exception as e:
            print(f"权重计算失败: {e}")
    
    def create_segwit_transaction(self, to_address, amount_btc):
        """创建SegWit交易"""
        print(f"=== 创建SegWit交易 ===")
        
        try:
            # 获取SegWit UTXO
            utxos = self.rpc.listunspent()
            segwit_utxos = [u for u in utxos if u['address'].startswith('bc1')]
            
            if not segwit_utxos:
                print("❌ 没有可用的SegWit UTXO")
                return None
            
            # 选择合适的UTXO
            selected_utxo = None
            for utxo in sorted(segwit_utxos, key=lambda x: x['amount'], reverse=True):
                if utxo['amount'] >= amount_btc + 0.0001:  # 包括预估费用
                    selected_utxo = utxo
                    break
            
            if not selected_utxo:
                print("❌ 没有足够的SegWit UTXO")
                return None
            
            print(f"选择SegWit UTXO: {selected_utxo['amount']} BTC")
            
            # 构造输入
            inputs = [{
                "txid": selected_utxo['txid'],
                "vout": selected_utxo['vout']
            }]
            
            # 构造输出
            fee = 0.0001
            change = selected_utxo['amount'] - amount_btc - fee
            
            outputs = {to_address: amount_btc}
            
            if change > 0.00001:  # 大于粉尘限制
                change_address = self.rpc.getnewaddress("", "bech32")
                outputs[change_address] = change
                print(f"SegWit找零地址: {change_address}")
            
            # 创建和签名交易
            raw_tx = self.rpc.createrawtransaction(inputs, outputs)
            signed_result = self.rpc.signrawtransactionwithwallet(raw_tx)
            
            if signed_result['complete']:
                print("✅ SegWit交易创建成功")
                
                # 分析创建的交易
                self.calculate_transaction_weight(signed_result['hex'])
                
                return signed_result['hex']
            else:
                print("❌ 交易签名失败")
                return None
                
        except Exception as e:
            print(f"创建SegWit交易失败: {e}")
            return None

class SegWitAddressManager:
    """SegWit地址管理工具"""
    
    def __init__(self, rpc_client):
        self.rpc = rpc_client
    
    def generate_segwit_addresses(self, count=5):
        """生成多个SegWit地址"""
        print(f"=== 生成 {count} 个SegWit地址 ===")
        
        addresses = []
        
        for i in range(count):
            try:
                # 生成native SegWit地址 (bech32)
                bech32_addr = self.rpc.getnewaddress("", "bech32")
                
                # 生成P2SH-wrapped SegWit地址
                p2sh_addr = self.rpc.getnewaddress("", "p2sh-segwit")
                
                addresses.append({
                    'index': i + 1,
                    'bech32': bech32_addr,
                    'p2sh_segwit': p2sh_addr
                })
                
                print(f"地址 {i+1}:")
                print(f"  Native SegWit: {bech32_addr}")
                print(f"  P2SH-SegWit: {p2sh_addr}")
                
            except Exception as e:
                print(f"生成地址 {i+1} 失败: {e}")
        
        return addresses
    
    def analyze_address_type(self, address):
        """分析地址类型"""
        print(f"=== 地址类型分析: {address} ===")
        
        try:
            # 验证地址
            result = self.rpc.validateaddress(address)
            
            if not result['isvalid']:
                print("❌ 无效地址")
                return None
            
            print(f"地址有效性: ✅")
            print(f"地址类型: {result.get('scripttype', '未知')}")
            print(f"是否为SegWit: {'是' if result.get('iswitness', False) else '否'}")
            
            if result.get('iswitness'):
                print(f"Witness版本: {result.get('witness_version', 'N/A')}")
                print(f"Witness程序: {result.get('witness_program', 'N/A')}")
            
            return result
            
        except Exception as e:
            print(f"地址分析失败: {e}")
            return None

class BlockCapacityAnalyzer:
    """区块容量分析工具"""
    
    def __init__(self, rpc_client):
        self.rpc = rpc_client
    
    def analyze_block_capacity(self, block_hash):
        """分析指定区块的容量使用情况"""
        print(f"=== 区块容量分析 ===")
        
        try:
            block = self.rpc.getblock(block_hash, 2)  # 获取完整交易数据
            
            print(f"区块哈希: {block['hash']}")
            print(f"区块高度: {block['height']}")
            print(f"区块大小: {block['size']} 字节")
            print(f"区块权重: {block.get('weight', block['size'] * 4)} 单位")
            print(f"交易数量: {len(block['tx'])}")
            
            # 分析交易类型
            segwit_count = 0
            traditional_count = 0
            total_weight = 0
            
            for tx in block['tx']:
                has_witness = any('witness' in vin for vin in tx['vin'])
                if has_witness:
                    segwit_count += 1
                else:
                    traditional_count += 1
                
                tx_weight = tx.get('weight', tx['size'] * 4)
                total_weight += tx_weight
            
            print(f"\n交易类型统计:")
            print(f"SegWit交易: {segwit_count} ({segwit_count/len(block['tx'])*100:.1f}%)")
            print(f"传统交易: {traditional_count} ({traditional_count/len(block['tx'])*100:.1f}%)")
            
            print(f"\n容量利用:")
            print(f"总权重: {total_weight:,} / 4,000,000 ({total_weight/4000000*100:.1f}%)")
            
            # 计算等效传统区块大小
            equivalent_size = total_weight / 4
            print(f"等效传统区块大小: {equivalent_size/1000000:.2f} MB")
            
            return block
            
        except Exception as e:
            print(f"区块分析失败: {e}")
            return None
    
    def compare_fee_efficiency(self):
        """对比费用效率"""
        print("=== SegWit费用效率对比 ===")
        
        try:
            # 获取当前费率
            fee_rate = self.rpc.estimatesmartfee(6)
            if 'feerate' not in fee_rate:
                print("无法获取费率信息")
                return
            
            btc_per_kb = fee_rate['feerate']
            sat_per_byte = btc_per_kb * 100000000 / 1000
            
            print(f"当前推荐费率: {sat_per_byte:.2f} sat/byte")
            
            # 计算不同交易类型的费用
            transaction_types = {
                "简单P2PKH": {"size": 225, "weight": 900},
                "简单P2WPKH": {"size": 225, "weight": 573},
                "2-of-3多签P2SH": {"size": 400, "weight": 1600},
                "2-of-3多签P2WSH": {"size": 400, "weight": 1312}
            }
            
            print(f"\n费用对比 ({sat_per_byte:.0f} sat/byte):")
            print("-" * 60)
            
            for tx_type, specs in transaction_types.items():
                traditional_fee = specs['size'] * sat_per_byte
                segwit_fee = (specs['weight'] / 4) * sat_per_byte
                savings = traditional_fee - segwit_fee
                savings_pct = (savings / traditional_fee) * 100
                
                print(f"{tx_type}:")
                print(f"  传统方式: {traditional_fee:.0f} sat")
                print(f"  SegWit方式: {segwit_fee:.0f} sat")
                print(f"  节省: {savings:.0f} sat ({savings_pct:.1f}%)")
                print()
            
        except Exception as e:
            print(f"费用对比失败: {e}")

class TransactionMalleabilityDemo:
    """交易延展性演示"""
    
    def __init__(self, rpc_client):
        self.rpc = rpc_client
    
    def demonstrate_malleability_problem(self):
        """演示交易延展性问题"""
        print("=== 交易延展性问题演示 ===")
        
        # 模拟交易延展性
        original_transaction = {
            "version": 1,
            "inputs": [{
                "txid": "abcd1234...",
                "vout": 0,
                "scriptSig": "3045022100... 02fe5c..."  # 包含签名
            }],
            "outputs": [{
                "value": 100000000,  # 1 BTC
                "scriptPubKey": "OP_DUP OP_HASH160 ... OP_CHECKSIG"
            }],
            "locktime": 0
        }
        
        # 计算原始交易ID
        original_data = json.dumps(original_transaction, sort_keys=True)
        original_txid = hashlib.sha256(original_data.encode()).hexdigest()
        
        # 模拟恶意修改签名
        modified_transaction = original_transaction.copy()
        modified_transaction['inputs'][0]['scriptSig'] = "30440220... 02fe5c..."  # 修改DER编码
        
        # 计算修改后的交易ID
        modified_data = json.dumps(modified_transaction, sort_keys=True)
        modified_txid = hashlib.sha256(modified_data.encode()).hexdigest()
        
        print(f"原始交易ID: {original_txid}")
        print(f"修改后ID: {modified_txid}")
        print(f"交易ID改变: {'是' if original_txid != modified_txid else '否'}")
        print("⚠️  这就是交易延展性问题：交易有效，但ID可能被改变")
        
        # SegWit解决方案
        print(f"\nSegWit解决方案:")
        print("交易ID计算时排除witness数据")
        print("使签名修改不再影响交易ID")
    
    def compare_segwit_stability(self):
        """对比SegWit的稳定性"""
        print("=== SegWit稳定性对比 ===")
        
        segwit_transaction = {
            "version": 2,
            "inputs": [{
                "txid": "abcd1234...",
                "vout": 0,
                "scriptSig": "160014..."  # 只是witness程序引用
            }],
            "outputs": [{
                "value": 100000000,
                "scriptPubKey": "OP_0 ..."
            }],
            "locktime": 0,
            "witness": [["3045022100...", "02fe5c..."]]  # 签名数据在这里
        }
        
        # SegWit交易ID计算（排除witness）
        base_transaction = {k: v for k, v in segwit_transaction.items() if k != 'witness'}
        base_data = json.dumps(base_transaction, sort_keys=True)
        segwit_txid = hashlib.sha256(base_data.encode()).hexdigest()
        
        print(f"SegWit交易ID: {segwit_txid}")
        print("✅ 修改witness数据不会改变交易ID")
        print("✅ 为闪电网络等Layer 2提供稳定基础")

class SegWitMigrationTool:
    """SegWit迁移工具"""
    
    def __init__(self, rpc_client):
        self.rpc = rpc_client
    
    def migrate_to_segwit(self):
        """迁移资金到SegWit地址"""
        print("=== SegWit迁移工具 ===")
        
        try:
            # 获取传统地址的UTXO
            utxos = self.rpc.listunspent()
            legacy_utxos = [u for u in utxos if u['address'].startswith('1') or u['address'].startswith('3')]
            
            if not legacy_utxos:
                print("✅ 所有资金已在SegWit地址中")
                return
            
            total_legacy = sum(u['amount'] for u in legacy_utxos)
            print(f"传统地址资金总额: {total_legacy} BTC")
            print(f"传统UTXO数量: {len(legacy_utxos)}")
            
            # 生成SegWit接收地址
            segwit_address = self.rpc.getnewaddress("segwit_migration", "bech32")
            print(f"SegWit目标地址: {segwit_address}")
            
            # 估算迁移费用
            # 假设批量交易大小
            estimated_size = len(legacy_utxos) * 150 + 100  # 粗略估算
            fee_rate = self.rpc.estimatesmartfee(6).get('feerate', 0.00001)
            estimated_fee = (estimated_size / 1000) * fee_rate
            
            print(f"估算迁移费用: {estimated_fee:.8f} BTC")
            print(f"迁移后金额: {total_legacy - estimated_fee:.8f} BTC")
            
            # 警告提示
            print("\n⚠️  迁移注意事项:")
            print("1. 迁移会产生手续费")
            print("2. 迁移后获得长期费用节省")
            print("3. 提高交易优先级和确认速度")
            print("4. 支持更多高级功能")
            
        except Exception as e:
            print(f"迁移分析失败: {e}")

def main():
    """主程序"""
    print("🔗 SegWit技术分析工具\n")
    
    try:
        analyzer = SegWitAnalyzer()
        
        print("可用功能:")
        print("1. 分析交易格式")
        print("2. 计算交易权重")
        print("3. 创建SegWit交易")
        print("4. 费用效率对比")
        print("5. 交易延展性演示")
        print("6. 生成SegWit地址")
        print("7. SegWit迁移分析")
        
        choice = input("\n选择功能 (1-7): ")
        
        if choice == '1':
            txid = input("输入交易ID: ")
            analyzer.compare_transaction_formats(txid)
        
        elif choice == '2':
            tx_hex = input("输入原始交易十六进制: ")
            analyzer.calculate_transaction_weight(tx_hex)
        
        elif choice == '3':
            to_address = input("输入接收地址: ")
            amount = float(input("输入金额 (BTC): "))
            analyzer.create_segwit_transaction(to_address, amount)
        
        elif choice == '4':
            capacity_analyzer = BlockCapacityAnalyzer(analyzer.rpc)
            capacity_analyzer.compare_fee_efficiency()
        
        elif choice == '5':
            demo = TransactionMalleabilityDemo(analyzer.rpc)
            demo.demonstrate_malleability_problem()
            demo.compare_segwit_stability()
        
        elif choice == '6':
            addr_manager = SegWitAddressManager(analyzer.rpc)
            addr_manager.generate_segwit_addresses()
        
        elif choice == '7':
            migration_tool = SegWitMigrationTool(analyzer.rpc)
            migration_tool.migrate_to_segwit()
        
        else:
            print("无效选择")
    
    except Exception as e:
        print(f"程序执行错误: {e}")

if __name__ == "__main__":
    main()
