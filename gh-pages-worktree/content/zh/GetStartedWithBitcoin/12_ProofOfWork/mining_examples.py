#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
比特币工作量证明与挖矿实现示例

本文件包含第12讲《工作量证明与挖矿》章节的所有代码示例
提供了完整的挖矿模拟实现，包括PoW算法、挖矿硬件模拟、矿池机制等核心功能
"""

import hashlib
import struct
import time
import random
import threading
from datetime import datetime
from typing import Dict, List, Optional

class BitcoinMiner:
    """比特币挖矿器核心实现"""
    def __init__(self):
        self.difficulty_bits = 0x1d00ffff  # 初始难度
        self.block_reward = 3.125  # 当前区块奖励(BTC)
        
    def calculate_target(self, difficulty_bits):
        """根据难度位计算目标值"""
        # 解析难度位格式: 0x1d00ffff
        exponent = difficulty_bits >> 24
        mantissa = difficulty_bits & 0xffffff
        
        # 计算目标值
        if exponent <= 3:
            target = mantissa >> (8 * (3 - exponent))
        else:
            target = mantissa << (8 * (exponent - 3))
        
        return target
    
    def double_sha256(self, data):
        """双重SHA256哈希"""
        first_hash = hashlib.sha256(data).digest()
        return hashlib.sha256(first_hash).digest()
    
    def mine_block(self, block_header):
        """挖矿主算法"""
        target = self.calculate_target(self.difficulty_bits)
        nonce = 0
        start_time = time.time()
        
        print(f"开始挖矿，目标值: {hex(target)}")
        
        while nonce < 0xFFFFFFFF:  # 32位nonce空间
            # 构建完整区块头（nonce在末尾4字节）
            header_with_nonce = block_header + struct.pack("<I", nonce)
            
            # 计算区块哈希
            block_hash = self.double_sha256(header_with_nonce)
            hash_int = int.from_bytes(block_hash, 'big')
            
            # 检查是否小于目标值
            if hash_int < target:
                end_time = time.time()
                print(f"✅ 挖矿成功！")
                print(f"Nonce: {nonce}")
                print(f"区块哈希: {block_hash.hex()}")
                print(f"挖矿时间: {end_time - start_time:.2f}秒")
                print(f"尝试次数: {nonce + 1}")
                return {
                    'nonce': nonce,
                    'hash': block_hash.hex(),
                    'time': end_time - start_time,
                    'attempts': nonce + 1
                }
            
            nonce += 1
            
            # 每100万次尝试显示进度
            if nonce % 1000000 == 0:
                elapsed = time.time() - start_time
                rate = nonce / elapsed if elapsed > 0 else 0
                print(f"进度: {nonce:,} 次尝试, 速度: {rate:,.0f} H/s")
        
        print("❌ 挖矿失败，nonce空间已耗尽")
        return None

def proof_of_work_concept():
    """工作量证明基本概念演示"""
    print("=== 工作量证明概念演示 ===")
    
    # 模拟不同难度级别
    difficulties = [1, 2, 3, 4]  # 前导0的个数
    
    for difficulty in difficulties:
        target_prefix = "0" * difficulty
        attempts = 0
        start_time = time.time()
        
        print(f"\n寻找以 {target_prefix} 开头的哈希...")
        
        while True:
            # 随机生成数据
            data = f"Bitcoin Block {random.randint(1, 1000000)}"
            hash_result = hashlib.sha256(data.encode()).hexdigest()
            attempts += 1
            
            if hash_result.startswith(target_prefix):
                end_time = time.time()
                print(f"找到！数据: {data}")
                print(f"哈希: {hash_result}")
                print(f"尝试次数: {attempts}")
                print(f"耗时: {end_time - start_time:.3f}秒")
                break

def one_way_function_demo():
    """单向函数特性演示"""
    print("=== 单向函数特性演示 ===")
    
    # 正向计算很容易
    input_data = "Hello Bitcoin"
    hash_result = hashlib.sha256(input_data.encode()).hexdigest()
    print(f"输入: {input_data}")
    print(f"SHA256输出: {hash_result}")
    
    # 反向计算几乎不可能（演示暴力破解的困难）
    target_hash = hash_result[:8] + "00000000"  # 简化的目标哈希
    print(f"\n尝试找到产生哈希前缀 {target_hash[:8]} 的输入...")
    
    attempts = 0
    start_time = time.time()
    
    for i in range(1000000):  # 限制尝试次数
        test_input = f"Bitcoin {i}"
        test_hash = hashlib.sha256(test_input.encode()).hexdigest()
        attempts += 1
        
        if test_hash.startswith(target_hash[:8]):
            print(f"找到匹配！输入: {test_input}")
            print(f"哈希: {test_hash}")
            break
    
    print(f"尝试了 {attempts} 次")

def mining_probability():
    """挖矿概率分析"""
    print("=== 挖矿概率分析 ===")
    
    # 不同算力下的出块概率
    network_hashrate = 400e18  # 全网算力 400 EH/s
    block_time = 600  # 10分钟 = 600秒
    
    miner_hashrates = [
        ("家用电脑", 100e6),        # 100 MH/s
        ("显卡矿机", 100e12),       # 100 TH/s  
        ("专业矿场", 10e15),        # 10 PH/s
        ("大型矿池", 100e15),       # 100 PH/s
    ]
    
    for name, hashrate in miner_hashrates:
        # 计算单个区块的获胜概率
        prob_per_attempt = hashrate / network_hashrate
        prob_per_block = 1 - (1 - prob_per_attempt) ** block_time
        
        # 计算期望出块时间
        expected_time_seconds = network_hashrate / hashrate * block_time
        expected_time_days = expected_time_seconds / (24 * 3600)
        
        print(f"{name}:")
        print(f"  算力: {hashrate/1e12:.1f} TH/s")
        print(f"  单区块获胜概率: {prob_per_block*100:.6f}%")
        print(f"  期望出块时间: {expected_time_days:.1f} 天")
        print()

def create_block_header():
    """创建区块头数据"""
    print("=== 创建区块头 ===")
    
    # 区块头结构 (80字节)
    version = 0x20000000  # 版本号
    prev_block_hash = b'0' * 32  # 前一区块哈希
    merkle_root = b'1' * 32      # Merkle根
    timestamp = int(time.time())  # 时间戳
    difficulty_bits = 0x207fffff  # 难度目标
    
    # 构建区块头（不包含nonce）
    header = struct.pack("<I", version)           # 4字节版本
    header += prev_block_hash                     # 32字节前块哈希
    header += merkle_root                         # 32字节Merkle根
    header += struct.pack("<I", timestamp)       # 4字节时间戳
    header += struct.pack("<I", difficulty_bits) # 4字节难度位
    # nonce将在挖矿时添加                         # 4字节nonce
    
    print(f"区块头长度: {len(header)} 字节")
    print(f"版本: {version}")
    print(f"时间戳: {timestamp}")
    print(f"难度位: {hex(difficulty_bits)}")
    
    return header

def mining_hardware_evolution():
    """挖矿硬件进化历史"""
    print("=== 挖矿硬件进化史 ===")
    
    hardware_generations = [
        {
            "era": "CPU时代",
            "period": "2009-2010",
            "device": "Intel Core i7",
            "hashrate_mhs": 20,
            "power_watts": 130,
            "efficiency": 0.15  # MH/J
        },
        {
            "era": "GPU时代", 
            "period": "2010-2013",
            "device": "AMD Radeon HD 5970",
            "hashrate_mhs": 600,
            "power_watts": 300,
            "efficiency": 2.0
        },
        {
            "era": "FPGA时代",
            "period": "2011-2013", 
            "device": "Butterfly Labs BitForce",
            "hashrate_mhs": 832,
            "power_watts": 80,
            "efficiency": 10.4
        },
        {
            "era": "ASIC时代",
            "period": "2013-至今",
            "device": "Antminer S21 (2024)",
            "hashrate_mhs": 200000000,  # 200 TH/s
            "power_watts": 3550,
            "efficiency": 56338  # 约56 GH/J
        }
    ]
    
    for hw in hardware_generations:
        print(f"{hw['era']} ({hw['period']}):")
        print(f"  设备: {hw['device']}")
        print(f"  算力: {hw['hashrate_mhs']:,} MH/s")
        print(f"  功耗: {hw['power_watts']} W")
        print(f"  效率: {hw['efficiency']:.2f} MH/J")
        print()

class ASICMiner:
    """ASIC矿机模拟"""
    def __init__(self, model="Antminer S21"):
        self.models = {
            "Antminer S21": {"hashrate_th": 200, "power_w": 3550, "price_usd": 5000},
            "Antminer S19j Pro": {"hashrate_th": 104, "power_w": 3068, "price_usd": 3000},
            "WhatsMiner M50": {"hashrate_th": 126, "power_w": 3306, "price_usd": 3500},
        }
        self.model = model
        self.specs = self.models[model]
    
    def calculate_mining_stats(self, bitcoin_price=50000, electricity_cost=0.1):
        """计算挖矿统计数据"""
        # 基础数据
        network_hashrate_th = 400_000_000  # 400 EH/s
        block_reward_btc = 3.125
        blocks_per_day = 144  # 每10分钟一个区块
        
        # 每日产出计算
        miner_hashrate = self.specs["hashrate_th"]
        hashrate_share = miner_hashrate / network_hashrate_th
        daily_btc = block_reward_btc * blocks_per_day * hashrate_share
        daily_revenue = daily_btc * bitcoin_price
        
        # 电力成本
        daily_power_kwh = self.specs["power_w"] * 24 / 1000
        daily_electricity_cost = daily_power_kwh * electricity_cost
        
        # 净利润
        daily_profit = daily_revenue - daily_electricity_cost
        
        # 回本时间
        payback_days = self.specs["price_usd"] / daily_profit if daily_profit > 0 else float('inf')
        
        return {
            "model": self.model,
            "daily_btc": daily_btc,
            "daily_revenue": daily_revenue,
            "daily_electricity_cost": daily_electricity_cost,
            "daily_profit": daily_profit,
            "payback_days": payback_days,
            "efficiency_js": miner_hashrate * 1e12 / self.specs["power_w"]  # H/J
        }

def solo_mining_vs_pool_mining():
    """单人挖矿 vs 矿池挖矿对比"""
    print("=== 单人挖矿 vs 矿池挖矿 ===")
    
    # 假设参数
    miner_hashrate_th = 100  # 100 TH/s
    network_hashrate_eh = 400  # 400 EH/s
    block_reward = 3.125  # BTC
    bitcoin_price = 50000  # USD
    
    # 单人挖矿分析
    network_hashrate_th = network_hashrate_eh * 1000
    prob_find_block = miner_hashrate_th / network_hashrate_th
    expected_time_days = 1 / (prob_find_block * 144)  # 144个区块/天
    
    print("单人挖矿:")
    print(f"  算力占比: {prob_find_block*100:.4f}%")
    print(f"  期望出块时间: {expected_time_days:.1f} 天")
    print(f"  单次收益: {block_reward * bitcoin_price:,.0f} USD")
    print(f"  收益方差: 极高（要么全有，要么全无）")
    
    # 矿池挖矿分析
    pool_fee = 0.02  # 2%手续费
    daily_expected_blocks = 144 * prob_find_block
    daily_pool_revenue = daily_expected_blocks * block_reward * (1 - pool_fee)
    
    print("\n矿池挖矿:")
    print(f"  预期日收益: {daily_pool_revenue:.8f} BTC")
    print(f"  预期日收益: {daily_pool_revenue * bitcoin_price:.2f} USD")
    print(f"  收益方差: 低（稳定的小额收益）")
    print(f"  矿池手续费: {pool_fee*100}%")

class MiningPool:
    """矿池实现模拟"""
    def __init__(self, pool_name="Bitcoin Pool"):
        self.pool_name = pool_name
        self.miners = {}  # 矿工信息
        self.shares_submitted = {}  # 提交的份额
        self.total_hashrate = 0
        self.blocks_found = 0
        self.total_rewards = 0
        self.pool_fee = 0.02  # 2%手续费
    
    def add_miner(self, miner_id, hashrate):
        """添加矿工"""
        self.miners[miner_id] = {
            'hashrate': hashrate,
            'shares': 0,
            'rewards': 0
        }
        self.shares_submitted[miner_id] = 0
        self.total_hashrate += hashrate
        print(f"矿工 {miner_id} 加入矿池，算力: {hashrate} TH/s")
    
    def submit_share(self, miner_id, share_hash, difficulty):
        """提交工作份额"""
        if miner_id not in self.miners:
            return False
        
        # 验证份额有效性（简化）
        hash_int = int(share_hash, 16)
        target = 0x00000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF // difficulty
        
        if hash_int < target:
            self.shares_submitted[miner_id] += 1
            self.miners[miner_id]['shares'] += 1
            
            # 检查是否找到有效区块
            block_target = target // 1000  # 假设区块难度更高
            if hash_int < block_target:
                self.blocks_found += 1
                self.distribute_block_reward(miner_id)
                return True
        
        return False
    
    def distribute_block_reward(self, finder_miner_id):
        """分配区块奖励"""
        block_reward = 3.125  # BTC
        pool_reward = block_reward * (1 - self.pool_fee)
        self.total_rewards += pool_reward
        
        print(f"\n🎉 矿工 {finder_miner_id} 找到新区块！")
        print(f"区块奖励: {block_reward} BTC")
        print(f"矿池手续费: {block_reward * self.pool_fee:.6f} BTC")
        print(f"矿工分配: {pool_reward:.6f} BTC")
        
        # 按份额分配（PPS模式简化）
        total_shares = sum(self.shares_submitted.values())
        if total_shares > 0:
            for miner_id in self.miners:
                miner_shares = self.shares_submitted[miner_id]
                miner_reward = pool_reward * (miner_shares / total_shares)
                self.miners[miner_id]['rewards'] += miner_reward
                print(f"  {miner_id}: {miner_reward:.8f} BTC (份额: {miner_shares})")
    
    def get_pool_stats(self):
        """获取矿池统计"""
        return {
            'pool_name': self.pool_name,
            'total_miners': len(self.miners),
            'total_hashrate': self.total_hashrate,
            'blocks_found': self.blocks_found,
            'total_rewards': self.total_rewards,
            'miners': self.miners
        }

def mining_profitability_analysis():
    """挖矿盈利能力分析"""
    print("=== 挖矿盈利能力分析 ===")
    
    # 市场变量
    bitcoin_prices = [30000, 50000, 70000, 100000]  # BTC价格场景
    electricity_costs = [0.05, 0.10, 0.15, 0.20]   # 电力成本 $/kWh
    
    # ASIC矿机参数
    asic = ASICMiner("Antminer S21")
    
    print("不同市场条件下的挖矿盈利分析:\n")
    print("BTC价格\t电费\t日收益\t日成本\t日利润\t回本时间")
    print("-" * 60)
    
    for btc_price in bitcoin_prices:
        for elec_cost in electricity_costs:
            stats = asic.calculate_mining_stats(btc_price, elec_cost)
            
            payback_str = f"{stats['payback_days']:.0f}天" if stats['payback_days'] != float('inf') else "亏损"
            
            print(f"${btc_price:,}\t${elec_cost}\t${stats['daily_revenue']:.0f}\t"
                  f"${stats['daily_electricity_cost']:.0f}\t"
                  f"${stats['daily_profit']:.0f}\t{payback_str}")
    
    # 盈亏平衡分析
    print(f"\n盈亏平衡分析 (Antminer S21):")
    print(f"设备成本: ${asic.specs['price_usd']:,}")
    print(f"算力: {asic.specs['hashrate_th']} TH/s") 
    print(f"功耗: {asic.specs['power_w']} W")

def difficulty_revenue_relationship():
    """难度与收益关系分析"""
    print("=== 难度与收益关系 ===")
    
    # 历史难度变化趋势
    difficulty_scenarios = [
        {"period": "2024年初", "difficulty": 70e12, "network_hashrate_eh": 400},
        {"period": "2024年中", "difficulty": 85e12, "network_hashrate_eh": 500},
        {"period": "2024年末", "difficulty": 100e12, "network_hashrate_eh": 600},
        {"period": "2025年预测", "difficulty": 120e12, "network_hashrate_eh": 720}
    ]
    
    miner_hashrate_th = 100  # 固定矿机算力
    block_reward = 3.125
    bitcoin_price = 50000
    
    print("期间\t\t难度\t\t全网算力\t日产BTC\t日收益")
    print("-" * 70)
    
    for scenario in difficulty_scenarios:
        # 计算该难度下的日收益
        hashrate_share = miner_hashrate_th / (scenario["network_hashrate_eh"] * 1000)
        daily_btc = block_reward * 144 * hashrate_share  # 144个区块/天
        daily_revenue = daily_btc * bitcoin_price
        
        print(f"{scenario['period']}\t{scenario['difficulty']:.1e}\t"
              f"{scenario['network_hashrate_eh']} EH/s\t"
              f"{daily_btc:.8f}\t${daily_revenue:.0f}")

class BitcoinMiningSimulator:
    """比特币挖矿完整模拟器"""
    def __init__(self):
        self.miners = {}
        self.blockchain = []
        self.current_block = {
            'height': len(self.blockchain),
            'difficulty': 0x207fffff,
            'reward': 3.125,
            'timestamp': time.time()
        }
        self.network_hashrate = 0
        self.running = False
        
    def add_miner(self, miner_id, hashrate_th):
        """添加矿工到网络"""
        self.miners[miner_id] = {
            'hashrate_th': hashrate_th,
            'blocks_found': 0,
            'total_rewards': 0,
            'active': True
        }
        self.network_hashrate += hashrate_th
        print(f"矿工 {miner_id} 加入网络，算力: {hashrate_th} TH/s")
    
    def simulate_mining_attempt(self, miner):
        """模拟单次挖矿尝试"""
        miner_id = miner['id']
        hashrate = self.miners[miner_id]['hashrate_th']
        
        # 基于算力计算成功概率
        success_prob = hashrate / self.network_hashrate
        
        # 模拟挖矿时间（泊松分布）
        time.sleep(random.exponential(10.0))  # 平均10秒一次尝试
        
        if random.random() < success_prob:
            return self.mine_block(miner_id)
        
        return False
    
    def mine_block(self, winning_miner):
        """挖到新区块"""
        self.current_block['height'] = len(self.blockchain)
        self.current_block['miner'] = winning_miner
        self.current_block['timestamp'] = time.time()
        
        # 添加到区块链
        self.blockchain.append(self.current_block.copy())
        
        # 奖励矿工
        self.miners[winning_miner]['blocks_found'] += 1
        self.miners[winning_miner]['total_rewards'] += self.current_block['reward']
        
        print(f"\n🎉 矿工 {winning_miner} 挖到第 {self.current_block['height']} 号区块！")
        print(f"区块奖励: {self.current_block['reward']} BTC")
        print(f"总区块数: {len(self.blockchain)}")
        
        # 模拟难度调整（简化）
        if len(self.blockchain) % 10 == 0:
            self.adjust_difficulty()
        
        return True
    
    def adjust_difficulty(self):
        """难度调整算法（简化）"""
        if len(self.blockchain) < 10:
            return
        
        # 计算最近10个区块的平均出块时间
        recent_blocks = self.blockchain[-10:]
        total_time = recent_blocks[-1]['timestamp'] - recent_blocks[0]['timestamp']
        avg_block_time = total_time / 9  # 9个间隔
        
        # 目标时间10分钟 = 600秒
        target_time = 600
        adjustment_factor = target_time / avg_block_time
        
        # 限制调整幅度（±25%）
        adjustment_factor = max(0.75, min(1.25, adjustment_factor))
        
        old_difficulty = self.current_block['difficulty']
        self.current_block['difficulty'] = int(old_difficulty * adjustment_factor)
        
        print(f"难度调整: {adjustment_factor:.2f}x")
        print(f"平均出块时间: {avg_block_time:.0f}秒")
    
    def run_mining_simulation(self, duration_minutes=60):
        """运行挖矿模拟"""
        print(f"\n=== 开始 {duration_minutes} 分钟挖矿模拟 ===")
        print(f"参与矿工: {len(self.miners)}")
        print(f"总算力: {self.network_hashrate} TH/s")
        
        self.running = True
        start_time = time.time()
        threads = []
        
        # 为每个矿工启动挖矿线程
        def mining_worker(miner):
            miner_id = miner['id']
            while self.running and time.time() - start_time < duration_minutes * 60:
                if self.miners[miner_id]['active']:
                    self.simulate_mining_attempt(miner)
        
        for miner_id in self.miners:
            miner_data = {'id': miner_id}
            thread = threading.Thread(target=mining_worker, args=(miner_data,))
            thread.daemon = True
            thread.start()
            threads.append(thread)
        
        # 等待模拟完成
        time.sleep(duration_minutes * 60)
        self.running = False
        
        # 等待所有线程结束
        for thread in threads:
            thread.join(timeout=1)
        
        self.print_simulation_results(duration_minutes)
    
    def print_simulation_results(self, duration_minutes):
        """打印模拟结果"""
        print(f"\n=== {duration_minutes}分钟模拟结果 ===")
        print(f"总区块数: {len(self.blockchain)}")
        print(f"平均出块时间: {duration_minutes*60/len(self.blockchain):.1f}秒")
        
        print("\n矿工统计:")
        print("矿工ID\t\t算力(TH/s)\t出块数\t总奖励(BTC)")
        print("-" * 50)
        
        for miner_id, stats in self.miners.items():
            print(f"{miner_id}\t{stats['hashrate_th']}\t\t"
                  f"{stats['blocks_found']}\t{stats['total_rewards']:.3f}")
        
        # 理论vs实际对比
        print("\n理论vs实际对比:")
        total_rewards = sum(stats['total_rewards'] for stats in self.miners.values())
        expected_blocks = duration_minutes / 10  # 预期区块数
        
        print(f"预期区块数: {expected_blocks}")
        print(f"实际区块数: {len(self.blockchain)}")
        print(f"总奖励分配: {total_rewards:.3f} BTC")

def run_mining_demo():
    """运行挖矿演示"""
    print("=== 比特币挖矿完整演示 ===")
    
    # 1. 基础概念演示
    print("\n1. 工作量证明概念:")
    proof_of_work_concept()
    
    # 2. 单向函数演示  
    print("\n2. 单向函数特性:")
    one_way_function_demo()
    
    # 3. 挖矿概率分析
    print("\n3. 挖矿概率分析:")
    mining_probability()
    
    # 4. 硬件进化史
    print("\n4. 挖矿硬件进化:")
    mining_hardware_evolution()
    
    # 5. ASIC矿机分析
    print("\n5. ASIC矿机性能:")
    asic = ASICMiner("Antminer S21")
    stats = asic.calculate_mining_stats()
    print(f"型号: {stats['model']}")
    print(f"日产BTC: {stats['daily_btc']:.8f}")
    print(f"日收益: ${stats['daily_revenue']:.2f}")
    print(f"日成本: ${stats['daily_electricity_cost']:.2f}")
    print(f"日利润: ${stats['daily_profit']:.2f}")
    print(f"回本时间: {stats['payback_days']:.0f}天")
    
    # 6. 矿池vs单人挖矿
    print("\n6. 挖矿模式对比:")
    solo_mining_vs_pool_mining()
    
    # 7. 盈利能力分析
    print("\n7. 盈利能力分析:")
    mining_profitability_analysis()

def bitcoin_energy_consumption_2025():
    """2025年比特币能耗分析"""
    print("=== 2025年比特币能耗分析 ===")
    
    # 全网统计数据
    network_hashrate_eh = 400  # EH/s
    avg_efficiency_js = 25e12  # J/s per EH/s (25 TH/J)
    
    # 能耗计算
    total_power_mw = (network_hashrate_eh * 1e18) / avg_efficiency_js / 1e6
    daily_energy_gwh = total_power_mw * 24 / 1000
    annual_energy_twh = daily_energy_gwh * 365 / 1000
    
    print(f"全网算力: {network_hashrate_eh} EH/s")
    print(f"平均效率: {avg_efficiency_js/1e12:.0f} TH/J")  
    print(f"总功耗: {total_power_mw:,.0f} MW")
    print(f"日能耗: {daily_energy_gwh:.1f} GWh")
    print(f"年能耗: {annual_energy_twh:.1f} TWh")
    
    # 对比其他行业
    comparisons = [
        ("全球银行系统", 263.7),
        ("黄金开采", 240.6),
        ("数据中心", 200.0),
        ("游戏产业", 75.0),
        ("Netflix", 0.45)
    ]
    
    print("\n能耗对比 (TWh/年):")
    print(f"比特币: {annual_energy_twh:.1f}")
    for name, consumption in comparisons:
        print(f"{name}: {consumption}")

def mining_value_assessment():
    """挖矿价值评估框架"""
    print("=== 挖矿价值评估 ===")
    
    # 网络安全价值
    network_value_usd = 1_000_000_000_000  # 1万亿美元市值
    security_budget_percentage = 0.5  # 0.5%的市值用于安全
    annual_security_budget = network_value_usd * security_budget_percentage / 100
    
    print("网络安全价值:")
    print(f"比特币市值: ${network_value_usd:,}")
    print(f"安全预算占比: {security_budget_percentage}%")
    print(f"年度安全预算: ${annual_security_budget:,}")
    
    # 去中心化价值  
    mining_pools = ["AntPool", "Foundry USA", "F2Pool", "ViaBTC", "其他"]
    hashrate_distribution = [0.20, 0.16, 0.13, 0.09, 0.42]  # 算力分布
    
    print("\n去中心化指标:")
    print("矿池\t\t算力占比")
    print("-" * 25)
    for pool, share in zip(mining_pools, hashrate_distribution):
        print(f"{pool}\t{share*100:.1f}%")
    
    # Nakamoto系数（控制51%算力需要的实体数）
    sorted_shares = sorted(hashrate_distribution, reverse=True)
    cumsum = 0
    nakamoto_coefficient = 0
    for share in sorted_shares:
        cumsum += share
        nakamoto_coefficient += 1
        if cumsum > 0.51:
            break
    
    print(f"\nNakamoto系数: {nakamoto_coefficient}")
    print("(控制51%算力需要的最少矿池数)")

def individual_mining_feasibility():
    """个人挖矿可行性评估"""
    print("=== 个人挖矿可行性评估 ===")
    
    scenarios = [
        {
            "name": "家庭小规模",
            "miners": 1,
            "model": "Antminer S19j Pro", 
            "electricity_cost": 0.15,
            "setup_cost": 500
        },
        {
            "name": "车库矿场",
            "miners": 10,
            "model": "Antminer S21",
            "electricity_cost": 0.10,
            "setup_cost": 5000
        },
        {
            "name": "专业矿场",
            "miners": 100,
            "model": "Antminer S21",
            "electricity_cost": 0.06,
            "setup_cost": 50000
        }
    ]
    
    bitcoin_price = 50000
    
    print("场景\t\t设备数\t投资额\t日利润\t年化收益率")
    print("-" * 55)
    
    for scenario in scenarios:
        if scenario["model"] == "Antminer S21":
            asic = ASICMiner("Antminer S21")
        else:
            asic = ASICMiner("Antminer S19j Pro")
        
        stats = asic.calculate_mining_stats(bitcoin_price, scenario["electricity_cost"])
        
        total_investment = (asic.specs["price_usd"] * scenario["miners"] + 
                          scenario["setup_cost"])
        daily_profit = stats["daily_profit"] * scenario["miners"]
        annual_return = (daily_profit * 365 / total_investment * 100) if total_investment > 0 else 0
        
        print(f"{scenario['name']}\t{scenario['miners']}\t"
              f"${total_investment:,}\t${daily_profit:.0f}\t{annual_return:.1f}%")

if __name__ == "__main__":
    print("比特币挖矿全面演示")
    print("=" * 50)
    
    # 选择要运行的演示
    demos = [
        ("基础概念演示", proof_of_work_concept),
        ("完整挖矿演示", run_mining_demo),  
        ("能耗分析", bitcoin_energy_consumption_2025),
        ("价值评估", mining_value_assessment),
        ("可行性分析", individual_mining_feasibility)
    ]
    
    print("可用演示:")
    for i, (name, _) in enumerate(demos, 1):
        print(f"{i}. {name}")
    
    try:
        choice = 1  # 自动运行基础概念演示
        if 1 <= choice <= len(demos):
            print(f"\n运行: {demos[choice-1][0]}")
            demos[choice-1][1]()
        else:
            print("无效选择")
    except (ValueError, KeyboardInterrupt):
        print("\n运行基础概念演示...")
        proof_of_work_concept()