"""
RGB协议代币实现
展示基于比特币UTXO的客户端验证代币系统
"""

import time
import hashlib
from typing import Dict, List, Optional

class RGBToken:
    def __init__(self, contract_id: str, asset_name: str, total_supply: int):
        self.contract_id = contract_id
        self.asset_name = asset_name
        self.total_supply = total_supply
        self.allocations: Dict[str, Dict] = {}  # UTXO -> allocation info
        self.state_transitions: List[Dict] = []
    
    def initial_allocation(self, utxo: str, amount: int, owner: str) -> bool:
        """初始代币分配到UTXO"""
        if sum(alloc['amount'] for alloc in self.allocations.values()) + amount <= self.total_supply:
            self.allocations[utxo] = {
                'amount': amount,
                'owner': owner,
                'sealed': True,
                'created_at': time.time()
            }
            return True
        return False
    
    def transfer(self, from_utxo: str, to_utxo: str, amount: int, signature: str) -> bool:
        """转移代币到新的UTXO"""
        if from_utxo not in self.allocations:
            return False
        
        if self.allocations[from_utxo]['amount'] < amount:
            return False
        
        # 验证签名（简化版本）
        if not self._verify_signature(
            self.allocations[from_utxo]['owner'], 
            signature, 
            f"{from_utxo}{to_utxo}{amount}"
        ):
            return False
        
        # 执行转账
        self.allocations[from_utxo]['amount'] -= amount
        if self.allocations[from_utxo]['amount'] == 0:
            del self.allocations[from_utxo]
        
        if to_utxo not in self.allocations:
            self.allocations[to_utxo] = {
                'amount': 0, 
                'owner': None, 
                'sealed': True,
                'created_at': time.time()
            }
        self.allocations[to_utxo]['amount'] += amount
        
        # 记录状态转换
        transition = {
            'from_utxo': from_utxo,
            'to_utxo': to_utxo,
            'amount': amount,
            'timestamp': time.time(),
            'tx_hash': self._generate_tx_hash(from_utxo, to_utxo, amount)
        }
        self.state_transitions.append(transition)
        
        return True
    
    def get_balance(self, owner: str) -> int:
        """获取所有者的代币余额"""
        balance = 0
        for allocation in self.allocations.values():
            if allocation['owner'] == owner:
                balance += allocation['amount']
        return balance
    
    def get_allocation_history(self, utxo: str) -> List[Dict]:
        """获取UTXO的转账历史"""
        history = []
        for transition in self.state_transitions:
            if transition['from_utxo'] == utxo or transition['to_utxo'] == utxo:
                history.append(transition)
        return history
    
    def _verify_signature(self, public_key: str, signature: str, message: str) -> bool:
        """验证签名（简化实现）"""
        # 在实际实现中，这里会进行椭圆曲线签名验证
        return len(signature) > 0 and len(public_key) > 0
    
    def _generate_tx_hash(self, from_utxo: str, to_utxo: str, amount: int) -> str:
        """生成交易哈希"""
        data = f"{from_utxo}{to_utxo}{amount}{time.time()}"
        return hashlib.sha256(data.encode()).hexdigest()

class RGBNFT:
    """RGB协议NFT实现"""
    
    def __init__(self, contract_id: str, collection_name: str):
        self.contract_id = contract_id
        self.collection_name = collection_name
        self.tokens: Dict[str, Dict] = {}  # token_id -> token info
        self.metadata_store: Dict[str, Dict] = {}
    
    def mint_nft(self, token_id: str, utxo: str, owner: str, metadata: Dict) -> bool:
        """铸造NFT"""
        if token_id in self.tokens:
            return False  # NFT已存在
        
        self.tokens[token_id] = {
            'utxo': utxo,
            'owner': owner,
            'sealed': True,
            'minted_at': time.time()
        }
        
        self.metadata_store[token_id] = metadata
        return True
    
    def transfer_nft(self, token_id: str, new_utxo: str, new_owner: str, signature: str) -> bool:
        """转移NFT"""
        if token_id not in self.tokens:
            return False
        
        current_token = self.tokens[token_id]
        
        # 验证所有权和签名
        if not self._verify_signature(current_token['owner'], signature, token_id):
            return False
        
        # 转移NFT
        self.tokens[token_id] = {
            'utxo': new_utxo,
            'owner': new_owner,
            'sealed': True,
            'transferred_at': time.time(),
            'previous_utxo': current_token['utxo']
        }
        
        return True
    
    def get_token_metadata(self, token_id: str) -> Optional[Dict]:
        """获取NFT元数据"""
        return self.metadata_store.get(token_id)
    
    def get_owner_tokens(self, owner: str) -> List[str]:
        """获取所有者拥有的所有NFT"""
        return [token_id for token_id, token_info in self.tokens.items() 
                if token_info['owner'] == owner]
    
    def _verify_signature(self, public_key: str, signature: str, message: str) -> bool:
        """验证签名（简化实现）"""
        return len(signature) > 0 and len(public_key) > 0

if __name__ == "__main__":
    # RGB代币示例
    print("=== RGB代币示例 ===")
    token = RGBToken("rgb_contract_001", "MyToken", 1000000)
    
    # 初始分配
    token.initial_allocation("utxo_1", 500000, "alice_pubkey")
    token.initial_allocation("utxo_2", 300000, "bob_pubkey")
    
    print(f"Alice余额: {token.get_balance('alice_pubkey')}")
    print(f"Bob余额: {token.get_balance('bob_pubkey')}")
    
    # 转账
    if token.transfer("utxo_1", "utxo_3", 100000, "alice_signature"):
        print("转账成功")
    
    # RGB NFT示例
    print("\n=== RGB NFT示例 ===")
    nft = RGBNFT("nft_contract_001", "ArtCollection")
    
    metadata = {
        "name": "Digital Art #1",
        "description": "First piece in the collection",
        "image": "ipfs://hash123",
        "attributes": [
            {"trait_type": "Color", "value": "Blue"},
            {"trait_type": "Rarity", "value": "Rare"}
        ]
    }
    
    if nft.mint_nft("token_001", "utxo_nft_1", "artist_pubkey", metadata):
        print("NFT铸造成功")
    
    print(f"艺术家拥有的NFT: {nft.get_owner_tokens('artist_pubkey')}")