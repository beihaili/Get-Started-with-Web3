#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
比特币交易操作完整示例
包含本章节涉及的所有交易操作实现

依赖安装:
pip install requests python-bitcoinrpc

使用方法:
python transaction_examples.py
"""

import requests
import json
from bitcoinrpc.authproxy import AuthServiceProxy

class BitcoinTransactionManager:
    """比特币交易管理工具"""
    
    def __init__(self, username="your_username", password="your_password"):
        self.rpc_url = f"http://{username}:{password}@127.0.0.1:8332"
        self.rpc = AuthServiceProxy(self.rpc_url)
    
    def list_utxos(self, min_confirmations=1):
        """列出可用的UTXO"""
        print("=== 可用UTXO列表 ===")
        try:
            utxos = self.rpc.listunspent(min_confirmations)
            
            if not utxos:
                print("没有可用的UTXO")
                return []
            
            total_value = 0
            for i, utxo in enumerate(utxos):
                print(f"UTXO {i+1}:")
                print(f"  TXID: {utxo['txid']}")
                print(f"  VOUT: {utxo['vout']}")
                print(f"  金额: {utxo['amount']} BTC")
                print(f"  地址: {utxo['address']}")
                print(f"  确认数: {utxo['confirmations']}")
                print(f"  是否安全: {'是' if utxo['safe'] else '否'}")
                print("---")
                total_value += utxo['amount']
            
            print(f"总可用余额: {total_value} BTC\n")
            return utxos
            
        except Exception as e:
            print(f"获取UTXO失败: {e}")
            return []
    
    def analyze_transaction(self, txid):
        """分析指定交易的详细结构"""
        print(f"=== 交易分析: {txid} ===")
        
        try:
            # 获取原始交易
            raw_tx = self.rpc.getrawtransaction(txid, True)
            
            print(f"交易ID: {raw_tx['txid']}")
            print(f"版本: {raw_tx['version']}")
            print(f"大小: {raw_tx['size']} 字节")
            print(f"虚拟大小: {raw_tx.get('vsize', raw_tx['size'])} 字节")
            print(f"锁定时间: {raw_tx['locktime']}")
            
            # 分析输入
            print(f"\n输入数量: {len(raw_tx['vin'])}")
            input_total = 0
            
            for i, vin in enumerate(raw_tx['vin']):
                print(f"输入 {i+1}:")
                if 'coinbase' in vin:
                    print("  类型: Coinbase交易（挖矿奖励）")
                    print(f"  Coinbase数据: {vin['coinbase']}")
                else:
                    print(f"  引用TXID: {vin['txid']}")
                    print(f"  引用输出: {vin['vout']}")
                    print(f"  序列号: {vin['sequence']}")
                    
                    # 尝试获取输入金额
                    try:
                        prev_tx = self.rpc.getrawtransaction(vin['txid'], True)
                        input_amount = prev_tx['vout'][vin['vout']]['value']
                        input_total += input_amount
                        print(f"  金额: {input_amount} BTC")
                    except:
                        print("  金额: 无法获取")
            
            # 分析输出
            print(f"\n输出数量: {len(raw_tx['vout'])}")
            output_total = 0
            
            for i, vout in enumerate(raw_tx['vout']):
                print(f"输出 {i+1}:")
                print(f"  金额: {vout['value']} BTC")
                print(f"  脚本类型: {vout['scriptPubKey'].get('type', '未知')}")
                
                # 显示地址（如果有）
                addresses = vout['scriptPubKey'].get('addresses', [])
                if addresses:
                    print(f"  接收地址: {addresses[0]}")
                
                output_total += vout['value']
            
            # 计算矿工费
            if input_total > 0:
                fee = input_total - output_total
                print(f"\n矿工费: {fee} BTC ({fee * 100000000:.0f} 聪)")
                print(f"费率: {fee / raw_tx['vsize'] * 100000000:.2f} 聪/字节")
            
            return raw_tx
            
        except Exception as e:
            print(f"分析交易失败: {e}")
            return None
    
    def create_simple_transaction(self, to_address, amount_btc):
        """创建简单的P2PKH交易"""
        print(f"=== 创建交易：发送 {amount_btc} BTC 到 {to_address} ===")
        
        try:
            # 1. 检查余额
            balance = self.rpc.getbalance()
            if balance < amount_btc:
                print(f"❌ 余额不足: 可用 {balance} BTC，需要 {amount_btc} BTC")
                return None
            
            # 2. 获取UTXO
            utxos = self.rpc.listunspent()
            if not utxos:
                print("❌ 没有可用的UTXO")
                return None
            
            # 3. 选择合适的UTXO（简化：使用第一个足够大的）
            selected_utxo = None
            for utxo in utxos:
                if utxo['amount'] >= amount_btc:
                    selected_utxo = utxo
                    break
            
            if not selected_utxo:
                print("❌ 没有足够大的单个UTXO")
                return None
            
            print(f"选择UTXO: {selected_utxo['txid'][:16]}... ({selected_utxo['amount']} BTC)")
            
            # 4. 构造输入
            inputs = [{
                "txid": selected_utxo['txid'],
                "vout": selected_utxo['vout']
            }]
            
            # 5. 构造输出
            fee = 0.0001  # 固定矿工费
            change_amount = selected_utxo['amount'] - amount_btc - fee
            
            outputs = {to_address: amount_btc}
            
            if change_amount > 0.0001:  # 如果找零金额大于粉尘限制
                change_address = self.rpc.getnewaddress("", "bech32")
                outputs[change_address] = change_amount
                print(f"找零地址: {change_address} ({change_amount} BTC)")
            
            # 6. 创建原始交易
            raw_tx = self.rpc.createrawtransaction(inputs, outputs)
            print(f"原始交易: {raw_tx[:64]}...")
            
            # 7. 签名交易
            signed_result = self.rpc.signrawtransactionwithwallet(raw_tx)
            
            if not signed_result['complete']:
                print("❌ 交易签名失败")
                print(f"错误: {signed_result.get('errors', [])}")
                return None
            
            signed_tx = signed_result['hex']
            print(f"已签名交易: {signed_tx[:64]}...")
            
            # 8. 广播交易（注意：这会真实发送比特币！）
            print("⚠️  准备广播交易（实际转账）")
            confirm = input("确认发送？(yes/no): ")
            
            if confirm.lower() == 'yes':
                txid = self.rpc.sendrawtransaction(signed_tx)
                print(f"✅ 交易已发送！TXID: {txid}")
                return txid
            else:
                print("❌ 交易已取消")
                return None
                
        except Exception as e:
            print(f"创建交易失败: {e}")
            return None
    
    def monitor_transaction(self, txid):
        """监控交易确认状态"""
        print(f"=== 监控交易确认: {txid} ===")
        
        confirmations = 0
        while confirmations < 6:
            try:
                tx_info = self.rpc.gettransaction(txid)
                confirmations = tx_info['confirmations']
                
                if confirmations == 0:
                    print("📋 交易在内存池中等待确认...")
                else:
                    print(f"✅ 确认数: {confirmations}/6")
                
                if confirmations >= 6:
                    print("🎉 交易已获得足够确认，安全完成！")
                    break
                
                import time
                time.sleep(30)  # 等待30秒
                
            except Exception as e:
                print(f"查询交易状态失败: {e}")
                break

class UTXOAnalyzer:
    """UTXO分析工具"""
    
    def __init__(self, rpc_client):
        self.rpc = rpc_client
    
    def analyze_address_utxos(self, address):
        """分析指定地址的UTXO情况"""
        print(f"=== {address} 的UTXO分析 ===")
        
        try:
            # 获取地址相关的所有UTXO
            utxos = self.rpc.listunspent(0, 999999, [address])
            
            if not utxos:
                print("该地址没有UTXO")
                return
            
            # 统计分析
            total_value = sum(utxo['amount'] for utxo in utxos)
            avg_value = total_value / len(utxos)
            max_utxo = max(utxos, key=lambda x: x['amount'])
            min_utxo = min(utxos, key=lambda x: x['amount'])
            
            print(f"UTXO数量: {len(utxos)}")
            print(f"总价值: {total_value} BTC")
            print(f"平均价值: {avg_value:.8f} BTC")
            print(f"最大UTXO: {max_utxo['amount']} BTC")
            print(f"最小UTXO: {min_utxo['amount']} BTC")
            
            # 按确认数分类
            confirmed = [u for u in utxos if u['confirmations'] >= 6]
            unconfirmed = [u for u in utxos if u['confirmations'] < 6]
            
            print(f"已确认UTXO: {len(confirmed)} ({sum(u['amount'] for u in confirmed)} BTC)")
            print(f"未确认UTXO: {len(unconfirmed)} ({sum(u['amount'] for u in unconfirmed)} BTC)")
            
        except Exception as e:
            print(f"分析失败: {e}")
    
    def simulate_coin_selection(self, target_amount, utxos):
        """模拟币选择算法"""
        print(f"=== 币选择模拟：目标 {target_amount} BTC ===")
        
        # 简单策略：优先使用大额UTXO
        sorted_utxos = sorted(utxos, key=lambda x: x['amount'], reverse=True)
        
        selected = []
        total_selected = 0
        
        for utxo in sorted_utxos:
            selected.append(utxo)
            total_selected += utxo['amount']
            
            print(f"选择UTXO: {utxo['amount']} BTC")
            
            if total_selected >= target_amount:
                break
        
        if total_selected >= target_amount:
            change = total_selected - target_amount - 0.0001  # 减去预估矿工费
            print(f"✅ 选择成功")
            print(f"总输入: {total_selected} BTC")
            print(f"目标支付: {target_amount} BTC")
            print(f"找零: {change} BTC")
            print(f"预估费用: 0.0001 BTC")
        else:
            print(f"❌ 选择失败，总UTXO不足")
        
        return selected

class TransactionValidator:
    """交易验证器"""
    
    def __init__(self, rpc_client):
        self.rpc = rpc_client
    
    def validate_transaction_format(self, raw_tx_hex):
        """验证交易格式"""
        print("=== 交易格式验证 ===")
        
        try:
            # 解码交易
            decoded = self.rpc.decoderawtransaction(raw_tx_hex)
            
            print(f"✅ 交易格式正确")
            print(f"版本: {decoded['version']}")
            print(f"输入数: {len(decoded['vin'])}")
            print(f"输出数: {len(decoded['vout'])}")
            print(f"锁定时间: {decoded['locktime']}")
            
            return True, decoded
            
        except Exception as e:
            print(f"❌ 交易格式错误: {e}")
            return False, None
    
    def validate_transaction_economics(self, decoded_tx):
        """验证交易经济规则"""
        print("=== 交易经济验证 ===")
        
        try:
            input_total = 0
            output_total = 0
            
            # 计算输入总额
            for vin in decoded_tx['vin']:
                if 'coinbase' not in vin:  # 非coinbase交易
                    prev_tx = self.rpc.getrawtransaction(vin['txid'], True)
                    input_amount = prev_tx['vout'][vin['vout']]['value']
                    input_total += input_amount
            
            # 计算输出总额
            for vout in decoded_tx['vout']:
                output_total += vout['value']
            
            fee = input_total - output_total
            
            print(f"输入总额: {input_total} BTC")
            print(f"输出总额: {output_total} BTC")
            print(f"矿工费: {fee} BTC")
            
            if fee < 0:
                print("❌ 输出超过输入，交易无效")
                return False
            elif fee > input_total * 0.1:  # 矿工费超过10%
                print("⚠️  矿工费过高，请检查")
            else:
                print("✅ 经济规则验证通过")
            
            return True
            
        except Exception as e:
            print(f"❌ 经济验证失败: {e}")
            return False
    
    def full_validation(self, raw_tx_hex):
        """完整交易验证"""
        print("=== 完整交易验证 ===")
        
        # 1. 格式验证
        is_valid_format, decoded = self.validate_transaction_format(raw_tx_hex)
        if not is_valid_format:
            return False
        
        # 2. 经济验证
        is_valid_economics = self.validate_transaction_economics(decoded)
        if not is_valid_economics:
            return False
        
        # 3. 脚本验证（使用节点验证）
        try:
            test_result = self.rpc.testmempoolaccept([raw_tx_hex])
            if test_result[0]['allowed']:
                print("✅ 脚本验证通过")
                print("✅ 交易完全有效，可以广播")
                return True
            else:
                print(f"❌ 脚本验证失败: {test_result[0].get('reject-reason', '未知原因')}")
                return False
        except Exception as e:
            print(f"❌ 验证失败: {e}")
            return False

class AdvancedTransactionBuilder:
    """高级交易构造器"""
    
    def __init__(self, rpc_client):
        self.rpc = rpc_client
    
    def create_batch_transaction(self, recipients):
        """创建批量转账交易"""
        print("=== 批量转账交易 ===")
        
        try:
            # 计算总需求
            total_needed = sum(recipients.values()) + 0.001  # 加上预估矿工费
            
            # 获取足够的UTXO
            utxos = self.rpc.listunspent()
            selected_utxos = []
            selected_total = 0
            
            for utxo in sorted(utxos, key=lambda x: x['amount'], reverse=True):
                selected_utxos.append(utxo)
                selected_total += utxo['amount']
                if selected_total >= total_needed:
                    break
            
            if selected_total < total_needed:
                print(f"❌ UTXO不足: 需要 {total_needed}, 可用 {selected_total}")
                return None
            
            # 构造输入
            inputs = []
            for utxo in selected_utxos:
                inputs.append({
                    "txid": utxo['txid'],
                    "vout": utxo['vout']
                })
            
            # 构造输出
            outputs = recipients.copy()
            
            # 计算找零
            recipients_total = sum(recipients.values())
            fee = 0.001
            change = selected_total - recipients_total - fee
            
            if change > 0.00001:  # 大于粉尘限制
                change_address = self.rpc.getnewaddress("", "bech32")
                outputs[change_address] = change
                print(f"找零: {change} BTC → {change_address}")
            
            # 创建交易
            raw_tx = self.rpc.createrawtransaction(inputs, outputs)
            print(f"原始交易已创建: {raw_tx[:32]}...")
            
            return raw_tx
            
        except Exception as e:
            print(f"创建批量交易失败: {e}")
            return None
    
    def estimate_transaction_fee(self, target_confirmations=6):
        """估算交易费用"""
        print(f"=== 费用估算（目标 {target_confirmations} 个确认） ===")
        
        try:
            # 获取费用估算
            fee_rate = self.rpc.estimatesmartfee(target_confirmations)
            
            if 'feerate' in fee_rate:
                btc_per_kb = fee_rate['feerate']
                sat_per_byte = btc_per_kb * 100000000 / 1000
                
                print(f"推荐费率: {sat_per_byte:.2f} 聪/字节")
                print(f"推荐费率: {btc_per_kb:.8f} BTC/KB")
                
                # 计算不同交易大小的费用
                sizes = [250, 400, 600]  # 典型交易大小
                for size in sizes:
                    fee_btc = (size * sat_per_byte) / 100000000
                    print(f"{size}字节交易费用: {fee_btc:.8f} BTC ({size * sat_per_byte:.0f} 聪)")
                
                return sat_per_byte
            else:
                print("❌ 无法获取费用估算")
                return None
                
        except Exception as e:
            print(f"费用估算失败: {e}")
            return None

def main():
    """主程序演示"""
    print("🔗 比特币交易管理系统\n")
    
    try:
        # 初始化管理器
        tx_manager = BitcoinTransactionManager()
        validator = TransactionValidator(tx_manager.rpc)
        builder = AdvancedTransactionBuilder(tx_manager.rpc)
        analyzer = UTXOAnalyzer(tx_manager.rpc)
        
        print("可用功能:")
        print("1. 查看UTXO")
        print("2. 分析交易")
        print("3. 创建简单交易")
        print("4. 费用估算")
        print("5. UTXO分析")
        
        choice = input("\n选择功能 (1-5): ")
        
        if choice == '1':
            tx_manager.list_utxos()
        
        elif choice == '2':
            txid = input("输入交易ID: ")
            tx_manager.analyze_transaction(txid)
        
        elif choice == '3':
            to_address = input("输入接收地址: ")
            amount = float(input("输入金额 (BTC): "))
            tx_manager.create_simple_transaction(to_address, amount)
        
        elif choice == '4':
            builder.estimate_transaction_fee()
        
        elif choice == '5':
            address = input("输入要分析的地址: ")
            analyzer.analyze_address_utxos(address)
        
        else:
            print("无效选择")
    
    except Exception as e:
        print(f"程序执行错误: {e}")

if __name__ == "__main__":
    main()
