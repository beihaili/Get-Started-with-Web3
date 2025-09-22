#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
比特币难度调整机制实现示例

本文件包含第13讲《难度调整机制》章节的所有代码示例
提供了完整的难度调整算法实现，包括难度计算、时间分析、预测模型等核心功能
"""

import time
import math
import datetime
from typing import List, Dict, Tuple, Optional

class DifficultyCalculator:
    """比特币难度计算器"""
    
    def __init__(self):
        self.target_block_time = 600  # 10分钟 = 600秒
        self.adjustment_period = 2016  # 2016个区块调整一次
        self.max_adjustment_factor = 4.0  # 最大调整倍数
        self.min_adjustment_factor = 0.25  # 最小调整倍数
    
    def bits_to_target(self, bits):
        """将紧凑格式的bits转换为完整的目标值"""
        # bits格式: [exponent 1字节][mantissa 3字节]
        exponent = bits >> 24
        mantissa = bits & 0xffffff
        
        if exponent <= 3:
            target = mantissa >> (8 * (3 - exponent))
        else:
            target = mantissa << (8 * (exponent - 3))
        
        return target
    
    def target_to_bits(self, target):
        """将完整的目标值转换为紧凑格式的bits"""
        if target == 0:
            return 0
        
        # 找到最高位
        target_hex = hex(target)[2:].rstrip('L')
        target_bytes = bytes.fromhex(target_hex.zfill(len(target_hex) + len(target_hex) % 2))
        
        # 计算紧凑格式
        size = len(target_bytes)
        if size <= 3:
            mantissa = int.from_bytes(target_bytes.ljust(3, b'\x00'), 'big')
            exponent = size
        else:
            mantissa = int.from_bytes(target_bytes[:3], 'big')
            exponent = size
            # 如果最高位是1，需要右移避免符号位问题
            if mantissa & 0x800000:
                mantissa >>= 8
                exponent += 1
        
        return (exponent << 24) | mantissa
    
    def calculate_difficulty(self, target):
        """根据目标值计算难度"""
        max_target = 0x00000000FFFF0000000000000000000000000000000000000000000000000000
        return max_target / target
    
    def adjust_difficulty(self, current_bits, actual_time, expected_time):
        """调整难度算法"""
        # 计算时间比率
        time_ratio = actual_time / expected_time
        
        # 应用调整限制（4倍上限，1/4倍下限）
        if time_ratio > self.max_adjustment_factor:
            time_ratio = self.max_adjustment_factor
        elif time_ratio < self.min_adjustment_factor:
            time_ratio = self.min_adjustment_factor
        
        # 计算新目标值
        current_target = self.bits_to_target(current_bits)
        new_target = int(current_target * time_ratio)
        
        # 转换回bits格式
        new_bits = self.target_to_bits(new_target)
        
        return {
            'old_bits': current_bits,
            'new_bits': new_bits,
            'old_target': current_target,
            'new_target': new_target,
            'old_difficulty': self.calculate_difficulty(current_target),
            'new_difficulty': self.calculate_difficulty(new_target),
            'time_ratio': time_ratio,
            'adjustment_factor': 1 / time_ratio
        }

class BlockTimeAnalyzer:
    """区块时间分析器"""
    
    def __init__(self):
        self.difficulty_calc = DifficultyCalculator()
    
    def analyze_block_times(self, block_times: List[float]):
        """分析区块时间统计"""
        if len(block_times) < 2:
            return None
        
        intervals = [block_times[i+1] - block_times[i] for i in range(len(block_times)-1)]
        
        return {
            'total_blocks': len(block_times),
            'total_intervals': len(intervals),
            'total_time': block_times[-1] - block_times[0],
            'average_interval': sum(intervals) / len(intervals),
            'median_interval': sorted(intervals)[len(intervals)//2],
            'min_interval': min(intervals),
            'max_interval': max(intervals),
            'std_deviation': self._std_dev(intervals),
            'intervals': intervals
        }
    
    def _std_dev(self, values):
        """计算标准差"""
        mean = sum(values) / len(values)
        variance = sum((x - mean) ** 2 for x in values) / len(values)
        return math.sqrt(variance)
    
    def simulate_difficulty_adjustment(self, initial_difficulty, hashrate_changes):
        """模拟难度调整过程"""
        results = []
        current_difficulty = initial_difficulty
        current_bits = 0x1d00ffff  # 简化的初始bits
        
        for period, hashrate_multiplier in enumerate(hashrate_changes):
            # 模拟实际出块时间
            expected_time = 2016 * 600  # 2016个区块的预期时间
            actual_time = expected_time / hashrate_multiplier
            
            # 计算调整
            adjustment = self.difficulty_calc.adjust_difficulty(
                current_bits, actual_time, expected_time
            )
            
            results.append({
                'period': period + 1,
                'hashrate_multiplier': hashrate_multiplier,
                'old_difficulty': adjustment['old_difficulty'],
                'new_difficulty': adjustment['new_difficulty'],
                'adjustment_factor': adjustment['adjustment_factor'],
                'actual_time_hours': actual_time / 3600,
                'expected_time_hours': expected_time / 3600
            })
            
            current_bits = adjustment['new_bits']
        
        return results

class HashratePrediction:
    """算力预测模型"""
    
    def __init__(self):
        self.historical_data = []
    
    def add_data_point(self, timestamp, difficulty, hashrate_estimate):
        """添加历史数据点"""
        self.historical_data.append({
            'timestamp': timestamp,
            'difficulty': difficulty,
            'hashrate': hashrate_estimate
        })
    
    def estimate_hashrate_from_difficulty(self, difficulty):
        """从难度估算算力"""
        # 算力 ≈ 难度 * 2^32 / 600秒
        hashrate = difficulty * (2**32) / 600
        return hashrate
    
    def linear_regression_prediction(self, days_ahead=30):
        """线性回归预测未来算力"""
        if len(self.historical_data) < 2:
            return None
        
        # 简化的线性回归
        x_values = [i for i in range(len(self.historical_data))]
        y_values = [data['hashrate'] for data in self.historical_data]
        
        n = len(x_values)
        sum_x = sum(x_values)
        sum_y = sum(y_values)
        sum_xy = sum(x_values[i] * y_values[i] for i in range(n))
        sum_x2 = sum(x * x for x in x_values)
        
        # 计算斜率和截距
        slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x)
        intercept = (sum_y - slope * sum_x) / n
        
        # 预测未来值
        future_x = len(self.historical_data) + days_ahead / 14  # 每14天一个调整周期
        future_hashrate = slope * future_x + intercept
        
        return {
            'slope': slope,
            'intercept': intercept,
            'r_squared': self._calculate_r_squared(x_values, y_values, slope, intercept),
            'predicted_hashrate': future_hashrate,
            'prediction_date': days_ahead,
            'confidence': 'low' if abs(slope) < 1e12 else 'medium'
        }
    
    def _calculate_r_squared(self, x_values, y_values, slope, intercept):
        """计算R²值"""
        y_mean = sum(y_values) / len(y_values)
        ss_tot = sum((y - y_mean) ** 2 for y in y_values)
        ss_res = sum((y_values[i] - (slope * x_values[i] + intercept)) ** 2 
                     for i in range(len(x_values)))
        
        return 1 - (ss_res / ss_tot) if ss_tot != 0 else 0

class BitcoinNetworkSimulator:
    """比特币网络模拟器"""
    
    def __init__(self, initial_difficulty=1.0, initial_hashrate=1e15):
        self.current_difficulty = initial_difficulty
        self.current_hashrate = initial_hashrate
        self.block_height = 0
        self.blocks = []
        self.difficulty_calc = DifficultyCalculator()
        self.time_analyzer = BlockTimeAnalyzer()
    
    def mine_block(self, timestamp, actual_hashrate=None):
        """模拟挖矿出块"""
        if actual_hashrate is None:
            actual_hashrate = self.current_hashrate
        
        # 根据难度和算力计算期望出块时间
        expected_time = self.current_difficulty * (2**32) / actual_hashrate
        
        # 添加随机性（泊松分布的简化模拟）
        import random
        actual_time = random.expovariate(1.0 / expected_time)
        
        self.blocks.append({
            'height': self.block_height,
            'timestamp': timestamp,
            'difficulty': self.current_difficulty,
            'hashrate': actual_hashrate,
            'block_time': actual_time
        })
        
        self.block_height += 1
        
        # 每2016个区块检查是否需要调整难度
        if self.block_height % 2016 == 0:
            self._adjust_difficulty()
        
        return self.blocks[-1]
    
    def _adjust_difficulty(self):
        """内部难度调整逻辑"""
        if len(self.blocks) < 2016:
            return
        
        # 获取最近2016个区块的时间
        recent_blocks = self.blocks[-2016:]
        total_time = recent_blocks[-1]['timestamp'] - recent_blocks[0]['timestamp']
        expected_time = 2015 * 600  # 2015个间隔，每个10分钟
        
        # 计算调整因子
        adjustment_factor = expected_time / total_time
        
        # 应用限制
        adjustment_factor = max(0.25, min(4.0, adjustment_factor))
        
        # 更新难度
        old_difficulty = self.current_difficulty
        self.current_difficulty *= adjustment_factor
        
        print(f"难度调整 - 区块高度: {self.block_height}")
        print(f"实际时间: {total_time/3600:.2f}小时")
        print(f"预期时间: {expected_time/3600:.2f}小时")
        print(f"调整因子: {adjustment_factor:.4f}")
        print(f"难度变化: {old_difficulty:.2e} → {self.current_difficulty:.2e}")
    
    def simulate_hashrate_growth(self, days, daily_growth_rate=0.001):
        """模拟算力增长"""
        current_time = time.time()
        day_seconds = 24 * 3600
        
        for day in range(days):
            # 更新算力
            self.current_hashrate *= (1 + daily_growth_rate)
            
            # 模拟一天的出块
            blocks_per_day = 144  # 预期每天144个区块
            for block in range(blocks_per_day):
                block_timestamp = current_time + day * day_seconds + block * 600
                self.mine_block(block_timestamp, self.current_hashrate)
        
        return self.get_simulation_summary()
    
    def get_simulation_summary(self):
        """获取模拟总结"""
        if not self.blocks:
            return None
        
        # 分析区块时间
        timestamps = [block['timestamp'] for block in self.blocks]
        analysis = self.time_analyzer.analyze_block_times(timestamps)
        
        # 计算平均难度和算力
        avg_difficulty = sum(block['difficulty'] for block in self.blocks) / len(self.blocks)
        avg_hashrate = sum(block['hashrate'] for block in self.blocks) / len(self.blocks)
        
        return {
            'total_blocks': len(self.blocks),
            'final_difficulty': self.current_difficulty,
            'final_hashrate': self.current_hashrate,
            'average_difficulty': avg_difficulty,
            'average_hashrate': avg_hashrate,
            'average_block_time': analysis['average_interval'],
            'difficulty_adjustments': len(self.blocks) // 2016,
            'simulation_period_days': (self.blocks[-1]['timestamp'] - self.blocks[0]['timestamp']) / (24 * 3600)
        }

def demonstrate_difficulty_adjustment():
    """演示难度调整算法"""
    print("=== 比特币难度调整算法演示 ===")
    
    calc = DifficultyCalculator()
    
    # 模拟不同的算力变化场景
    scenarios = [
        {"name": "算力翻倍", "hashrate_change": 2.0},
        {"name": "算力减半", "hashrate_change": 0.5},
        {"name": "算力增长50%", "hashrate_change": 1.5},
        {"name": "算力下降25%", "hashrate_change": 0.75},
        {"name": "极端增长(10倍)", "hashrate_change": 10.0},
        {"name": "极端下降(90%)", "hashrate_change": 0.1}
    ]
    
    initial_bits = 0x1d00ffff
    initial_target = calc.bits_to_target(initial_bits)
    initial_difficulty = calc.calculate_difficulty(initial_target)
    
    print(f"初始难度: {initial_difficulty:.2e}")
    print(f"初始目标值: {initial_target:064x}")
    print()
    
    for scenario in scenarios:
        hashrate_multiplier = scenario["hashrate_change"]
        
        # 计算实际出块时间
        expected_time = 2016 * 600  # 2016个区块，每个10分钟
        actual_time = expected_time / hashrate_multiplier  # 算力变化影响出块时间
        
        # 计算难度调整
        adjustment = calc.adjust_difficulty(initial_bits, actual_time, expected_time)
        
        print(f"场景: {scenario['name']}")
        print(f"  算力变化: {hashrate_multiplier}x")
        print(f"  实际时间: {actual_time/3600:.1f}小时 (预期: {expected_time/3600:.1f}小时)")
        print(f"  难度调整: {adjustment['old_difficulty']:.2e} → {adjustment['new_difficulty']:.2e}")
        print(f"  调整倍数: {adjustment['adjustment_factor']:.4f}")
        print()

def analyze_real_world_examples():
    """分析真实世界的难度调整案例"""
    print("=== 真实难度调整案例分析 ===")
    
    # 模拟一些历史数据
    historical_adjustments = [
        {"date": "2024-01-01", "old_difficulty": 70e12, "new_difficulty": 75e12, "change": "+7.1%"},
        {"date": "2024-02-15", "old_difficulty": 75e12, "new_difficulty": 78e12, "change": "+4.0%"},
        {"date": "2024-04-01", "old_difficulty": 78e12, "new_difficulty": 82e12, "change": "+5.1%"},
        {"date": "2024-05-15", "old_difficulty": 82e12, "new_difficulty": 80e12, "change": "-2.4%"},
        {"date": "2024-07-01", "old_difficulty": 80e12, "new_difficulty": 85e12, "change": "+6.3%"}
    ]
    
    print("最近的难度调整历史:")
    print("日期\t\t旧难度\t\t新难度\t\t变化")
    print("-" * 60)
    
    for adj in historical_adjustments:
        print(f"{adj['date']}\t{adj['old_difficulty']:.1e}\t{adj['new_difficulty']:.1e}\t{adj['change']}")
    
    # 计算统计信息
    changes = [7.1, 4.0, 5.1, -2.4, 6.3]
    avg_change = sum(changes) / len(changes)
    max_change = max(changes)
    min_change = min(changes)
    
    print(f"\n统计分析:")
    print(f"平均调整幅度: {avg_change:.1f}%")
    print(f"最大增长: {max_change:.1f}%")
    print(f"最大下降: {abs(min_change):.1f}%")
    print(f"总体趋势: 上升")

def predict_future_difficulty():
    """预测未来难度变化"""
    print("=== 未来难度预测 ===")
    
    predictor = HashratePrediction()
    
    # 添加一些模拟历史数据
    base_time = time.time()
    base_hashrate = 400e18  # 400 EH/s
    
    for i in range(50):  # 50个数据点
        timestamp = base_time - (49 - i) * 14 * 24 * 3600  # 每14天一个数据点
        hashrate = base_hashrate * (1.02 ** i)  # 每期增长2%
        difficulty = hashrate * 600 / (2**32)  # 从算力计算难度
        
        predictor.add_data_point(timestamp, difficulty, hashrate)
    
    # 进行预测
    prediction = predictor.linear_regression_prediction(30)  # 预测30天后
    
    if prediction:
        print(f"当前算力趋势斜率: {prediction['slope']:.2e} H/s per period")
        print(f"预测30天后算力: {prediction['predicted_hashrate']:.2e} H/s")
        print(f"预测置信度: {prediction['confidence']}")
        print(f"模型拟合度 (R²): {prediction['r_squared']:.4f}")
        
        # 计算对应的难度
        predicted_difficulty = prediction['predicted_hashrate'] * 600 / (2**32)
        current_difficulty = predictor.historical_data[-1]['difficulty']
        growth_rate = (predicted_difficulty / current_difficulty - 1) * 100
        
        print(f"预测难度变化: {growth_rate:+.1f}%")

def simulate_extreme_scenarios():
    """模拟极端情况下的网络表现"""
    print("=== 极端场景模拟 ===")
    
    simulator = BitcoinNetworkSimulator(
        initial_difficulty=80e12,
        initial_hashrate=500e18
    )
    
    # 场景1: 算力突然下降80%
    print("场景1: 算力突然下降80%")
    simulator.current_hashrate *= 0.2
    
    # 模拟接下来的调整周期
    blocks_before = simulator.block_height
    current_time = time.time()
    
    for i in range(2016):  # 一个完整的调整周期
        simulator.mine_block(current_time + i * 3000)  # 平均50分钟出块
    
    print(f"调整周期完成，共 {simulator.block_height - blocks_before} 个区块")
    print(f"新难度: {simulator.current_difficulty:.2e}")
    
    # 场景2: 算力快速增长
    print("\n场景2: 算力快速增长10倍")
    simulator.current_hashrate *= 50  # 总共10倍增长 (0.2 * 50 = 10)
    
    blocks_before = simulator.block_height
    for i in range(2016):  # 另一个调整周期
        simulator.mine_block(current_time + 2016*3000 + i * 60)  # 平均1分钟出块
    
    print(f"调整周期完成，共 {simulator.block_height - blocks_before} 个区块")
    print(f"新难度: {simulator.current_difficulty:.2e}")

def demonstrate_time_warp_attack():
    """演示时间扭曲攻击的理论可能性"""
    print("=== 时间扭曲攻击理论分析 ===")
    
    calc = DifficultyCalculator()
    
    print("正常情况:")
    normal_time = 2016 * 600  # 2016个区块，每个10分钟
    print(f"2016个区块的正常时间: {normal_time/3600:.1f}小时")
    
    print("\n时间扭曲攻击场景:")
    # 攻击者操纵时间戳，使系统认为出块时间很长
    manipulated_time = normal_time * 4  # 声称花了4倍时间
    
    adjustment = calc.adjust_difficulty(0x1d00ffff, manipulated_time, normal_time)
    
    print(f"操纵后的时间: {manipulated_time/3600:.1f}小时")
    print(f"难度调整倍数: {adjustment['adjustment_factor']:.4f}")
    print(f"新难度是原难度的: {1/adjustment['adjustment_factor']:.4f}倍")
    
    print("\n防护措施:")
    print("1. 时间戳验证: 节点检查区块时间戳的合理性")
    print("2. 网络时间: 使用网络调整时间而非本地时间")
    print("3. 共识规则: 时间戳必须在合理范围内")

if __name__ == "__main__":
    print("比特币难度调整机制完整演示")
    print("=" * 50)
    
    # 可选的演示模块
    demos = [
        ("难度调整算法", demonstrate_difficulty_adjustment),
        ("真实案例分析", analyze_real_world_examples),
        ("未来预测模型", predict_future_difficulty),
        ("极端场景模拟", simulate_extreme_scenarios),
        ("时间扭曲攻击", demonstrate_time_warp_attack)
    ]
    
    print("可用演示模块:")
    for i, (name, _) in enumerate(demos, 1):
        print(f"{i}. {name}")
    
    print("\n运行所有演示...")
    for name, demo_func in demos:
        print(f"\n{'='*60}")
        print(f"运行演示: {name}")
        print('='*60)
        demo_func()
        print()