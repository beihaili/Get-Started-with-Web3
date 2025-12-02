#!/usr/bin/env python3
"""
比特币DNS种子节点发现机制
演示如何通过DNS种子发现网络中的活跃节点
"""

import socket
import random
import time


class DNSSeedDiscovery:
    """DNS种子节点发现"""
    
    def __init__(self):
        self.dns_seeds = [
            "seed.bitcoin.sipa.be",
            "dnsseed.bluematt.me", 
            "dnsseed.bitcoin.dashjr.org",
            "seed.bitcoinstats.com",
            "seed.bitnodes.io",
            "seed.bitcoin.jonasschnelli.ch",
            "seed.btc.petertodd.org",
            "seed.bitcoin.sprovoost.nl",
            "dnsseed.emzy.de"
        ]
        
        # 硬编码种子节点（紧急备胎）
        self.seed_nodes = [
            "23.195.161.53",
            "45.32.195.105", 
            "104.155.225.230",
        ]
    
    def bootstrap_from_dns_seeds(self):
        """从DNS种子获取节点地址"""
        peer_ips = []
        for seed in self.dns_seeds:
            try:
                # DNS查询返回IP地址列表
                ips = socket.gethostbyname_ex(seed)[2]
                peer_ips.extend(ips)
                print(f"从 {seed} 获取到 {len(ips)} 个节点地址")
            except socket.gaierror as e:
                print(f"DNS种子 {seed} 查询失败: {e}")
                continue  # 某个种子服务器不可用
        
        return list(set(peer_ips))  # 去重
    
    def fallback_to_seed_nodes(self):
        """备用的种子节点连接"""
        print("尝试连接硬编码种子节点...")
        for ip in self.seed_nodes:
            if self.try_connect(ip, 8333):
                print(f"成功连接到种子节点 {ip}")
                return True
        return False
    
    def try_connect(self, ip, port, timeout=5):
        """尝试连接到指定节点"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(timeout)
            result = sock.connect_ex((ip, port))
            sock.close()
            return result == 0
        except Exception as e:
            print(f"连接 {ip}:{port} 失败: {e}")
            return False


class AddrMessage:
    """addr消息处理 - 对等节点发现"""
    
    def __init__(self):
        self.addresses = []  # 最多包含1000个地址
        
    def share_known_peers(self, peer):
        """分享已知的对等节点地址"""
        # 选择最新发现的地址
        recent_addrs = self.get_recent_addresses(1000)
        
        # 发送给请求的对等节点
        addr_msg = AddrMessage()
        addr_msg.addresses = recent_addrs
        return addr_msg
    
    def get_recent_addresses(self, limit):
        """获取最近的地址列表"""
        # 简化实现：返回随机地址
        return [f"192.168.1.{i}" for i in range(min(limit, 10))]


class MessageDeduplication:
    """消息去重机制"""
    
    def __init__(self):
        self.seen_invs = {}  # 记录已见过的inv
        self.cleanup_interval = 3600  # 1小时清理一次
    
    def is_duplicate(self, inv_hash):
        """检查是否重复"""
        current_time = time.time()
        
        if inv_hash in self.seen_invs:
            return True
        
        # 记录新的inv
        self.seen_invs[inv_hash] = current_time
        
        # 定期清理老旧记录
        if len(self.seen_invs) > 10000:
            self.cleanup_old_records()
        
        return False
    
    def cleanup_old_records(self):
        """清理老旧记录"""
        current_time = time.time()
        cutoff_time = current_time - self.cleanup_interval
        
        old_keys = [k for k, v in self.seen_invs.items() if v < cutoff_time]
        for key in old_keys:
            del self.seen_invs[key]
        
        print(f"清理了 {len(old_keys)} 个老旧记录")


def demo_node_discovery():
    """演示节点发现过程"""
    print("=== 比特币节点发现演示 ===")
    
    discovery = DNSSeedDiscovery()
    
    # 1. 尝试DNS种子发现
    print("\n1. 从DNS种子获取节点地址...")
    peer_ips = discovery.bootstrap_from_dns_seeds()
    print(f"总共发现 {len(peer_ips)} 个节点地址")
    
    # 2. 测试连接活跃节点
    print("\n2. 测试连接前5个节点...")
    active_peers = []
    for ip in peer_ips[:5]:
        if discovery.try_connect(ip, 8333, timeout=3):
            active_peers.append(ip)
            print(f"✓ {ip} 在线")
        else:
            print(f"✗ {ip} 离线或不可达")
    
    # 3. 备用连接方案
    if not active_peers:
        print("\n3. 无法连接DNS种子节点，尝试硬编码种子...")
        discovery.fallback_to_seed_nodes()
    
    # 4. 演示消息去重
    print("\n4. 演示消息去重机制...")
    dedup = MessageDeduplication()
    test_hashes = ["hash1", "hash2", "hash1", "hash3", "hash2"]
    for h in test_hashes:
        is_dup = dedup.is_duplicate(h)
        print(f"消息 {h}: {'重复' if is_dup else '新消息'}")


if __name__ == "__main__":
    demo_node_discovery()