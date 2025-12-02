#!/usr/bin/env python3
"""
比特币DeFi与跨链技术实践示例

本文件演示：
1. Lightning Network支付通道模拟
2. RGB协议代币发行和转账
3. 原子交换机制实现
4. 跨链桥接协议
5. DeFi收益策略计算
6. 风险管理工具

注意：这些是教学示例，实际生产环境需要完整的安全审计和测试
"""

import hashlib
import secrets
import time
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import heapq
from collections import defaultdict


class LightningChannel:
    """Lightning Network 支付通道实现"""
    
    def __init__(self, party_a: str, party_b: str, capacity_a: int, capacity_b: int):
        self.party_a = party_a
        self.party_b = party_b
        self.balance_a = capacity_a
        self.balance_b = capacity_b
        self.total_capacity = capacity_a + capacity_b
        self.channel_id = self._generate_channel_id()
        self.state = "open"
        self.commitment_txs = []
        self.htlcs = []  # Hash Time Locked Contracts
        
    def _generate_channel_id(self) -> str:
        """生成通道ID"""
        data = f"{self.party_a}{self.party_b}{time.time()}"
        return hashlib.sha256(data.encode()).hexdigest()[:16]
    
    def send_payment(self, sender: str, receiver: str, amount: int) -> bool:
        """发送支付"""
        if self.state != "open":
            print(f"通道状态错误: {self.state}")
            return False
            
        # 检查发送者余额
        if sender == self.party_a and self.balance_a >= amount:
            self.balance_a -= amount
            self.balance_b += amount
            self._create_commitment_transaction()
            print(f"支付成功: {sender} -> {receiver}, 金额: {amount} sats")
            return True
        elif sender == self.party_b and self.balance_b >= amount:
            self.balance_b -= amount
            self.balance_a += amount
            self._create_commitment_transaction()
            print(f"支付成功: {sender} -> {receiver}, 金额: {amount} sats")
            return True
        else:
            print(f"余额不足: {sender} 尝试发送 {amount} sats")
            return False
    
    def _create_commitment_transaction(self) -> dict:
        """创建承诺交易"""
        commitment_tx = {
            'channel_id': self.channel_id,
            'sequence': len(self.commitment_txs),
            'balance_a': self.balance_a,
            'balance_b': self.balance_b,
            'timestamp': time.time()
        }
        self.commitment_txs.append(commitment_tx)
        return commitment_tx
    
    def close_channel(self) -> dict:
        """关闭通道"""
        if self.state != "open":
            return None
            
        self.state = "closed"
        settlement = {
            'channel_id': self.channel_id,
            'final_balance_a': self.balance_a,
            'final_balance_b': self.balance_b,
            'close_time': time.time()
        }
        
        print(f"通道关闭: {self.party_a}={self.balance_a} sats, {self.party_b}={self.balance_b} sats")
        return settlement


class LightningNetwork:
    """Lightning Network 路由网络"""
    
    def __init__(self):
        self.channels: Dict[str, LightningChannel] = {}
        self.nodes: set = set()
        self.channel_graph = defaultdict(list)
    
    def add_channel(self, channel: LightningChannel):
        """添加支付通道到网络"""
        self.channels[channel.channel_id] = channel
        self.nodes.add(channel.party_a)
        self.nodes.add(channel.party_b)
        
        # 构建路由图
        capacity_a_to_b = channel.balance_a
        capacity_b_to_a = channel.balance_b
        
        self.channel_graph[channel.party_a].append({
            'peer': channel.party_b,
            'channel_id': channel.channel_id,
            'capacity': capacity_a_to_b,
            'fee_rate': 0.001  # 0.1% 手续费
        })
        
        self.channel_graph[channel.party_b].append({
            'peer': channel.party_a,
            'channel_id': channel.channel_id,
            'capacity': capacity_b_to_a,
            'fee_rate': 0.001
        })
    
    def find_route(self, source: str, destination: str, amount: int) -> Optional[List[str]]:
        """使用Dijkstra算法寻找支付路由"""
        if source not in self.nodes or destination not in self.nodes:
            return None
            
        # Dijkstra算法
        distances = {node: float('inf') for node in self.nodes}
        distances[source] = 0
        previous = {}
        visited = set()
        
        pq = [(0, source)]
        
        while pq:
            current_distance, current_node = heapq.heappop(pq)
            
            if current_node in visited:
                continue
                
            visited.add(current_node)
            
            if current_node == destination:
                # 构建路径
                path = []
                while current_node in previous:
                    path.append(current_node)
                    current_node = previous[current_node]
                path.append(source)
                return path[::-1]
            
            # 检查相邻节点
            for edge in self.channel_graph[current_node]:
                neighbor = edge['peer']
                
                if neighbor in visited or edge['capacity'] < amount:
                    continue
                
                fee = amount * edge['fee_rate']
                distance = current_distance + fee
                
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    previous[neighbor] = current_node
                    heapq.heappush(pq, (distance, neighbor))
        
        return None
    
    def send_payment(self, source: str, destination: str, amount: int) -> bool:
        """通过网络发送支付"""
        route = self.find_route(source, destination, amount)
        
        if not route:
            print(f"找不到从 {source} 到 {destination} 的路由")
            return False
        
        print(f"找到路由: {' -> '.join(route)}")
        
        # 沿着路由执行支付
        for i in range(len(route) - 1):
            sender = route[i]
            receiver = route[i + 1]
            
            # 找到对应的通道
            channel = self._find_channel_between(sender, receiver)
            if not channel:
                print(f"找不到 {sender} 和 {receiver} 之间的通道")
                return False
            
            if not channel.send_payment(sender, receiver, amount):
                print(f"支付失败: {sender} -> {receiver}")
                return False
        
        print(f"支付成功: {source} -> {destination}, 金额: {amount} sats")
        return True
    
    def _find_channel_between(self, node_a: str, node_b: str) -> Optional[LightningChannel]:
        """查找两个节点之间的通道"""
        for channel in self.channels.values():
            if ((channel.party_a == node_a and channel.party_b == node_b) or
                (channel.party_a == node_b and channel.party_b == node_a)):
                return channel
        return None


class RGBToken:
    """RGB协议代币合约"""
    
    def __init__(self, contract_id: str, name: str, symbol: str, total_supply: int):
        self.contract_id = contract_id
        self.name = name
        self.symbol = symbol
        self.total_supply = total_supply
        self.allocations: Dict[str, dict] = {}  # UTXO -> {amount, owner}
        self.state_transitions: List[dict] = []
    
    def initial_allocation(self, utxo: str, amount: int, owner: str) -> bool:
        """初始代币分配"""
        allocated = sum(alloc['amount'] for alloc in self.allocations.values())
        
        if allocated + amount > self.total_supply:
            print(f"分配超出总供应量: {allocated + amount} > {self.total_supply}")
            return False
        
        self.allocations[utxo] = {
            'amount': amount,
            'owner': owner,
            'sealed': True
        }
        
        transition = {
            'type': 'genesis',
            'to_utxo': utxo,
            'amount': amount,
            'owner': owner,
            'timestamp': time.time()
        }
        self.state_transitions.append(transition)
        
        print(f"初始分配成功: {amount} {self.symbol} -> {owner}")
        return True
    
    def transfer(self, from_utxo: str, to_utxo: str, amount: int, new_owner: str) -> bool:
        """代币转账"""
        if from_utxo not in self.allocations:
            print(f"UTXO不存在: {from_utxo}")
            return False
        
        from_allocation = self.allocations[from_utxo]
        
        if from_allocation['amount'] < amount:
            print(f"余额不足: {from_allocation['amount']} < {amount}")
            return False
        
        # 执行转账
        from_allocation['amount'] -= amount
        
        if from_allocation['amount'] == 0:
            del self.allocations[from_utxo]
        
        # 创建新分配
        if to_utxo not in self.allocations:
            self.allocations[to_utxo] = {'amount': 0, 'owner': new_owner, 'sealed': True}
        
        self.allocations[to_utxo]['amount'] += amount
        self.allocations[to_utxo]['owner'] = new_owner
        
        # 记录状态转换
        transition = {
            'type': 'transfer',
            'from_utxo': from_utxo,
            'to_utxo': to_utxo,
            'amount': amount,
            'new_owner': new_owner,
            'timestamp': time.time()
        }
        self.state_transitions.append(transition)
        
        print(f"转账成功: {amount} {self.symbol} -> {new_owner}")
        return True
    
    def get_balance(self, owner: str) -> int:
        """查询余额"""
        balance = 0
        for allocation in self.allocations.values():
            if allocation['owner'] == owner:
                balance += allocation['amount']
        return balance


class AtomicSwap:
    """原子交换实现"""
    
    def __init__(self, initiator: str, participant: str):
        self.initiator = initiator
        self.participant = participant
        self.secret = None
        self.secret_hash = None
        self.state = "initialized"
        self.contracts = {}
        self.timeouts = {}
    
    def initiate_swap(self, initiator_amount: int, participant_amount: int, 
                     timeout_hours: int = 24) -> dict:
        """发起原子交换"""
        # 生成秘密和哈希
        self.secret = secrets.token_hex(32)
        self.secret_hash = hashlib.sha256(self.secret.encode()).hexdigest()
        
        # 设置超时时间
        initiator_timeout = datetime.now() + timedelta(hours=timeout_hours)
        participant_timeout = datetime.now() + timedelta(hours=timeout_hours//2)
        
        self.timeouts['initiator'] = initiator_timeout
        self.timeouts['participant'] = participant_timeout
        
        # 创建发起者合约
        self.contracts['initiator'] = {
            'sender': self.initiator,
            'recipient': self.participant,
            'amount': initiator_amount,
            'secret_hash': self.secret_hash,
            'timeout': initiator_timeout,
            'redeemed': False,
            'refunded': False
        }
        
        self.state = "initiated"
        
        print(f"原子交换发起: {self.initiator} -> {initiator_amount} 单位")
        print(f"秘密哈希: {self.secret_hash}")
        
        return {
            'secret_hash': self.secret_hash,
            'participant_timeout': participant_timeout,
            'contract': self.contracts['initiator']
        }
    
    def participate_swap(self, participant_amount: int) -> bool:
        """参与原子交换"""
        if self.state != "initiated":
            print(f"交换状态错误: {self.state}")
            return False
        
        # 创建参与者合约
        self.contracts['participant'] = {
            'sender': self.participant,
            'recipient': self.initiator,
            'amount': participant_amount,
            'secret_hash': self.secret_hash,
            'timeout': self.timeouts['participant'],
            'redeemed': False,
            'refunded': False
        }
        
        self.state = "participated"
        
        print(f"原子交换参与: {self.participant} -> {participant_amount} 单位")
        return True
    
    def reveal_secret(self) -> str:
        """发起者揭示秘密"""
        if self.state != "participated":
            print(f"交换状态错误: {self.state}")
            return None
        
        print(f"秘密揭示: {self.secret}")
        return self.secret
    
    def redeem_with_secret(self, contract_type: str, secret: str) -> bool:
        """使用秘密赎回资金"""
        if contract_type not in self.contracts:
            print(f"合约不存在: {contract_type}")
            return False
        
        contract = self.contracts[contract_type]
        
        # 验证秘密
        calculated_hash = hashlib.sha256(secret.encode()).hexdigest()
        if calculated_hash != self.secret_hash:
            print("秘密验证失败")
            return False
        
        # 检查超时
        if datetime.now() > contract['timeout']:
            print("合约已超时")
            return False
        
        contract['redeemed'] = True
        
        if contract_type == "initiator":
            print(f"参与者赎回: {contract['amount']} 单位")
            self.state = "participant_redeemed"
        else:
            print(f"发起者赎回: {contract['amount']} 单位")
            self.state = "completed"
        
        return True
    
    def check_refund_eligibility(self) -> dict:
        """检查退款资格"""
        result = {}
        current_time = datetime.now()
        
        for contract_type, contract in self.contracts.items():
            if (current_time > contract['timeout'] and 
                not contract['redeemed'] and 
                not contract['refunded']):
                result[contract_type] = True
            else:
                result[contract_type] = False
        
        return result


class CrossChainBridge:
    """跨链桥接协议"""
    
    def __init__(self, bitcoin_rpc, alt_chain_rpc):
        self.bitcoin_rpc = bitcoin_rpc
        self.alt_chain_rpc = alt_chain_rpc
        self.bridge_address = "bc1qbridge_multisig_address"
        self.wrapped_token_contract = "0xWrappedBTCContract"
        self.pending_transfers = {}
        self.completed_transfers = {}
        self.validators = ["validator1", "validator2", "validator3"]
        self.required_confirmations = 6
    
    def lock_bitcoin(self, user_address: str, amount: int, destination_address: str) -> str:
        """锁定比特币资金"""
        transfer_id = f"bridge_{int(time.time())}_{secrets.token_hex(4)}"
        
        # 创建锁定交易（模拟）
        lock_tx = {
            'from': user_address,
            'to': self.bridge_address,
            'amount': amount,
            'timestamp': time.time(),
            'confirmations': 0
        }
        
        transfer_data = {
            'transfer_id': transfer_id,
            'user_address': user_address,
            'amount': amount,
            'destination_address': destination_address,
            'lock_tx': lock_tx,
            'status': 'locked',
            'validators_signed': 0,
            'required_validators': len(self.validators) * 2 // 3 + 1  # 2/3 + 1
        }
        
        self.pending_transfers[transfer_id] = transfer_data
        
        print(f"比特币锁定: {amount} BTC 来自 {user_address}")
        print(f"转账ID: {transfer_id}")
        
        return transfer_id
    
    def validate_bitcoin_lock(self, transfer_id: str, validator: str) -> bool:
        """验证器确认比特币锁定"""
        if transfer_id not in self.pending_transfers:
            return False
        
        transfer = self.pending_transfers[transfer_id]
        
        # 检查比特币确认数（模拟）
        transfer['lock_tx']['confirmations'] += 1
        
        if transfer['lock_tx']['confirmations'] >= self.required_confirmations:
            transfer['validators_signed'] += 1
            print(f"验证器 {validator} 确认锁定")
            
            # 检查是否达到所需签名数
            if transfer['validators_signed'] >= transfer['required_validators']:
                return self._mint_wrapped_btc(transfer)
        
        return False
    
    def _mint_wrapped_btc(self, transfer: dict) -> bool:
        """铸造包装比特币"""
        # 在目标链上铸造代币（模拟）
        mint_tx = {
            'to': transfer['destination_address'],
            'amount': transfer['amount'],
            'contract': self.wrapped_token_contract,
            'timestamp': time.time()
        }
        
        transfer['mint_tx'] = mint_tx
        transfer['status'] = 'completed'
        
        # 移到完成列表
        self.completed_transfers[transfer['transfer_id']] = transfer
        del self.pending_transfers[transfer['transfer_id']]
        
        print(f"包装BTC铸造成功: {transfer['amount']} WBTC -> {transfer['destination_address']}")
        return True
    
    def burn_and_release(self, user_address: str, amount: int, btc_address: str) -> str:
        """销毁包装代币并释放BTC"""
        # 销毁包装代币（模拟）
        burn_tx = {
            'from': user_address,
            'amount': amount,
            'contract': self.wrapped_token_contract,
            'timestamp': time.time()
        }
        
        # 创建释放交易
        release_tx = {
            'from': self.bridge_address,
            'to': btc_address,
            'amount': amount,
            'timestamp': time.time()
        }
        
        release_id = f"release_{int(time.time())}_{secrets.token_hex(4)}"
        
        print(f"WBTC销毁: {amount} WBTC 来自 {user_address}")
        print(f"BTC释放: {amount} BTC -> {btc_address}")
        print(f"释放ID: {release_id}")
        
        return release_id


class DeFiYieldCalculator:
    """DeFi收益计算器"""
    
    def __init__(self):
        self.protocols = {
            'lightning_routing': {
                'base_yield': 0.03,  # 3% 年化
                'risk_level': 'low',
                'liquidity_requirement': 'high'
            },
            'lending': {
                'base_yield': 0.05,  # 5% 年化
                'risk_level': 'low',
                'liquidity_requirement': 'medium'
            },
            'liquidity_providing': {
                'base_yield': 0.12,  # 12% 年化
                'risk_level': 'high',
                'liquidity_requirement': 'high'
            },
            'yield_farming': {
                'base_yield': 0.20,  # 20% 年化
                'risk_level': 'very_high',
                'liquidity_requirement': 'medium'
            }
        }
    
    def calculate_optimal_allocation(self, total_amount: int, risk_tolerance: str) -> dict:
        """计算最优资金分配"""
        strategies = {
            'conservative': [
                ('lending', 0.7),
                ('lightning_routing', 0.3)
            ],
            'balanced': [
                ('lending', 0.4),
                ('liquidity_providing', 0.4),
                ('lightning_routing', 0.2)
            ],
            'aggressive': [
                ('liquidity_providing', 0.5),
                ('yield_farming', 0.3),
                ('lending', 0.2)
            ]
        }
        
        if risk_tolerance not in strategies:
            risk_tolerance = 'balanced'
        
        allocation = strategies[risk_tolerance]
        result = {
            'total_amount': total_amount,
            'risk_profile': risk_tolerance,
            'allocations': [],
            'expected_annual_yield': 0,
            'risk_score': 0
        }
        
        for protocol, percentage in allocation:
            amount = int(total_amount * percentage)
            protocol_info = self.protocols[protocol]
            
            allocation_info = {
                'protocol': protocol,
                'amount': amount,
                'percentage': percentage,
                'expected_yield': protocol_info['base_yield'],
                'risk_level': protocol_info['risk_level']
            }
            
            result['allocations'].append(allocation_info)
            result['expected_annual_yield'] += protocol_info['base_yield'] * percentage
        
        # 计算风险分数
        risk_weights = {'low': 1, 'medium': 2, 'high': 3, 'very_high': 4}
        for allocation_info in result['allocations']:
            risk_weight = risk_weights.get(allocation_info['risk_level'], 2)
            result['risk_score'] += risk_weight * allocation_info['percentage']
        
        return result
    
    def simulate_yield_over_time(self, allocation: dict, days: int) -> List[dict]:
        """模拟时间序列收益"""
        daily_yields = []
        cumulative_value = allocation['total_amount']
        
        for day in range(1, days + 1):
            daily_yield = 0
            daily_breakdown = []
            
            for alloc in allocation['allocations']:
                # 添加随机波动（模拟市场变化）
                volatility = {'low': 0.01, 'medium': 0.05, 'high': 0.1, 'very_high': 0.2}
                vol = volatility.get(alloc['risk_level'], 0.05)
                
                daily_rate = alloc['expected_yield'] / 365
                random_factor = 1 + (secrets.randbelow(200) - 100) / 10000 * vol
                
                actual_daily_rate = daily_rate * random_factor
                daily_protocol_yield = alloc['amount'] * actual_daily_rate
                
                daily_breakdown.append({
                    'protocol': alloc['protocol'],
                    'yield': daily_protocol_yield,
                    'rate': actual_daily_rate
                })
                
                daily_yield += daily_protocol_yield
                alloc['amount'] += daily_protocol_yield
            
            cumulative_value += daily_yield
            
            daily_yields.append({
                'day': day,
                'daily_yield': daily_yield,
                'cumulative_value': cumulative_value,
                'breakdown': daily_breakdown
            })
        
        return daily_yields


def demonstrate_lightning_network():
    """演示Lightning Network功能"""
    print("=" * 60)
    print("Lightning Network 演示")
    print("=" * 60)
    
    # 创建Lightning网络
    ln = LightningNetwork()
    
    # 创建支付通道
    channel1 = LightningChannel("Alice", "Bob", 500000, 300000)  # Alice: 500k sats, Bob: 300k sats
    channel2 = LightningChannel("Bob", "Charlie", 400000, 200000)
    channel3 = LightningChannel("Charlie", "Dave", 300000, 400000)
    
    # 添加到网络
    ln.add_channel(channel1)
    ln.add_channel(channel2)
    ln.add_channel(channel3)
    
    print("网络拓扑创建完成")
    print(f"节点: {', '.join(ln.nodes)}")
    
    # 直接支付
    print("\n1. 直接通道支付:")
    channel1.send_payment("Alice", "Bob", 50000)
    
    # 路由支付
    print("\n2. 路由支付:")
    ln.send_payment("Alice", "Dave", 100000)
    
    print("\n通道状态:")
    for channel_id, channel in ln.channels.items():
        print(f"  {channel.party_a}: {channel.balance_a} sats")
        print(f"  {channel.party_b}: {channel.balance_b} sats")
        print()


def demonstrate_rgb_protocol():
    """演示RGB协议功能"""
    print("=" * 60)
    print("RGB协议代币演示")
    print("=" * 60)
    
    # 创建RGB代币合约
    token = RGBToken("rgb_001", "MyToken", "MTK", 1000000)
    
    # 初始分配
    print("1. 初始代币分配:")
    token.initial_allocation("utxo_1", 500000, "Alice")
    token.initial_allocation("utxo_2", 300000, "Bob")
    token.initial_allocation("utxo_3", 200000, "Charlie")
    
    # 查询余额
    print("\n2. 余额查询:")
    print(f"Alice: {token.get_balance('Alice')} MTK")
    print(f"Bob: {token.get_balance('Bob')} MTK")
    print(f"Charlie: {token.get_balance('Charlie')} MTK")
    
    # 代币转账
    print("\n3. 代币转账:")
    token.transfer("utxo_1", "utxo_4", 100000, "Dave")
    
    # 更新后的余额
    print("\n4. 转账后余额:")
    print(f"Alice: {token.get_balance('Alice')} MTK")
    print(f"Dave: {token.get_balance('Dave')} MTK")


def demonstrate_atomic_swap():
    """演示原子交换功能"""
    print("=" * 60)
    print("原子交换演示")
    print("=" * 60)
    
    # 创建原子交换
    swap = AtomicSwap("Alice", "Bob")
    
    # Alice发起交换：用1 BTC换10000 USDT
    print("1. Alice发起交换:")
    swap_info = swap.initiate_swap(100000000, 1000000, 24)  # 1 BTC = 100M sats
    
    # Bob参与交换
    print("\n2. Bob参与交换:")
    swap.participate_swap(1000000)  # 1M USDT cents
    
    # Alice揭示秘密
    print("\n3. Alice揭示秘密:")
    secret = swap.reveal_secret()
    
    # Bob使用秘密赎回Alice的BTC
    print("\n4. Bob赎回BTC:")
    swap.redeem_with_secret("initiator", secret)
    
    # Alice使用相同秘密赎回Bob的USDT
    print("\n5. Alice赎回USDT:")
    swap.redeem_with_secret("participant", secret)
    
    print(f"\n交换完成，最终状态: {swap.state}")


def demonstrate_cross_chain_bridge():
    """演示跨链桥接功能"""
    print("=" * 60)
    print("跨链桥接演示")
    print("=" * 60)
    
    # 模拟的RPC接口
    class MockRPC:
        pass
    
    # 创建跨链桥
    bridge = CrossChainBridge(MockRPC(), MockRPC())
    
    # 用户锁定比特币
    print("1. 用户锁定比特币:")
    transfer_id = bridge.lock_bitcoin(
        "bc1quser_address", 
        50000000,  # 0.5 BTC
        "0xuser_eth_address"
    )
    
    # 验证器确认
    print("\n2. 验证器确认:")
    for i, validator in enumerate(bridge.validators[:2]):  # 需要2个验证器
        bridge.validate_bitcoin_lock(transfer_id, validator)
        print(f"验证器 {i+1} 已确认")
    
    # 反向操作：销毁WBTC并释放BTC
    print("\n3. 反向操作:")
    bridge.burn_and_release(
        "0xuser_eth_address",
        25000000,  # 0.25 BTC
        "bc1quser_new_address"
    )


def demonstrate_defi_yield_strategy():
    """演示DeFi收益策略"""
    print("=" * 60)
    print("DeFi收益策略演示")
    print("=" * 60)
    
    calculator = DeFiYieldCalculator()
    
    # 计算不同风险等级的分配策略
    total_investment = 1000000  # 0.01 BTC (1M sats)
    
    for risk_level in ['conservative', 'balanced', 'aggressive']:
        print(f"\n{risk_level.upper()} 策略:")
        allocation = calculator.calculate_optimal_allocation(total_investment, risk_level)
        
        print(f"总投资: {allocation['total_amount']:,} sats")
        print(f"预期年化收益: {allocation['expected_annual_yield']:.2%}")
        print(f"风险分数: {allocation['risk_score']:.2f}")
        print("资金分配:")
        
        for alloc in allocation['allocations']:
            print(f"  {alloc['protocol']}: {alloc['amount']:,} sats "
                  f"({alloc['percentage']:.0%}) - 预期收益: {alloc['expected_yield']:.2%}")
    
    # 模拟30天收益
    print("\n30天收益模拟 (平衡策略):")
    allocation = calculator.calculate_optimal_allocation(total_investment, 'balanced')
    yields = calculator.simulate_yield_over_time(allocation, 30)
    
    for i in [0, 6, 13, 20, 29]:  # 显示第1,7,14,21,30天
        day_data = yields[i]
        print(f"第{day_data['day']:2d}天: 日收益 {day_data['daily_yield']:6.0f} sats, "
              f"累计价值 {day_data['cumulative_value']:7.0f} sats")


def main():
    """主演示函数"""
    print("比特币DeFi与跨链技术实践演示")
    print("本程序展示了比特币生态系统中的主要DeFi组件")
    
    demonstrate_lightning_network()
    print()
    
    demonstrate_rgb_protocol()
    print()
    
    demonstrate_atomic_swap()
    print()
    
    demonstrate_cross_chain_bridge()
    print()
    
    demonstrate_defi_yield_strategy()
    
    print("\n" + "=" * 60)
    print("演示完成！")
    print("注意: 这些是教学示例，实际生产环境需要完整的安全审计")
    print("=" * 60)


if __name__ == "__main__":
    main()