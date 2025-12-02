#!/usr/bin/env python3
"""
比特币DeFi风险管理工具

本文件包含：
1. 投资组合风险计算
2. 清算风险监控
3. 智能合约安全检查
4. 价格预言机工具
5. 风险预警系统

用于辅助DeFi投资决策和风险控制
"""

import math
import time
import json
import hashlib
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import statistics


class PriceOracle:
    """价格预言机模拟器"""
    
    def __init__(self):
        self.prices = {
            'BTC': 45000.0,
            'ETH': 3000.0,
            'USDT': 1.0,
            'WBTC': 44950.0,  # 略低于BTC，反映包装成本
        }
        self.price_history = {asset: [price] for asset, price in self.prices.items()}
        self.last_update = time.time()
        
    def update_prices(self, price_updates: Dict[str, float] = None):
        """更新价格（模拟市场波动）"""
        if price_updates:
            for asset, price in price_updates.items():
                if asset in self.prices:
                    self.prices[asset] = price
        else:
            # 模拟随机波动
            import secrets
            for asset in self.prices:
                if asset == 'USDT':  # 稳定币波动很小
                    volatility = 0.001
                else:
                    volatility = 0.02  # 2%日波动
                
                change = (secrets.randbelow(200) - 100) / 100 * volatility
                self.prices[asset] *= (1 + change)
        
        # 记录历史价格
        for asset, price in self.prices.items():
            self.price_history[asset].append(price)
            
        self.last_update = time.time()
    
    def get_price(self, asset: str) -> float:
        """获取当前价格"""
        return self.prices.get(asset, 0.0)
    
    def get_price_change_24h(self, asset: str) -> float:
        """获取24小时价格变化"""
        history = self.price_history.get(asset, [])
        if len(history) < 2:
            return 0.0
        return (history[-1] - history[-2]) / history[-2]
    
    def calculate_volatility(self, asset: str, periods: int = 30) -> float:
        """计算历史波动率"""
        history = self.price_history.get(asset, [])
        if len(history) < periods:
            return 0.2  # 默认20%波动率
        
        recent_prices = history[-periods:]
        returns = []
        
        for i in range(1, len(recent_prices)):
            ret = (recent_prices[i] - recent_prices[i-1]) / recent_prices[i-1]
            returns.append(ret)
        
        if not returns:
            return 0.2
        
        return statistics.stdev(returns) * math.sqrt(365)  # 年化波动率


class PortfolioRiskManager:
    """投资组合风险管理器"""
    
    def __init__(self, oracle: PriceOracle):
        self.oracle = oracle
        self.risk_free_rate = 0.02  # 2% 无风险利率
        
        # 资产相关性矩阵
        self.correlations = {
            ('BTC', 'ETH'): 0.7,
            ('BTC', 'WBTC'): 0.98,
            ('BTC', 'USDT'): 0.1,
            ('ETH', 'WBTC'): 0.65,
            ('ETH', 'USDT'): 0.1,
            ('WBTC', 'USDT'): 0.1,
        }
    
    def calculate_portfolio_metrics(self, positions: Dict[str, dict]) -> dict:
        """计算投资组合指标"""
        total_value = sum(pos['amount'] * self.oracle.get_price(asset) 
                         for asset, pos in positions.items())
        
        if total_value == 0:
            return {'error': '投资组合价值为零'}
        
        # 计算权重
        weights = {}
        for asset, pos in positions.items():
            asset_value = pos['amount'] * self.oracle.get_price(asset)
            weights[asset] = asset_value / total_value
        
        # 计算预期收益
        portfolio_return = 0
        for asset, weight in weights.items():
            expected_return = positions[asset].get('expected_return', 0.05)
            portfolio_return += weight * expected_return
        
        # 计算波动率
        portfolio_variance = 0
        assets = list(weights.keys())
        
        # 计算单个资产贡献的方差
        for asset in assets:
            volatility = self.oracle.calculate_volatility(asset)
            portfolio_variance += (weights[asset] ** 2) * (volatility ** 2)
        
        # 计算协方差贡献
        for i, asset1 in enumerate(assets):
            for asset2 in assets[i+1:]:
                correlation = self._get_correlation(asset1, asset2)
                vol1 = self.oracle.calculate_volatility(asset1)
                vol2 = self.oracle.calculate_volatility(asset2)
                
                covariance = correlation * vol1 * vol2
                portfolio_variance += 2 * weights[asset1] * weights[asset2] * covariance
        
        portfolio_volatility = math.sqrt(portfolio_variance)
        
        # 计算VaR (Value at Risk)
        var_95 = total_value * portfolio_volatility * 1.645  # 95%置信区间
        var_99 = total_value * portfolio_volatility * 2.326  # 99%置信区间
        
        # 计算夏普比率
        excess_return = portfolio_return - self.risk_free_rate
        sharpe_ratio = excess_return / portfolio_volatility if portfolio_volatility > 0 else 0
        
        return {
            'total_value': total_value,
            'portfolio_return': portfolio_return,
            'portfolio_volatility': portfolio_volatility,
            'sharpe_ratio': sharpe_ratio,
            'var_95': var_95,
            'var_99': var_99,
            'weights': weights,
            'risk_level': self._categorize_risk(portfolio_volatility)
        }
    
    def _get_correlation(self, asset1: str, asset2: str) -> float:
        """获取资产相关性"""
        if asset1 == asset2:
            return 1.0
        
        key = tuple(sorted([asset1, asset2]))
        return self.correlations.get(key, 0.3)  # 默认相关性30%
    
    def _categorize_risk(self, volatility: float) -> str:
        """风险等级分类"""
        if volatility < 0.1:
            return "低风险"
        elif volatility < 0.3:
            return "中等风险"
        elif volatility < 0.5:
            return "高风险"
        else:
            return "极高风险"
    
    def monte_carlo_simulation(self, positions: Dict[str, dict], 
                              days: int = 30, simulations: int = 1000) -> dict:
        """蒙特卡罗风险模拟"""
        initial_value = sum(pos['amount'] * self.oracle.get_price(asset) 
                           for asset, pos in positions.items())
        
        final_values = []
        
        for _ in range(simulations):
            portfolio_value = initial_value
            
            for day in range(days):
                daily_return = 0
                
                for asset, pos in positions.items():
                    weight = (pos['amount'] * self.oracle.get_price(asset)) / portfolio_value
                    
                    # 生成随机收益
                    volatility = self.oracle.calculate_volatility(asset) / math.sqrt(365)
                    expected_return = pos.get('expected_return', 0.05) / 365
                    
                    import secrets
                    random_factor = (secrets.randbelow(2000) - 1000) / 1000  # -1 to 1
                    
                    asset_return = expected_return + volatility * random_factor
                    daily_return += weight * asset_return
                
                portfolio_value *= (1 + daily_return)
            
            final_values.append(portfolio_value)
        
        final_values.sort()
        
        return {
            'initial_value': initial_value,
            'simulations': simulations,
            'days': days,
            'percentiles': {
                '5%': final_values[int(simulations * 0.05)],
                '25%': final_values[int(simulations * 0.25)],
                '50%': final_values[int(simulations * 0.50)],
                '75%': final_values[int(simulations * 0.75)],
                '95%': final_values[int(simulations * 0.95)],
            },
            'expected_value': sum(final_values) / len(final_values),
            'worst_case': min(final_values),
            'best_case': max(final_values)
        }


class LiquidationRiskMonitor:
    """清算风险监控器"""
    
    def __init__(self, oracle: PriceOracle):
        self.oracle = oracle
        self.lending_pools = {}
        self.borrowers = {}
        
    def add_borrower(self, borrower_id: str, borrowed_asset: str, borrowed_amount: float,
                    collateral_assets: Dict[str, float], ltv_ratio: float = 0.75):
        """添加借贷者信息"""
        self.borrowers[borrower_id] = {
            'borrowed_asset': borrowed_asset,
            'borrowed_amount': borrowed_amount,
            'collateral_assets': collateral_assets,
            'ltv_ratio': ltv_ratio,
            'liquidation_threshold': ltv_ratio * 1.1,  # 清算阈值比LTV高10%
            'created_time': time.time()
        }
    
    def calculate_health_factor(self, borrower_id: str) -> float:
        """计算健康因子"""
        if borrower_id not in self.borrowers:
            return 0.0
        
        borrower = self.borrowers[borrower_id]
        
        # 计算抵押品价值
        collateral_value = 0
        for asset, amount in borrower['collateral_assets'].items():
            price = self.oracle.get_price(asset)
            collateral_value += amount * price
        
        # 计算债务价值
        debt_value = (borrower['borrowed_amount'] * 
                     self.oracle.get_price(borrower['borrowed_asset']))
        
        if debt_value == 0:
            return float('inf')
        
        # 健康因子 = (抵押品价值 × 清算阈值) / 债务价值
        health_factor = (collateral_value * borrower['liquidation_threshold']) / debt_value
        
        return health_factor
    
    def check_liquidation_risk(self) -> List[dict]:
        """检查清算风险"""
        at_risk_borrowers = []
        
        for borrower_id, borrower in self.borrowers.items():
            health_factor = self.calculate_health_factor(borrower_id)
            
            risk_level = "安全"
            if health_factor < 1.0:
                risk_level = "需要清算"
            elif health_factor < 1.2:
                risk_level = "高危"
            elif health_factor < 1.5:
                risk_level = "警告"
            
            if health_factor < 1.5:  # 只报告风险较高的
                at_risk_borrowers.append({
                    'borrower_id': borrower_id,
                    'health_factor': health_factor,
                    'risk_level': risk_level,
                    'borrowed_asset': borrower['borrowed_asset'],
                    'borrowed_amount': borrower['borrowed_amount'],
                    'collateral_value': sum(
                        amount * self.oracle.get_price(asset)
                        for asset, amount in borrower['collateral_assets'].items()
                    )
                })
        
        return at_risk_borrowers
    
    def simulate_price_impact(self, price_changes: Dict[str, float]) -> dict:
        """模拟价格变化对清算风险的影响"""
        # 保存当前价格
        original_prices = dict(self.oracle.prices)
        
        # 应用价格变化
        for asset, change in price_changes.items():
            if asset in self.oracle.prices:
                self.oracle.prices[asset] *= (1 + change)
        
        # 计算影响
        impact = {
            'price_changes': price_changes,
            'liquidations_triggered': [],
            'risk_changes': []
        }
        
        for borrower_id in self.borrowers:
            original_hf = self.calculate_health_factor(borrower_id)
            
            # 临时恢复原价格计算原始健康因子
            self.oracle.prices.update(original_prices)
            old_hf = self.calculate_health_factor(borrower_id)
            
            # 恢复新价格
            for asset, change in price_changes.items():
                if asset in self.oracle.prices:
                    self.oracle.prices[asset] = original_prices[asset] * (1 + change)
            
            new_hf = self.calculate_health_factor(borrower_id)
            
            if new_hf < 1.0 and old_hf >= 1.0:
                impact['liquidations_triggered'].append({
                    'borrower_id': borrower_id,
                    'old_health_factor': old_hf,
                    'new_health_factor': new_hf
                })
            
            if abs(new_hf - old_hf) > 0.1:  # 健康因子变化超过0.1
                impact['risk_changes'].append({
                    'borrower_id': borrower_id,
                    'old_health_factor': old_hf,
                    'new_health_factor': new_hf,
                    'change': new_hf - old_hf
                })
        
        # 恢复原始价格
        self.oracle.prices.update(original_prices)
        
        return impact


class ContractSecurityChecker:
    """智能合约安全检查器"""
    
    def __init__(self):
        self.vulnerability_patterns = {
            'reentrancy': [
                'external_call_before_state_change',
                'missing_reentrancy_guard',
                'state_modification_after_call'
            ],
            'integer_overflow': [
                'unchecked_arithmetic',
                'missing_safemath',
                'unsafe_cast'
            ],
            'access_control': [
                'missing_onlyowner',
                'public_sensitive_function',
                'weak_randomness'
            ],
            'price_manipulation': [
                'single_price_source',
                'flash_loan_vulnerable',
                'no_price_validation'
            ]
        }
    
    def analyze_contract(self, contract_code: str, contract_type: str = 'defi') -> dict:
        """分析合约安全性"""
        issues = []
        severity_scores = []
        
        # 检查各种漏洞模式
        for vulnerability, patterns in self.vulnerability_patterns.items():
            for pattern in patterns:
                if self._check_pattern(contract_code, pattern):
                    severity = self._get_severity(vulnerability, pattern)
                    issues.append({
                        'type': vulnerability,
                        'pattern': pattern,
                        'severity': severity,
                        'description': self._get_description(vulnerability, pattern),
                        'recommendation': self._get_recommendation(vulnerability, pattern)
                    })
                    severity_scores.append(severity)
        
        # 计算总体安全分数
        if severity_scores:
            avg_severity = sum(severity_scores) / len(severity_scores)
            security_score = max(0, 10 - avg_severity * 2)  # 10分制
        else:
            security_score = 10.0
        
        return {
            'security_score': security_score,
            'total_issues': len(issues),
            'critical_issues': len([i for i in issues if i['severity'] >= 4]),
            'issues': issues,
            'recommendations': self._generate_overall_recommendations(issues)
        }
    
    def _check_pattern(self, code: str, pattern: str) -> bool:
        """检查代码模式（简化版）"""
        code_lower = code.lower()
        
        pattern_checks = {
            'external_call_before_state_change': 'call' in code_lower and 'balance' in code_lower,
            'missing_reentrancy_guard': 'nonreentrant' not in code_lower,
            'unchecked_arithmetic': '+' in code_lower or '-' in code_lower,
            'missing_safemath': 'safemath' not in code_lower,
            'missing_onlyowner': 'onlyowner' not in code_lower and 'owner' in code_lower,
            'single_price_source': code_lower.count('getprice') == 1,
            'flash_loan_vulnerable': 'flashloan' in code_lower
        }
        
        return pattern_checks.get(pattern, False)
    
    def _get_severity(self, vulnerability: str, pattern: str) -> int:
        """获取漏洞严重程度 (1-5)"""
        severity_map = {
            'reentrancy': 5,
            'integer_overflow': 4,
            'access_control': 4,
            'price_manipulation': 3
        }
        return severity_map.get(vulnerability, 2)
    
    def _get_description(self, vulnerability: str, pattern: str) -> str:
        """获取漏洞描述"""
        descriptions = {
            'external_call_before_state_change': '在状态更改之前进行外部调用，可能导致重入攻击',
            'missing_reentrancy_guard': '缺少重入保护机制',
            'unchecked_arithmetic': '未检查的算术运算，可能导致溢出',
            'missing_safemath': '未使用SafeMath库进行安全运算',
            'missing_onlyowner': '缺少访问控制修饰符',
            'single_price_source': '依赖单一价格源，容易被操纵',
            'flash_loan_vulnerable': '可能存在闪电贷攻击漏洞'
        }
        return descriptions.get(pattern, '未知安全问题')
    
    def _get_recommendation(self, vulnerability: str, pattern: str) -> str:
        """获取修复建议"""
        recommendations = {
            'external_call_before_state_change': '在外部调用之前完成所有状态更改',
            'missing_reentrancy_guard': '添加ReentrancyGuard修饰符',
            'unchecked_arithmetic': '使用SafeMath库进行算术运算',
            'missing_safemath': '导入并使用OpenZeppelin的SafeMath库',
            'missing_onlyowner': '添加适当的访问控制修饰符',
            'single_price_source': '使用多个价格源并实现价格聚合',
            'flash_loan_vulnerable': '实现闪电贷保护机制'
        }
        return recommendations.get(pattern, '咨询安全专家')
    
    def _generate_overall_recommendations(self, issues: List[dict]) -> List[str]:
        """生成总体建议"""
        recommendations = []
        
        if any(i['severity'] >= 4 for i in issues):
            recommendations.append("存在高危漏洞，建议立即修复")
        
        if any(i['type'] == 'reentrancy' for i in issues):
            recommendations.append("实现完整的重入保护机制")
        
        if any(i['type'] == 'price_manipulation' for i in issues):
            recommendations.append("建立健壮的价格预言机系统")
        
        recommendations.extend([
            "进行完整的安全审计",
            "建立漏洞赏金计划",
            "实施渐进式部署策略"
        ])
        
        return recommendations


def demonstrate_risk_management():
    """演示风险管理功能"""
    print("=" * 60)
    print("比特币DeFi风险管理演示")
    print("=" * 60)
    
    # 创建价格预言机
    oracle = PriceOracle()
    print("1. 价格预言机初始化:")
    for asset, price in oracle.prices.items():
        print(f"   {asset}: ${price:,.2f}")
    
    # 创建投资组合风险管理器
    risk_manager = PortfolioRiskManager(oracle)
    
    # 示例投资组合
    portfolio = {
        'BTC': {'amount': 0.5, 'expected_return': 0.15},
        'ETH': {'amount': 2.0, 'expected_return': 0.20},
        'WBTC': {'amount': 0.3, 'expected_return': 0.12},
        'USDT': {'amount': 10000, 'expected_return': 0.05}
    }
    
    print("\n2. 投资组合风险分析:")
    metrics = risk_manager.calculate_portfolio_metrics(portfolio)
    print(f"   总价值: ${metrics['total_value']:,.2f}")
    print(f"   预期收益: {metrics['portfolio_return']:.2%}")
    print(f"   波动率: {metrics['portfolio_volatility']:.2%}")
    print(f"   夏普比率: {metrics['sharpe_ratio']:.2f}")
    print(f"   95% VaR: ${metrics['var_95']:,.2f}")
    print(f"   风险等级: {metrics['risk_level']}")
    
    # 蒙特卡罗模拟
    print("\n3. 蒙特卡罗模拟 (30天, 100次):")
    simulation = risk_manager.monte_carlo_simulation(portfolio, days=30, simulations=100)
    print(f"   初始价值: ${simulation['initial_value']:,.2f}")
    print(f"   预期价值: ${simulation['expected_value']:,.2f}")
    print(f"   最坏情况: ${simulation['worst_case']:,.2f}")
    print(f"   最好情况: ${simulation['best_case']:,.2f}")
    print("   百分位数:")
    for percentile, value in simulation['percentiles'].items():
        print(f"     {percentile}: ${value:,.2f}")
    
    # 清算风险监控
    print("\n4. 清算风险监控:")
    liquidation_monitor = LiquidationRiskMonitor(oracle)
    
    # 添加示例借贷者
    liquidation_monitor.add_borrower(
        "borrower_1", 
        "USDT", 15000,  # 借了15000 USDT
        {"BTC": 0.5, "ETH": 1.0},  # 抵押0.5 BTC + 1 ETH
        0.75
    )
    
    liquidation_monitor.add_borrower(
        "borrower_2",
        "USDT", 8000,   # 借了8000 USDT
        {"BTC": 0.3},   # 只抵押0.3 BTC
        0.75
    )
    
    at_risk = liquidation_monitor.check_liquidation_risk()
    print(f"   发现 {len(at_risk)} 个风险借贷者:")
    for borrower in at_risk:
        print(f"     {borrower['borrower_id']}: 健康因子 {borrower['health_factor']:.2f} - {borrower['risk_level']}")
    
    # 价格冲击模拟
    print("\n5. 价格冲击模拟:")
    price_shock = {'BTC': -0.2, 'ETH': -0.15}  # BTC跌20%, ETH跌15%
    impact = liquidation_monitor.simulate_price_impact(price_shock)
    print(f"   价格变化: BTC {price_shock['BTC']:.0%}, ETH {price_shock['ETH']:.0%}")
    print(f"   新增清算: {len(impact['liquidations_triggered'])} 个")
    print(f"   风险变化: {len(impact['risk_changes'])} 个")
    
    # 智能合约安全检查
    print("\n6. 智能合约安全检查:")
    security_checker = ContractSecurityChecker()
    
    # 模拟合约代码
    sample_contract = """
    contract DeFiPool {
        mapping(address => uint) public balances;
        
        function withdraw(uint amount) public {
            msg.sender.call{value: amount}("");
            balances[msg.sender] -= amount;
        }
        
        function getPrice() public view returns (uint) {
            return oracle.getPrice();
        }
    }
    """
    
    security_result = security_checker.analyze_contract(sample_contract)
    print(f"   安全分数: {security_result['security_score']:.1f}/10")
    print(f"   发现问题: {security_result['total_issues']} 个")
    print(f"   严重问题: {security_result['critical_issues']} 个")
    
    if security_result['issues']:
        print("   主要问题:")
        for issue in security_result['issues'][:3]:  # 显示前3个问题
            print(f"     - {issue['description']} (严重度: {issue['severity']}/5)")


if __name__ == "__main__":
    demonstrate_risk_management()