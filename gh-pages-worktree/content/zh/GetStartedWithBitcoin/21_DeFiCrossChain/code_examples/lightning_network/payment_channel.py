"""
Lightning Network支付通道实现
展示了支付通道的基本原理和状态管理
"""

import time
import hashlib

class PaymentChannel:
    def __init__(self, party_a, party_b, initial_balance_a, initial_balance_b):
        self.party_a = party_a
        self.party_b = party_b
        self.balance_a = initial_balance_a
        self.balance_b = initial_balance_b
        self.channel_id = self.generate_channel_id()
        self.state = "open"
        self.commitment_transactions = []
    
    def generate_channel_id(self):
        """生成唯一的通道ID"""
        data = f"{self.party_a}{self.party_b}{time.time()}"
        return hashlib.sha256(data.encode()).hexdigest()[:16]
    
    def update_balance(self, from_party, to_party, amount):
        """更新通道余额"""
        if from_party == self.party_a and self.balance_a >= amount:
            self.balance_a -= amount
            self.balance_b += amount
            return True
        elif from_party == self.party_b and self.balance_b >= amount:
            self.balance_b -= amount
            self.balance_a += amount
            return True
        return False
    
    def generate_commitment_transaction(self):
        """生成承诺交易"""
        commitment_tx = {
            'channel_id': self.channel_id,
            'balance_a': self.balance_a,
            'balance_b': self.balance_b,
            'sequence_number': len(self.commitment_transactions),
            'timestamp': time.time()
        }
        self.commitment_transactions.append(commitment_tx)
        return commitment_tx
    
    def close_channel(self):
        """关闭支付通道"""
        self.state = "closed"
        final_tx = self.generate_commitment_transaction()
        return final_tx

if __name__ == "__main__":
    # 示例使用
    channel = PaymentChannel("Alice", "Bob", 1000000, 500000)  # satoshis
    print(f"通道ID: {channel.channel_id}")
    print(f"初始余额 - Alice: {channel.balance_a}, Bob: {channel.balance_b}")
    
    # Alice向Bob转账
    if channel.update_balance("Alice", "Bob", 100000):
        print("转账成功")
        commitment = channel.generate_commitment_transaction()
        print(f"新余额 - Alice: {channel.balance_a}, Bob: {channel.balance_b}")