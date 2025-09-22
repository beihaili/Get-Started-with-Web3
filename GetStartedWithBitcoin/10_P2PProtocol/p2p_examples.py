# 比特币P2P网络核心代码示例
# 配合第10讲：P2P网络协议使用

import socket
import hashlib
import json
import threading
import time
import random
import subprocess

# 1. DNS种子节点发现
def dns_seed_discovery():
    """从DNS种子获取节点地址"""
    dns_seeds = [
        "seed.bitcoin.sipa.be",
        "dnsseed.bluematt.me", 
        "dnsseed.bitcoin.dashjr.org"
    ]
    
    peer_ips = []
    for seed in dns_seeds:
        try:
            ips = socket.gethostbyname_ex(seed)[2]
            peer_ips.extend(ips[:5])  # 取前5个IP
        except:
            continue
    
    return peer_ips

# 2. 比特币消息格式
def create_bitcoin_message(command, payload=b''):
    """创建比特币协议消息"""
    magic = b'\xf9\xbe\xb4\xd9'  # 主网魔法数
    command_bytes = command.ljust(12, b'\x00')[:12]
    length = len(payload)
    checksum = hashlib.sha256(hashlib.sha256(payload).digest()).digest()[:4]
    
    return magic + command_bytes + length.to_bytes(4, 'little') + checksum + payload

# 3. BIP 324 加密连接（简化演示）
class BIP324Connection:
    def __init__(self):
        self.encryption_enabled = True
        self.session_key = None
    
    def establish_encrypted_connection(self):
        """建立加密连接"""
        # 密钥交换（简化）
        my_key = random.randint(1, 2**256)
        peer_key = random.randint(1, 2**256)
        
        # 生成共享密钥
        self.session_key = hashlib.sha256(f"{my_key}{peer_key}".encode()).digest()
        
        print("✅ BIP 324加密连接已建立")
        return True

# 4. 简单P2P节点演示
class SimpleP2PNode:
    def __init__(self, node_id):
        self.node_id = node_id
        self.peers = {}
        self.mempool = []
    
    def connect_to_peer(self, peer_id):
        """连接到其他节点"""
        self.peers[peer_id] = f"connection_{peer_id}"
        print(f"{self.node_id} 连接到 {peer_id}")
    
    def broadcast_transaction(self, tx_data):
        """广播交易"""
        self.mempool.append(tx_data)
        print(f"{self.node_id} 广播交易: {tx_data}")
        
        # 转发给所有连接的节点
        for peer_id in self.peers:
            print(f"  → 转发给 {peer_id}")

# 5. 网络拓扑分析
def analyze_network_topology():
    """分析比特币网络特性"""
    return {
        "网络类型": "无结构P2P网络",
        "连接策略": "8个出站 + 125个入站",
        "网络直径": "平均6跳",
        "容错能力": "高度冗余",
        "默认端口": {"主网": 8333, "测试网": 18333}
    }

# 6. 比特币网络连接测试（配合README实践部分）
def test_bitcoin_network():
    """测试本地比特币网络连接"""
    try:
        # 检查bitcoin-cli是否可用
        result = subprocess.run(['bitcoin-cli', '--version'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode != 0:
            print("❌ 未找到bitcoin-cli，请先安装Bitcoin Core")
            return False
        
        print("✅ Bitcoin Core已安装")
        
        # 检查网络连接
        result = subprocess.run(['bitcoin-cli', '-testnet', 'getconnectioncount'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            count = int(result.stdout.strip())
            print(f"📊 当前连接节点数: {count}")
            return True
        else:
            print("⚠️  比特币节点未运行或未同步")
            return False
            
    except FileNotFoundError:
        print("❌ 未找到bitcoin-cli命令")
        return False
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        return False

# 7. 村庄传话游戏模拟（配合README比喻）
def village_gossip_simulation():
    """模拟村庄传话游戏"""
    print("🏘️  村庄传话游戏模拟:")
    
    # 创建村民节点
    villagers = ["Alice", "Bob", "Charlie", "David", "Eve"]
    connections = {
        "Alice": ["Bob", "Charlie"],
        "Bob": ["Alice", "David", "Eve"],
        "Charlie": ["Alice", "Eve"],
        "David": ["Bob", "Eve"],
        "Eve": ["Bob", "Charlie", "David"]
    }
    
    # 模拟消息传播
    message = "比特币价格上涨了!"
    sender = "Alice"
    
    print(f"📢 {sender} 开始传播消息: '{message}'")
    
    # 第一轮传播
    round1 = connections[sender]
    print(f"第1轮: {sender} → {', '.join(round1)}")
    
    # 第二轮传播
    round2_receivers = set()
    for villager in round1:
        for friend in connections[villager]:
            if friend != sender and friend not in round1:
                round2_receivers.add(friend)
    
    if round2_receivers:
        print(f"第2轮: {', '.join(round1)} → {', '.join(round2_receivers)}")
    
    all_reached = set([sender] + round1 + list(round2_receivers))
    print(f"🎯 消息已传达到 {len(all_reached)}/{len(villagers)} 个村民")

# 演示代码
if __name__ == "__main__":
    print("🔍 DNS种子节点发现演示:")
    peers = dns_seed_discovery()
    print(f"发现 {len(peers)} 个节点")
    
    print("\n📨 比特币消息创建演示:")
    msg = create_bitcoin_message(b"version", b"version_data")
    print(f"消息长度: {len(msg)} 字节")
    
    print("\n🔐 BIP 324加密演示:")
    bip324 = BIP324Connection()
    bip324.establish_encrypted_connection()
    
    print("\n🌐 P2P网络演示:")
    node1 = SimpleP2PNode("Alice")
    node2 = SimpleP2PNode("Bob")
    
    node1.connect_to_peer("Bob")
    node1.broadcast_transaction("Alice向Bob转账1BTC")
    
    print("\n📊 网络拓扑分析:")
    topology = analyze_network_topology()
    for key, value in topology.items():
        print(f"  {key}: {value}")
    
    print("\n🧪 比特币网络连接测试:")
    test_bitcoin_network()
    
    print("\n🏘️  村庄传话游戏:")
    village_gossip_simulation()