#!/usr/bin/env python3
"""
第08讲：数据结构测试脚本
验证核心功能的正确性
"""

from data_structure_examples import *


def test_hash_pointer():
    """测试哈希指针功能"""
    print("测试哈希指针...")
    
    data = "test_transaction"
    hp = HashPointer(data)
    
    # 测试正确数据验证
    assert hp.verify_data(data) == True, "正确数据验证失败"
    
    # 测试错误数据验证
    assert hp.verify_data("wrong_data") == False, "错误数据验证失败"
    
    print("✅ 哈希指针测试通过")


def test_blockchain():
    """测试区块链功能"""
    print("测试区块链...")
    
    blockchain = Blockchain()
    
    # 测试初始状态
    assert blockchain.height == 0, "初始高度错误"
    assert blockchain.head == blockchain.genesis, "初始头部错误"
    
    # 添加区块
    block1 = blockchain.add_block(["tx1", "tx2"])
    assert blockchain.height == 1, "区块添加后高度错误"
    assert blockchain.head.hash == block1.hash, "头部更新错误"
    
    # 验证区块链
    assert blockchain.verify_chain() == True, "区块链验证失败"
    
    print("✅ 区块链测试通过")


def test_merkle_tree():
    """测试默克尔树功能"""
    print("测试默克尔树...")
    
    transactions = ["tx1", "tx2", "tx3", "tx4"]
    tree = MerkleTree(transactions)
    
    # 测试树构建
    assert tree.root is not None, "默克尔根构建失败"
    assert len(tree.leaves) == len(transactions), "叶子节点数量错误"
    
    # 测试证明生成和验证
    proof = tree.generate_proof(0)
    assert len(proof) > 0, "证明生成失败"
    
    is_valid = tree.verify_proof(transactions[0], proof, tree.root.hash)
    assert is_valid == True, "证明验证失败"
    
    # 测试错误证明
    wrong_proof = tree.generate_proof(1)  # 错误的证明
    is_invalid = tree.verify_proof(transactions[0], wrong_proof, tree.root.hash)
    assert is_invalid == False, "错误证明应该验证失败"
    
    print("✅ 默克尔树测试通过")


def test_spv_node():
    """测试SPV节点功能"""
    print("测试SPV节点...")
    
    spv = SPVNode()
    
    # 添加区块头
    spv.add_block_header("block1", "block0", "merkle1", 1234567890, 1)
    
    # 测试信息获取
    info = spv.get_block_chain_info()
    assert info["height"] == 1, "SPV节点高度错误"
    assert info["blocks"] == 1, "SPV节点区块数错误"
    
    print("✅ SPV节点测试通过")


def test_edge_cases():
    """测试边界情况"""
    print("测试边界情况...")
    
    # 空交易列表的默克尔树
    empty_tree = MerkleTree([])
    assert empty_tree.root is None, "空默克尔树应该没有根节点"
    
    # 单个交易的默克尔树
    single_tree = MerkleTree(["single_tx"])
    assert single_tree.root is not None, "单交易默克尔树应该有根节点"
    assert single_tree.root.data == "single_tx", "单交易根节点数据错误"
    
    # 奇数个交易的默克尔树
    odd_tree = MerkleTree(["tx1", "tx2", "tx3"])
    proof = odd_tree.generate_proof(0)
    is_valid = odd_tree.verify_proof("tx1", proof, odd_tree.root.hash)
    assert is_valid == True, "奇数交易默克尔树验证失败"
    
    print("✅ 边界情况测试通过")


def run_all_tests():
    """运行所有测试"""
    print("🧪 开始运行数据结构测试套件")
    print("=" * 40)
    
    try:
        test_hash_pointer()
        test_blockchain()
        test_merkle_tree()
        test_spv_node()
        test_edge_cases()
        
        print("\n🎉 所有测试通过！")
        print("✅ 第08讲数据结构实现正确")
        
    except AssertionError as e:
        print(f"\n❌ 测试失败: {e}")
    except Exception as e:
        print(f"\n💥 测试出错: {e}")


if __name__ == "__main__":
    run_all_tests()