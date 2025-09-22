#!/usr/bin/env python3
"""
完整的比特币P2P网络模拟器
演示完整的P2P网络功能，包括节点间通信、消息传播等
"""

import socket
import threading
import time
import json
import random


class SimpleBitcoinNode:
    """简化的比特币节点实现"""
    
    def __init__(self, host='localhost', port=8333, node_id=None):
        self.host = host
        self.port = port
        self.node_id = node_id or f"node_{port}"
        self.peers = {}
        self.blockchain_height = 0
        self.mempool = []
        
        # 创建服务器套接字
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
    def start(self):
        """启动节点"""
        try:
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(10)
            print(f"节点 {self.node_id} 启动，监听 {self.host}:{self.port}")
            
            # 启动接受连接的线程
            accept_thread = threading.Thread(target=self.accept_connections)
            accept_thread.daemon = True
            accept_thread.start()
        except Exception as e:
            print(f"启动节点失败: {e}")
        
    def accept_connections(self):
        """接受入站连接"""
        while True:
            try:
                client_socket, addr = self.server_socket.accept()
                print(f"{self.node_id} 接受来自 {addr} 的连接")
                
                # 为每个连接创建处理线程
                client_thread = threading.Thread(
                    target=self.handle_peer, 
                    args=(client_socket, addr)
                )
                client_thread.daemon = True
                client_thread.start()
                
            except Exception as e:
                print(f"接受连接时出错: {e}")
    
    def connect_to_peer(self, peer_host, peer_port):
        """连接到其他节点"""
        try:
            peer_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            peer_socket.settimeout(10)
            peer_socket.connect((peer_host, peer_port))
            
            peer_id = f"{peer_host}:{peer_port}"
            self.peers[peer_id] = peer_socket
            
            print(f"{self.node_id} 连接到节点 {peer_id}")
            
            # 发送version消息
            version_msg = {
                'type': 'version',
                'node_id': self.node_id,
                'blockchain_height': self.blockchain_height,
                'timestamp': time.time()
            }
            self.send_message(peer_socket, version_msg)
            
            # 启动处理线程
            peer_thread = threading.Thread(
                target=self.handle_peer, 
                args=(peer_socket, (peer_host, peer_port))
            )
            peer_thread.daemon = True
            peer_thread.start()
            
            return True
            
        except Exception as e:
            print(f"连接到 {peer_host}:{peer_port} 失败: {e}")
            return False
    
    def send_message(self, socket_obj, message):
        """发送消息"""
        try:
            msg_str = json.dumps(message) + '\n'
            socket_obj.send(msg_str.encode())
        except Exception as e:
            print(f"发送消息失败: {e}")
    
    def handle_peer(self, peer_socket, peer_addr):
        """处理对等节点消息"""
        buffer = ''
        while True:
            try:
                data = peer_socket.recv(4096).decode()
                if not data:
                    break
                
                buffer += data
                while '\n' in buffer:
                    line, buffer = buffer.split('\n', 1)
                    if line:
                        message = json.loads(line)
                        self.process_message(peer_socket, message)
                        
            except Exception as e:
                print(f"处理对等节点消息时出错: {e}")
                break
        
        peer_socket.close()
    
    def process_message(self, sender_socket, message):
        """处理接收到的消息"""
        msg_type = message.get('type')
        
        if msg_type == 'version':
            print(f"{self.node_id} 收到version消息: {message['node_id']}")
            # 回复verack
            verack_msg = {'type': 'verack', 'node_id': self.node_id}
            self.send_message(sender_socket, verack_msg)
            
        elif msg_type == 'verack':
            print(f"{self.node_id} 收到verack消息，连接建立成功")
            
        elif msg_type == 'ping':
            # 回复pong
            pong_msg = {
                'type': 'pong', 
                'nonce': message.get('nonce'),
                'node_id': self.node_id
            }
            self.send_message(sender_socket, pong_msg)
            
        elif msg_type == 'pong':
            print(f"{self.node_id} 收到pong消息")
            
        elif msg_type == 'tx':
            # 处理交易
            self.handle_transaction(message)
            
        elif msg_type == 'addr':
            # 处理地址消息
            self.handle_addr_message(message)
    
    def broadcast_transaction(self, tx_data):
        """广播交易"""
        tx_msg = {
            'type': 'tx',
            'data': tx_data,
            'node_id': self.node_id,
            'timestamp': time.time()
        }
        
        # 添加到自己的内存池
        self.mempool.append(tx_data)
        print(f"{self.node_id} 广播交易: {tx_data}")
        
        # 转发给所有连接的节点
        for peer_socket in self.peers.values():
            self.send_message(peer_socket, tx_msg)
    
    def handle_transaction(self, message):
        """处理收到的交易"""
        tx_data = message.get('data')
        sender = message.get('node_id')
        
        # 避免重复处理
        if tx_data not in self.mempool:
            self.mempool.append(tx_data)
            print(f"{self.node_id} 收到来自 {sender} 的交易: {tx_data}")
            
            # 继续转发给其他节点（除了发送者）
            for peer_id, peer_socket in self.peers.items():
                # 这里简化处理，实际应该避免回传给发送者
                if sender not in peer_id:
                    self.send_message(peer_socket, message)
    
    def handle_addr_message(self, message):
        """处理地址消息"""
        addresses = message.get('addresses', [])
        print(f"{self.node_id} 收到 {len(addresses)} 个节点地址")
    
    def send_ping(self):
        """发送ping消息"""
        for peer_socket in self.peers.values():
            ping_msg = {
                'type': 'ping',
                'nonce': random.randint(0, 2**32-1),
                'node_id': self.node_id
            }
            self.send_message(peer_socket, ping_msg)
    
    def get_network_status(self):
        """获取网络状态"""
        return {
            'node_id': self.node_id,
            'peer_count': len(self.peers),
            'mempool_size': len(self.mempool),
            'blockchain_height': self.blockchain_height
        }
    
    def shutdown(self):
        """关闭节点"""
        try:
            for peer_socket in self.peers.values():
                peer_socket.close()
            self.server_socket.close()
            print(f"节点 {self.node_id} 已关闭")
        except Exception as e:
            print(f"关闭节点时出错: {e}")


class P2PNetworkSimulator:
    """P2P网络模拟器"""
    
    def __init__(self):
        self.nodes = []
        self.running = False
    
    def create_test_network(self, node_count=3):
        """创建测试网络"""
        print(f"创建包含 {node_count} 个节点的测试网络...")
        
        # 创建节点
        for i in range(node_count):
            port = 8001 + i
            node_name = f"Node_{chr(65+i)}"  # Node_A, Node_B, Node_C...
            node = SimpleBitcoinNode('localhost', port, node_name)
            self.nodes.append(node)
        
        # 启动节点
        for node in self.nodes:
            node.start()
        
        time.sleep(2)  # 等待启动完成
        
        # 建立连接（环形拓扑 + 部分网状连接）
        self.establish_connections()
        
        time.sleep(1)  # 等待连接建立
        return self.nodes
    
    def establish_connections(self):
        """建立节点间连接"""
        node_count = len(self.nodes)
        
        # 环形连接：每个节点连接下一个节点
        for i in range(node_count):
            current_node = self.nodes[i]
            next_node = self.nodes[(i + 1) % node_count]
            current_node.connect_to_peer('localhost', next_node.port)
        
        # 额外连接：增加网络连通性
        if node_count >= 3:
            # 第一个节点连接第三个节点
            self.nodes[0].connect_to_peer('localhost', self.nodes[2].port)
    
    def run_simulation(self, duration=30):
        """运行网络模拟"""
        print(f"\n开始运行网络模拟 ({duration}秒)...")
        self.running = True
        
        start_time = time.time()
        
        # 模拟网络活动
        simulation_thread = threading.Thread(target=self.simulate_activity)
        simulation_thread.daemon = True
        simulation_thread.start()
        
        # 定期显示网络状态
        while self.running and (time.time() - start_time) < duration:
            time.sleep(5)
            self.print_network_status()
        
        self.running = False
        print("网络模拟结束")
    
    def simulate_activity(self):
        """模拟网络活动"""
        while self.running:
            if self.nodes:
                # 随机选择节点广播交易
                node = random.choice(self.nodes)
                tx_data = f"交易_{int(time.time())}_{random.randint(1000, 9999)}"
                node.broadcast_transaction(tx_data)
                
                # 随机发送ping
                if random.random() < 0.3:
                    random.choice(self.nodes).send_ping()
            
            time.sleep(random.uniform(3, 8))
    
    def print_network_status(self):
        """打印网络状态"""
        print("\n" + "="*50)
        print("网络状态:")
        for node in self.nodes:
            status = node.get_network_status()
            print(f"  {status['node_id']}: "
                  f"连接数={status['peer_count']}, "
                  f"内存池={status['mempool_size']}")
        print("="*50)
    
    def shutdown_network(self):
        """关闭网络"""
        print("关闭网络...")
        for node in self.nodes:
            node.shutdown()


def main():
    """主程序"""
    print("比特币P2P网络模拟器")
    print("==================")
    
    simulator = P2PNetworkSimulator()
    
    try:
        # 创建测试网络
        nodes = simulator.create_test_network(3)
        
        # 等待连接稳定
        time.sleep(3)
        
        # 手动测试：广播一个交易
        print("\n手动测试：Node_A 广播交易...")
        nodes[0].broadcast_transaction("Alice向Bob转账1BTC")
        
        # 手动测试：发送ping
        time.sleep(2)
        print("\nNode_B 发送ping...")
        nodes[1].send_ping()
        
        # 运行自动模拟
        simulator.run_simulation(20)
        
    except KeyboardInterrupt:
        print("\n\n收到中断信号，正在关闭...")
    finally:
        simulator.shutdown_network()


if __name__ == "__main__":
    main()