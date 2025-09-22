"""
Lightning Network路由网络实现
使用Dijkstra算法寻找最优支付路径
"""

import heapq
from collections import defaultdict

class LightningRouter:
    def __init__(self):
        self.channels = {}
        self.nodes = set()
        self.channel_graph = defaultdict(list)
    
    def add_channel(self, node_a, node_b, capacity, fee_rate):
        """添加支付通道到路由图"""
        channel_id = f"{node_a}-{node_b}"
        self.channels[channel_id] = {
            'capacity': capacity,
            'fee_rate': fee_rate,
            'node_a': node_a,
            'node_b': node_b
        }
        
        self.nodes.add(node_a)
        self.nodes.add(node_b)
        self.channel_graph[node_a].append((node_b, capacity, fee_rate))
        self.channel_graph[node_b].append((node_a, capacity, fee_rate))
    
    def find_route(self, source, destination, amount):
        """使用Dijkstra算法寻找最优路径"""
        distances = {node: float('inf') for node in self.nodes}
        distances[source] = 0
        previous_nodes = {}
        pq = [(0, source)]
        
        while pq:
            current_distance, current_node = heapq.heappop(pq)
            
            if current_node == destination:
                # 构建路径
                path = []
                while current_node in previous_nodes:
                    path.append(current_node)
                    current_node = previous_nodes[current_node]
                path.append(source)
                return path[::-1]
            
            if current_distance > distances[current_node]:
                continue
                
            for neighbor, capacity, fee_rate in self.channel_graph[current_node]:
                if capacity >= amount:  # 检查通道容量
                    fee = amount * fee_rate
                    distance = current_distance + fee
                    
                    if distance < distances[neighbor]:
                        distances[neighbor] = distance
                        previous_nodes[neighbor] = current_node
                        heapq.heappush(pq, (distance, neighbor))
        
        return None  # 没有找到路径
    
    def calculate_route_fees(self, route, amount):
        """计算路由总手续费"""
        total_fees = 0
        for i in range(len(route) - 1):
            node_a, node_b = route[i], route[i + 1]
            channel_id = f"{node_a}-{node_b}"
            if channel_id in self.channels:
                fee_rate = self.channels[channel_id]['fee_rate']
                total_fees += amount * fee_rate
        return total_fees

if __name__ == "__main__":
    # 示例使用
    router = LightningRouter()
    
    # 构建简单的网络拓扑
    router.add_channel("Alice", "Bob", 1000000, 0.001)
    router.add_channel("Bob", "Charlie", 500000, 0.002)
    router.add_channel("Alice", "David", 800000, 0.0015)
    router.add_channel("David", "Charlie", 600000, 0.0018)
    
    # 寻找从Alice到Charlie的路径
    amount = 100000
    route = router.find_route("Alice", "Charlie", amount)
    
    if route:
        print(f"找到路径: {' -> '.join(route)}")
        fees = router.calculate_route_fees(route, amount)
        print(f"总手续费: {fees} satoshis")
    else:
        print("未找到可用路径")