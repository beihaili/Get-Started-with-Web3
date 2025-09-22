"""
比特币借贷协议实现
展示基于比特币的DeFi借贷平台核心功能
"""

import time
from typing import Dict, List, Optional
from datetime import datetime

class BitcoinLendingPool:
    """比特币借贷池"""
    
    def __init__(self, asset: str, parameters: Dict):
        self.asset = asset
        self.parameters = parameters
        self.total_supplied = 0
        self.total_borrowed = 0
        self.interest_rate = parameters.get('base_rate', 0.05)
        self.utilization_rate = 0
        self.lenders: Dict[str, Dict] = {}
        self.borrowers: Dict[str, Dict] = {}
        self.reserves = 0
        
    def supply(self, lender_address: str, amount: int) -> bool:
        """向池子供应资金"""
        supply_rate = self._calculate_supply_rate()
        
        # 更新lender信息
        if lender_address not in self.lenders:
            self.lenders[lender_address] = {
                'supplied_amount': 0,
                'earned_interest': 0,
                'last_update': time.time()
            }
        
        lender = self.lenders[lender_address]
        
        # 计算累积利息
        time_elapsed = time.time() - lender['last_update']
        interest_earned = lender['supplied_amount'] * supply_rate * time_elapsed / (365 * 24 * 3600)
        lender['earned_interest'] += interest_earned
        
        # 增加供应量
        lender['supplied_amount'] += amount
        lender['last_update'] = time.time()
        
        self.total_supplied += amount
        self._update_rates()
        
        return True
    
    def borrow(self, borrower_address: str, amount: int, collateral_info: Dict) -> bool:
        """从池子借贷资金"""
        # 检查抵押品价值
        collateral_value = self._calculate_collateral_value(collateral_info)
        ltv_ratio = amount / collateral_value if collateral_value > 0 else float('inf')
        
        if ltv_ratio > self.parameters.get('max_ltv', 0.8):
            return False  # 抵押不足
        
        # 检查池子流动性
        available_liquidity = self.total_supplied - self.total_borrowed
        if available_liquidity < amount:
            return False  # 流动性不足
        
        # 更新borrower信息
        if borrower_address not in self.borrowers:
            self.borrowers[borrower_address] = {
                'borrowed_amount': 0,
                'collateral': {},
                'interest_owed': 0,
                'last_update': time.time(),
                'health_factor': 0
            }
        
        borrower = self.borrowers[borrower_address]
        
        # 计算累积利息
        borrow_rate = self._calculate_borrow_rate()
        time_elapsed = time.time() - borrower['last_update']
        interest_accrued = borrower['borrowed_amount'] * borrow_rate * time_elapsed / (365 * 24 * 3600)
        borrower['interest_owed'] += interest_accrued
        
        # 增加借贷量
        borrower['borrowed_amount'] += amount
        borrower['collateral'].update(collateral_info)
        borrower['last_update'] = time.time()
        borrower['health_factor'] = self._calculate_health_factor(borrower)
        
        self.total_borrowed += amount
        self._update_rates()
        
        return True
    
    def liquidate(self, borrower_address: str) -> Optional[Dict]:
        """清算头寸"""
        if borrower_address not in self.borrowers:
            return None
        
        borrower = self.borrowers[borrower_address]
        
        # 更新健康因子
        borrower['health_factor'] = self._calculate_health_factor(borrower)
        
        # 检查是否需要清算
        liquidation_threshold = self.parameters.get('liquidation_threshold', 0.85)
        if borrower['health_factor'] >= liquidation_threshold:
            return None  # 不需要清算
        
        # 执行清算
        total_debt = borrower['borrowed_amount'] + borrower['interest_owed']
        liquidation_bonus = total_debt * self.parameters.get('liquidation_bonus', 0.05)
        
        # 计算清算金额
        collateral_value = self._calculate_collateral_value(borrower['collateral'])
        liquidation_amount = min(total_debt + liquidation_bonus, collateral_value)
        
        # 记录清算事件
        liquidation_record = {
            'borrower': borrower_address,
            'debt_amount': total_debt,
            'collateral_seized': liquidation_amount,
            'timestamp': time.time(),
            'liquidator': 'system'
        }
        
        # 清理borrower记录
        self.total_borrowed -= borrower['borrowed_amount']
        del self.borrowers[borrower_address]
        
        self._update_rates()
        
        return liquidation_record
    
    def _calculate_supply_rate(self) -> float:
        """计算供应利率"""
        utilization = self.total_borrowed / self.total_supplied if self.total_supplied > 0 else 0
        borrow_rate = self._calculate_borrow_rate()
        return borrow_rate * utilization * (1 - self.parameters.get('reserve_factor', 0.1))
    
    def _calculate_borrow_rate(self) -> float:
        """计算借贷利率"""
        utilization = self.total_borrowed / self.total_supplied if self.total_supplied > 0 else 0
        base_rate = self.parameters.get('base_rate', 0.05)
        slope1 = self.parameters.get('slope1', 0.1)
        slope2 = self.parameters.get('slope2', 1.0)
        optimal_utilization = self.parameters.get('optimal_utilization', 0.8)
        
        if utilization <= optimal_utilization:
            return base_rate + (utilization / optimal_utilization) * slope1
        else:
            excess_utilization = (utilization - optimal_utilization) / (1 - optimal_utilization)
            return base_rate + slope1 + excess_utilization * slope2
    
    def _calculate_health_factor(self, borrower: Dict) -> float:
        """计算健康因子"""
        collateral_value = self._calculate_collateral_value(borrower['collateral'])
        total_debt = borrower['borrowed_amount'] + borrower['interest_owed']
        
        if total_debt == 0:
            return float('inf')
        
        return collateral_value / total_debt
    
    def _calculate_collateral_value(self, collateral_info: Dict) -> float:
        """计算抵押品价值"""
        # 简化的价格获取和计算
        prices = {'BTC': 45000, 'ETH': 3000, 'USDT': 1}
        liquidation_thresholds = {'BTC': 0.8, 'ETH': 0.75, 'USDT': 0.9}
        
        total_value = 0
        for asset, amount in collateral_info.items():
            price = prices.get(asset, 0)
            threshold = liquidation_thresholds.get(asset, 0.5)
            asset_value = amount * price * threshold
            total_value += asset_value
        
        return total_value
    
    def _update_rates(self):
        """更新利率"""
        self.utilization_rate = self.total_borrowed / self.total_supplied if self.total_supplied > 0 else 0
        self.interest_rate = self._calculate_borrow_rate()

class BitcoinDeFiStrategy:
    """比特币DeFi投资策略"""
    
    def __init__(self):
        self.strategies = {
            'conservative': {
                'lending': 0.8,
                'lightning_routing': 0.2,
                'expected_yield': 0.05,
                'risk_level': 'low'
            },
            'balanced': {
                'lending': 0.5,
                'liquidity_providing': 0.3,
                'lightning_routing': 0.2,
                'expected_yield': 0.08,
                'risk_level': 'medium'
            },
            'aggressive': {
                'liquidity_providing': 0.6,
                'yield_farming': 0.3,
                'lending': 0.1,
                'expected_yield': 0.15,
                'risk_level': 'high'
            }
        }
    
    def calculate_optimal_allocation(self, user_funds: int, risk_tolerance: str) -> Dict:
        """计算最优资金分配策略"""
        if risk_tolerance not in self.strategies:
            risk_tolerance = 'balanced'
        
        strategy = self.strategies[risk_tolerance]
        allocation = {}
        
        for protocol, percentage in strategy.items():
            if protocol in ['lending', 'liquidity_providing', 'lightning_routing', 'yield_farming']:
                allocation[protocol] = {
                    'amount': int(user_funds * percentage),
                    'percentage': percentage,
                    'expected_yield': strategy['expected_yield'],
                    'risk_level': strategy['risk_level']
                }
        
        return allocation
    
    def calculate_portfolio_yield(self, positions: Dict, time_period_days: int) -> Dict:
        """计算投资组合收益"""
        total_value = sum(pos['amount'] for pos in positions.values())
        total_yield = 0
        
        for protocol, position in positions.items():
            # 简化的收益计算
            daily_yield_rates = {
                'lending': 0.05 / 365,
                'liquidity_providing': 0.12 / 365,
                'lightning_routing': 0.03 / 365,
                'yield_farming': 0.20 / 365
            }
            
            daily_rate = daily_yield_rates.get(protocol, 0)
            protocol_yield = position['amount'] * daily_rate * time_period_days
            total_yield += protocol_yield
        
        return {
            'total_investment': total_value,
            'total_yield': total_yield,
            'yield_rate': total_yield / total_value if total_value > 0 else 0,
            'annualized_yield': (total_yield / total_value) * (365 / time_period_days) if total_value > 0 else 0
        }

if __name__ == "__main__":
    # 借贷池示例
    print("=== 比特币借贷池示例 ===")
    
    pool_params = {
        'base_rate': 0.05,
        'slope1': 0.1,
        'slope2': 1.0,
        'optimal_utilization': 0.8,
        'max_ltv': 0.75,
        'liquidation_threshold': 0.85,
        'liquidation_bonus': 0.05,
        'reserve_factor': 0.1
    }
    
    pool = BitcoinLendingPool('BTC', pool_params)
    
    # Alice供应资金
    pool.supply('alice', 1000000)  # 1 BTC
    print(f"Alice供应后，池子总供应量: {pool.total_supplied} satoshis")
    
    # Bob借贷资金
    collateral = {'ETH': 2}  # 2 ETH作为抵押
    pool.borrow('bob', 500000, collateral)  # 借0.5 BTC
    print(f"Bob借贷后，池子总借贷量: {pool.total_borrowed} satoshis")
    print(f"当前利用率: {pool.utilization_rate:.2%}")
    
    # DeFi策略示例
    print("\n=== DeFi投资策略示例 ===")
    strategy = BitcoinDeFiStrategy()
    
    user_funds = 5000000  # 5 BTC
    allocation = strategy.calculate_optimal_allocation(user_funds, 'balanced')
    
    print(f"投资策略分配 (总资金: {user_funds} satoshis):")
    for protocol, details in allocation.items():
        print(f"  {protocol}: {details['amount']} satoshis ({details['percentage']:.1%})")
    
    # 计算30天收益
    yield_result = strategy.calculate_portfolio_yield(allocation, 30)
    print(f"\n30天预期收益:")
    print(f"  总投资: {yield_result['total_investment']} satoshis")
    print(f"  总收益: {yield_result['total_yield']:.0f} satoshis")
    print(f"  收益率: {yield_result['yield_rate']:.2%}")
    print(f"  年化收益率: {yield_result['annualized_yield']:.2%}")