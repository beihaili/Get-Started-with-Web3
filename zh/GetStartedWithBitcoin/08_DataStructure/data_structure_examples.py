#!/usr/bin/env python3
"""
第08讲：区块链数据结构 - 完整代码示例
比特币数据结构的Python实现，包括区块链、默克尔树、SPV等核心组件
"""

import hashlib
import json
import time
from typing import List, Optional, Dict, Tuple


def double_sha256(data: bytes) -> bytes:
    """比特币使用的双重SHA256哈希"""
    return hashlib.sha256(hashlib.sha256(data).digest()).digest()


class HashPointer:
    """哈希指针：存储数据位置和内容哈希的结构"""
    
    def __init__(self, data: str, address: str = None):
        self.address = address or f"addr_{id(self)}"
        self.hash = self.calculate_hash(data)
        
    def calculate_hash(self, data: str) -> str:
        """计算数据的SHA256哈希"""
        return hashlib.sha256(data.encode()).hexdigest()
        
    def verify_data(self, data: str) -> bool:
        """验证数据是否被篡改"""
        return self.hash == self.calculate_hash(data)


class Block:
    """比特币区块的简化实现"""
    
    def __init__(self, transactions: List[str], prev_hash: str, timestamp: int = None):
        self.version = 1
        self.prev_hash = prev_hash
        self.timestamp = timestamp or int(time.time())
        self.transactions = transactions
        self.merkle_root = self.calculate_merkle_root()
        self.nonce = 0
        self.hash = self.calculate_hash()
        
    def calculate_merkle_root(self) -> str:
        """计算区块中所有交易的默克尔根"""
        if not self.transactions:
            return "0" * 64
        
        # 构建默克尔树并返回根哈希
        merkle_tree = MerkleTree(self.transactions)
        return merkle_tree.root.hash if merkle_tree.root else "0" * 64
        
    def calculate_hash(self) -> str:
        """计算区块头的哈希值"""
        block_header = {
            "version": self.version,
            "prev_hash": self.prev_hash,
            "merkle_root": self.merkle_root,
            "timestamp": self.timestamp,
            "nonce": self.nonce
        }
        header_string = json.dumps(block_header, sort_keys=True)
        return hashlib.sha256(header_string.encode()).hexdigest()


class Blockchain:
    """区块链的简化实现"""
    
    def __init__(self):
        """初始化区块链，创建创世区块"""
        self.genesis = Block(["Genesis Transaction"], "0" * 64)
        self.blocks = {self.genesis.hash: self.genesis}
        self.head = self.genesis
        self.height = 0
        
    def add_block(self, transactions: List[str]) -> Block:
        """添加新区块到区块链"""
        new_block = Block(transactions, self.head.hash)
        self.blocks[new_block.hash] = new_block
        self.head = new_block
        self.height += 1
        return new_block
        
    def get_block(self, block_hash: str) -> Optional[Block]:
        """根据哈希获取区块"""
        return self.blocks.get(block_hash)
        
    def verify_chain(self) -> bool:
        """验证整条区块链的完整性"""
        current = self.head
        
        # 从头部区块开始向后验证
        while current.prev_hash != "0" * 64:  # 直到创世区块
            # 获取前一个区块
            previous = self.get_block(current.prev_hash)
            if not previous:
                print(f"找不到前置区块: {current.prev_hash}")
                return False
                
            # 验证哈希链接
            if current.prev_hash != previous.hash:
                print(f"哈希链接验证失败: {current.prev_hash} != {previous.hash}")
                return False
                
            # 验证当前区块的哈希
            if current.hash != current.calculate_hash():
                print(f"区块哈希验证失败: {current.hash}")
                return False
                
            current = previous
            
        return True
        
    def get_chain_info(self) -> Dict:
        """获取区块链信息"""
        return {
            "height": self.height,
            "head_hash": self.head.hash,
            "total_blocks": len(self.blocks),
            "genesis_hash": self.genesis.hash
        }


class MerkleNode:
    """默克尔树节点"""
    
    def __init__(self, data: str = None, left=None, right=None):
        self.data = data
        self.left = left
        self.right = right
        self.hash = self.calculate_hash()
        
    def calculate_hash(self) -> str:
        """计算节点哈希"""
        if self.data:  # 叶子节点
            return hashlib.sha256(self.data.encode()).hexdigest()
        else:  # 内部节点
            left_hash = self.left.hash if self.left else ""
            right_hash = self.right.hash if self.right else ""
            combined = left_hash + right_hash
            return hashlib.sha256(combined.encode()).hexdigest()
            
    def is_leaf(self) -> bool:
        """判断是否为叶子节点"""
        return self.data is not None


class MerkleTree:
    """默克尔树实现"""
    
    def __init__(self, transactions: List[str]):
        """构建默克尔树"""
        if not transactions:
            self.root = None
            self.leaves = []
            return
            
        # 创建叶子节点
        self.leaves = [MerkleNode(tx) for tx in transactions]
        # 构建树
        self.root = self.build_tree(self.leaves[:])  # 复制列表避免修改原始数据
        
    def build_tree(self, nodes: List[MerkleNode]) -> MerkleNode:
        """递归构建默克尔树"""
        if len(nodes) == 1:
            return nodes[0]
            
        # 如果节点数为奇数，复制最后一个节点
        if len(nodes) % 2 == 1:
            nodes.append(nodes[-1])
            
        # 创建下一层节点
        next_level = []
        for i in range(0, len(nodes), 2):
            left = nodes[i]
            right = nodes[i + 1]
            parent = MerkleNode(left=left, right=right)
            next_level.append(parent)
            
        return self.build_tree(next_level)
        
    def generate_proof(self, tx_index: int) -> List[Dict]:
        """为指定交易生成默克尔证明路径"""
        if tx_index >= len(self.leaves):
            return []
            
        proof = []
        current_nodes = self.leaves[:]
        current_index = tx_index
        
        # 自底向上构建证明路径
        while len(current_nodes) > 1:
            # 如果节点数为奇数，复制最后一个节点
            if len(current_nodes) % 2 == 1:
                current_nodes.append(current_nodes[-1])
                
            # 找到兄弟节点
            sibling_index = current_index + 1 if current_index % 2 == 0 else current_index - 1
            sibling_hash = current_nodes[sibling_index].hash
            is_left = current_index % 2 == 0
            
            proof.append({
                "hash": sibling_hash,
                "is_left": is_left
            })
            
            # 准备下一层
            next_level = []
            for i in range(0, len(current_nodes), 2):
                left = current_nodes[i]
                right = current_nodes[i + 1]
                parent = MerkleNode(left=left, right=right)
                next_level.append(parent)
                
            current_nodes = next_level
            current_index = current_index // 2
            
        return proof
        
    def verify_proof(self, tx_hash: str, proof: List[Dict], root_hash: str) -> bool:
        """验证默克尔证明"""
        current_hash = hashlib.sha256(tx_hash.encode()).hexdigest()
        
        for step in proof:
            sibling_hash = step["hash"]
            is_left = step["is_left"]
            
            if is_left:
                combined = current_hash + sibling_hash
            else:
                combined = sibling_hash + current_hash
                
            current_hash = hashlib.sha256(combined.encode()).hexdigest()
            
        return current_hash == root_hash


class SPVNode:
    """SPV（简化支付验证）节点"""
    
    def __init__(self):
        """初始化SPV节点"""
        self.block_headers = {}  # 存储区块头
        self.merkle_proofs = {}  # 存储默克尔证明
        
    def add_block_header(self, block_hash: str, prev_hash: str, merkle_root: str, 
                        timestamp: int, height: int):
        """添加区块头信息"""
        self.block_headers[block_hash] = {
            "prev_hash": prev_hash,
            "merkle_root": merkle_root,
            "timestamp": timestamp,
            "height": height
        }
        
    def verify_transaction_inclusion(self, tx_hash: str, block_hash: str, 
                                   merkle_proof: List[Dict]) -> bool:
        """验证交易是否包含在指定区块中"""
        if block_hash not in self.block_headers:
            return False
            
        block_header = self.block_headers[block_hash]
        merkle_root = block_header["merkle_root"]
        
        # 使用默克尔证明验证交易
        merkle_tree = MerkleTree([])  # 创建空树用于验证
        return merkle_tree.verify_proof(tx_hash, merkle_proof, merkle_root)
        
    def get_block_chain_info(self) -> Dict:
        """获取轻节点的区块链信息"""
        if not self.block_headers:
            return {"height": 0, "blocks": 0}
            
        max_height = max(header["height"] for header in self.block_headers.values())
        return {
            "height": max_height,
            "blocks": len(self.block_headers),
            "storage": "headers_only"  # 只存储区块头
        }


def demonstrate_hash_pointer():
    """演示哈希指针的使用"""
    print("=== 哈希指针演示 ===")
    
    # 创建哈希指针
    original_data = "这是重要的交易数据"
    hash_ptr = HashPointer(original_data)
    
    print(f"原始数据: {original_data}")
    print(f"数据哈希: {hash_ptr.hash}")
    print(f"验证原始数据: {hash_ptr.verify_data(original_data)}")
    
    # 尝试篡改数据
    tampered_data = "这是被篡改的交易数据"
    print(f"验证篡改数据: {hash_ptr.verify_data(tampered_data)}")
    print()


def demonstrate_blockchain():
    """演示区块链的基本操作"""
    print("=== 区块链演示 ===")
    
    # 创建区块链
    blockchain = Blockchain()
    print(f"创世区块哈希: {blockchain.genesis.hash}")
    
    # 添加几个区块
    blockchain.add_block(["交易1", "交易2", "交易3"])
    blockchain.add_block(["交易4", "交易5"])
    blockchain.add_block(["交易6"])
    
    # 显示区块链信息
    info = blockchain.get_chain_info()
    print(f"区块链高度: {info['height']}")
    print(f"头部区块: {info['head_hash'][:16]}...")
    print(f"总区块数: {info['total_blocks']}")
    
    # 验证区块链
    is_valid = blockchain.verify_chain()
    print(f"区块链验证: {'✅ 有效' if is_valid else '❌ 无效'}")
    print()


def demonstrate_merkle_tree():
    """演示默克尔树的构建和验证"""
    print("=== 默克尔树演示 ===")
    
    # 创建交易列表
    transactions = ["tx1", "tx2", "tx3", "tx4", "tx5"]
    
    # 构建默克尔树
    merkle_tree = MerkleTree(transactions)
    print(f"交易数量: {len(transactions)}")
    print(f"默克尔根: {merkle_tree.root.hash[:16]}...")
    
    # 为第一个交易生成证明
    tx_index = 0
    proof = merkle_tree.generate_proof(tx_index)
    print(f"为交易 '{transactions[tx_index]}' 生成的证明路径长度: {len(proof)}")
    
    # 验证证明
    tx_hash = transactions[tx_index]
    is_valid = merkle_tree.verify_proof(tx_hash, proof, merkle_tree.root.hash)
    print(f"默克尔证明验证: {'✅ 有效' if is_valid else '❌ 无效'}")
    print()


def demonstrate_spv():
    """演示SPV节点的操作"""
    print("=== SPV节点演示 ===")
    
    # 创建SPV节点
    spv_node = SPVNode()
    
    # 模拟添加区块头信息
    spv_node.add_block_header(
        block_hash="block123",
        prev_hash="block122", 
        merkle_root="merkle_root_hash",
        timestamp=int(time.time()),
        height=123
    )
    
    # 获取节点信息
    info = spv_node.get_block_chain_info()
    print(f"SPV节点高度: {info['height']}")
    print(f"存储的区块头数量: {info['blocks']}")
    print(f"存储模式: {info['storage']}")
    print()


def performance_comparison():
    """性能对比演示"""
    print("=== 性能对比演示 ===")
    
    # 不同规模的交易测试
    test_sizes = [10, 100, 1000]
    
    for size in test_sizes:
        transactions = [f"tx{i}" for i in range(size)]
        
        start_time = time.time()
        merkle_tree = MerkleTree(transactions)
        build_time = time.time() - start_time
        
        start_time = time.time()
        proof = merkle_tree.generate_proof(0)
        proof_time = time.time() - start_time
        
        print(f"交易数量: {size}")
        print(f"  构建时间: {build_time:.4f}s")
        print(f"  证明生成: {proof_time:.4f}s") 
        print(f"  证明长度: {len(proof)} 步")


if __name__ == "__main__":
    """运行所有演示"""
    print("🚀 第08讲：区块链数据结构 - 代码演示")
    print("=" * 50)
    
    demonstrate_hash_pointer()
    demonstrate_blockchain()
    demonstrate_merkle_tree()
    demonstrate_spv()
    performance_comparison()
    
    print("\n✅ 所有演示完成！")
    print("💡 提示：你可以修改代码中的参数来进行更多实验")