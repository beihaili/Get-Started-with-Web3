# 比特币网络安全核心代码示例

import hashlib
import hmac
import secrets
import time
from typing import List, Dict

# 1. 51%攻击成本分析
class Attack51Analyzer:
    def __init__(self):
        self.network_hashrate = 400_000_000  # TH/s
        self.antminer_s19_hashrate = 95      # TH/s
        self.antminer_s19_price = 2000       # USD
        
    def calculate_attack_cost(self):
        """计算51%攻击成本"""
        required_hashrate = self.network_hashrate * 0.51
        required_miners = required_hashrate / self.antminer_s19_hashrate
        hardware_cost = required_miners * self.antminer_s19_price
        
        return {
            "需要算力": f"{required_hashrate:,.0f} TH/s",
            "需要矿机": f"{required_miners:,.0f} 台",
            "硬件成本": f"${hardware_cost:,.0f}",
            "电费成本": f"${self._calculate_electricity_cost(required_hashrate):,.0f}/月",
            "可行性": "几乎不可能" if hardware_cost > 1_000_000_000 else "有风险"
        }
    
    def _calculate_electricity_cost(self, hashrate):
        """计算电费成本"""
        power_per_th = 34.5  # W/TH
        electricity_price = 0.05  # $/kWh
        hours_per_month = 24 * 30
        
        total_power_kw = (hashrate * power_per_th) / 1000
        monthly_cost = total_power_kw * hours_per_month * electricity_price
        return monthly_cost

# 2. 钱包安全实践
class WalletSecurity:
    def __init__(self):
        self.security_levels = {
            "硬件钱包": {"安全级别": 5, "用途": "长期储存"},
            "桌面钱包": {"安全级别": 4, "用途": "日常使用"},
            "手机钱包": {"安全级别": 3, "用途": "小额支付"},
            "在线钱包": {"安全级别": 2, "用途": "临时使用"},
            "交易所": {"安全级别": 1, "用途": "交易时"}
        }
    
    def generate_secure_seed(self):
        """生成安全的助记词种子"""
        # 生成128位随机熵
        entropy = secrets.token_bytes(16)
        
        # 计算校验和
        checksum = hashlib.sha256(entropy).digest()[0] >> 4
        
        # 组合熵和校验和
        full_entropy = entropy + bytes([checksum])
        
        return {
            "原始熵": entropy.hex(),
            "校验和": hex(checksum),
            "完整种子": full_entropy.hex(),
            "安全建议": "请在离线环境中生成并备份"
        }
    
    def create_multisig_wallet(self, required_sigs, total_keys):
        """创建多重签名钱包配置"""
        if required_sigs > total_keys:
            raise ValueError("所需签名数不能大于总密钥数")
        
        config = {
            "类型": f"{required_sigs}-of-{total_keys} 多重签名",
            "安全级别": "高" if required_sigs > 1 else "中",
            "容错能力": f"可丢失 {total_keys - required_sigs} 个密钥",
            "使用场景": self._get_multisig_use_case(required_sigs, total_keys)
        }
        
        return config
    
    def _get_multisig_use_case(self, required_sigs, total_keys):
        """获取多重签名使用场景建议"""
        if (required_sigs, total_keys) == (2, 3):
            return "个人资产保护，夫妻共同财产"
        elif (required_sigs, total_keys) == (3, 5):
            return "企业金库，董事会控制"
        elif required_sigs == 1:
            return "备份方案，防止密钥丢失"
        else:
            return "自定义安全需求"

# 3. 网络攻击检测
class NetworkSecurityMonitor:
    def __init__(self):
        self.peer_connections = {}
        self.suspicious_behaviors = []
        
    def analyze_peer_behavior(self, peer_id, actions):
        """分析节点行为，检测潜在威胁"""
        risk_score = 0
        warnings = []
        
        # 检查连接时间
        if actions.get('connection_time', 0) < 60:
            risk_score += 10
            warnings.append("连接时间过短")
        
        # 检查消息频率
        if actions.get('message_rate', 0) > 100:
            risk_score += 20
            warnings.append("消息发送频率异常")
        
        # 检查无效消息比例
        if actions.get('invalid_messages', 0) > 5:
            risk_score += 30
            warnings.append("发送大量无效消息")
        
        # 检查地理位置
        if actions.get('same_subnet_peers', 0) > 10:
            risk_score += 15
            warnings.append("同一子网节点过多")
        
        threat_level = self._calculate_threat_level(risk_score)
        
        return {
            "节点ID": peer_id,
            "风险分数": risk_score,
            "威胁级别": threat_level,
            "警告": warnings,
            "建议行动": self._get_recommended_action(threat_level)
        }
    
    def _calculate_threat_level(self, risk_score):
        """计算威胁级别"""
        if risk_score >= 50:
            return "高危"
        elif risk_score >= 30:
            return "中危"
        elif risk_score >= 10:
            return "低危"
        else:
            return "正常"
    
    def _get_recommended_action(self, threat_level):
        """获取建议行动"""
        actions = {
            "高危": "立即断开连接并加入黑名单",
            "中危": "限制连接并加强监控",
            "低危": "标记观察，继续监控",
            "正常": "保持正常连接"
        }
        return actions.get(threat_level, "继续观察")

# 4. 密码学安全验证
class CryptographicSecurity:
    def __init__(self):
        self.hash_algorithms = ['sha256', 'ripemd160']
        
    def verify_transaction_integrity(self, transaction_data, signature, public_key):
        """验证交易完整性（简化版本）"""
        # 计算交易哈希
        tx_hash = hashlib.sha256(transaction_data.encode()).hexdigest()
        
        # 模拟签名验证（实际需要椭圆曲线算法）
        expected_signature = hmac.new(
            public_key.encode(), 
            tx_hash.encode(), 
            hashlib.sha256
        ).hexdigest()
        
        is_valid = hmac.compare_digest(signature, expected_signature)
        
        return {
            "交易哈希": tx_hash,
            "签名有效": is_valid,
            "验证时间": time.time(),
            "安全等级": "高" if is_valid else "无效"
        }
    
    def check_hash_strength(self, hash_value):
        """检查哈希强度"""
        leading_zeros = len(hash_value) - len(hash_value.lstrip('0'))
        
        strength_levels = {
            0: "弱",
            1: "低",
            4: "中",
            8: "高", 
            12: "极高"
        }
        
        strength = "弱"
        for zeros, level in sorted(strength_levels.items(), reverse=True):
            if leading_zeros >= zeros:
                strength = level
                break
        
        return {
            "哈希值": hash_value,
            "前导零": leading_zeros,
            "强度等级": strength,
            "挖矿难度": 2 ** leading_zeros
        }

# 5. 量子抗性评估
class QuantumResistanceAnalyzer:
    def __init__(self):
        self.current_algorithms = {
            "ECDSA": {"量子抗性": False, "替代方案": "Falcon"},
            "SHA256": {"量子抗性": True, "安全级别": "高"},
            "RIPEMD160": {"量子抗性": True, "安全级别": "中"}
        }
    
    def assess_quantum_threat(self):
        """评估量子威胁"""
        assessment = {
            "当前风险": "低（量子计算机尚未成熟）",
            "预计威胁时间": "10-20年后",
            "受影响组件": ["数字签名", "密钥生成"],
            "安全组件": ["哈希函数", "工作量证明"],
            "应对措施": [
                "使用一次性地址",
                "关注后量子密码学发展",
                "支持协议升级提案",
                "分散风险，不要过度集中资产"
            ]
        }
        return assessment

# 演示代码
if __name__ == "__main__":
    print("🔒 比特币网络安全分析演示\n")
    
    # 51%攻击成本分析
    print("1. 51%攻击成本分析:")
    attack_analyzer = Attack51Analyzer()
    attack_cost = attack_analyzer.calculate_attack_cost()
    for key, value in attack_cost.items():
        print(f"   {key}: {value}")
    
    print("\n2. 钱包安全配置:")
    wallet_security = WalletSecurity()
    
    # 多重签名配置
    multisig_config = wallet_security.create_multisig_wallet(2, 3)
    for key, value in multisig_config.items():
        print(f"   {key}: {value}")
    
    print("\n3. 网络威胁检测:")
    monitor = NetworkSecurityMonitor()
    
    # 模拟可疑节点行为
    suspicious_peer = {
        'connection_time': 30,
        'message_rate': 150,
        'invalid_messages': 8,
        'same_subnet_peers': 15
    }
    
    threat_analysis = monitor.analyze_peer_behavior("peer_123", suspicious_peer)
    for key, value in threat_analysis.items():
        print(f"   {key}: {value}")
    
    print("\n4. 密码学验证:")
    crypto_security = CryptographicSecurity()
    
    # 模拟哈希强度检查
    sample_hash = "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"
    hash_analysis = crypto_security.check_hash_strength(sample_hash)
    for key, value in hash_analysis.items():
        print(f"   {key}: {value}")
    
    print("\n5. 量子威胁评估:")
    quantum_analyzer = QuantumResistanceAnalyzer()
    threat_assessment = quantum_analyzer.assess_quantum_threat()
    
    for key, value in threat_assessment.items():
        if isinstance(value, list):
            print(f"   {key}:")
            for item in value:
                print(f"     - {item}")
        else:
            print(f"   {key}: {value}")
