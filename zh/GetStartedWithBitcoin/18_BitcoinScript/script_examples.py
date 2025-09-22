# 比特币脚本系统核心代码示例

import hashlib
import secrets
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

# 1. 脚本操作码定义
class OpCode(Enum):
    """比特币脚本操作码"""
    # 常量操作
    OP_0 = 0x00
    OP_1 = 0x51
    OP_2 = 0x52
    OP_3 = 0x53
    OP_4 = 0x54
    OP_5 = 0x55
    OP_6 = 0x56
    OP_7 = 0x57
    OP_8 = 0x58
    OP_9 = 0x59
    OP_10 = 0x5a
    OP_11 = 0x5b
    OP_12 = 0x5c
    OP_13 = 0x5d
    OP_14 = 0x5e
    OP_15 = 0x5f
    OP_16 = 0x60
    
    # 栈操作
    OP_DUP = 0x76
    OP_DROP = 0x75
    OP_SWAP = 0x7c
    OP_ROT = 0x7b
    
    # 算术操作
    OP_ADD = 0x93
    OP_SUB = 0x94
    OP_MUL = 0x95  # 已禁用
    OP_DIV = 0x96  # 已禁用
    
    # 逻辑操作
    OP_EQUAL = 0x87
    OP_EQUALVERIFY = 0x88
    OP_NOT = 0x91
    
    # 密码学操作
    OP_HASH160 = 0xa9
    OP_HASH256 = 0xaa
    OP_SHA256 = 0xa8
    OP_RIPEMD160 = 0xa6
    OP_CHECKSIG = 0xac
    OP_CHECKSIGVERIFY = 0xad
    OP_CHECKMULTISIG = 0xae
    
    # 条件操作
    OP_IF = 0x63
    OP_ELSE = 0x67
    OP_ENDIF = 0x68
    
    # 时间锁操作
    OP_CHECKLOCKTIMEVERIFY = 0xb1
    OP_CHECKSEQUENCEVERIFY = 0xb2

@dataclass
class ScriptElement:
    """脚本元素"""
    op_code: Optional[OpCode]
    data: Optional[bytes]
    
    def __str__(self):
        if self.op_code:
            return self.op_code.name
        elif self.data:
            return f"PUSH({self.data.hex()})"
        return "EMPTY"

class ScriptExecutor:
    """比特币脚本执行器（简化版）"""
    
    def __init__(self):
        self.stack = []
        self.alt_stack = []
        
    def execute_script(self, script_elements: List[ScriptElement]) -> bool:
        """执行脚本"""
        try:
            for element in script_elements:
                if not self._execute_element(element):
                    return False
            
            # 脚本成功执行的条件：栈顶为真值
            return len(self.stack) > 0 and self._is_true(self.stack[-1])
            
        except Exception as e:
            print(f"脚本执行错误: {e}")
            return False
    
    def _execute_element(self, element: ScriptElement) -> bool:
        """执行单个脚本元素"""
        if element.data:
            # 数据压栈
            self.stack.append(element.data)
            return True
        
        if not element.op_code:
            return False
        
        op = element.op_code
        
        # 常量操作
        if op == OpCode.OP_0:
            self.stack.append(b'')
        elif op == OpCode.OP_1:
            self.stack.append(b'\x01')
        elif op in [OpCode.OP_2, OpCode.OP_3, OpCode.OP_4, OpCode.OP_5,
                   OpCode.OP_6, OpCode.OP_7, OpCode.OP_8, OpCode.OP_9,
                   OpCode.OP_10, OpCode.OP_11, OpCode.OP_12, OpCode.OP_13,
                   OpCode.OP_14, OpCode.OP_15, OpCode.OP_16]:
            value = op.value - 0x50
            self.stack.append(bytes([value]))
        
        # 栈操作
        elif op == OpCode.OP_DUP:
            if len(self.stack) < 1:
                return False
            self.stack.append(self.stack[-1])
        
        elif op == OpCode.OP_DROP:
            if len(self.stack) < 1:
                return False
            self.stack.pop()
        
        elif op == OpCode.OP_SWAP:
            if len(self.stack) < 2:
                return False
            self.stack[-1], self.stack[-2] = self.stack[-2], self.stack[-1]
        
        # 逻辑操作
        elif op == OpCode.OP_EQUAL:
            if len(self.stack) < 2:
                return False
            a = self.stack.pop()
            b = self.stack.pop()
            self.stack.append(b'\x01' if a == b else b'')
        
        elif op == OpCode.OP_EQUALVERIFY:
            if len(self.stack) < 2:
                return False
            a = self.stack.pop()
            b = self.stack.pop()
            if a != b:
                return False
        
        # 密码学操作
        elif op == OpCode.OP_HASH160:
            if len(self.stack) < 1:
                return False
            data = self.stack.pop()
            sha256_hash = hashlib.sha256(data).digest()
            ripemd160_hash = hashlib.new('ripemd160', sha256_hash).digest()
            self.stack.append(ripemd160_hash)
        
        elif op == OpCode.OP_SHA256:
            if len(self.stack) < 1:
                return False
            data = self.stack.pop()
            sha256_hash = hashlib.sha256(data).digest()
            self.stack.append(sha256_hash)
        
        elif op == OpCode.OP_CHECKSIG:
            # 简化版签名验证（实际需要椭圆曲线算法）
            if len(self.stack) < 2:
                return False
            pubkey = self.stack.pop()
            signature = self.stack.pop()
            # 这里是简化的验证，实际需要ECDSA
            is_valid = len(signature) == 64 and len(pubkey) == 33
            self.stack.append(b'\x01' if is_valid else b'')
        
        else:
            print(f"不支持的操作码: {op}")
            return False
        
        return True
    
    def _is_true(self, data: bytes) -> bool:
        """判断数据是否为真值"""
        return len(data) > 0 and data != b'\x00'

# 2. 标准脚本模式
class StandardScripts:
    """标准脚本模式"""
    
    @staticmethod
    def p2pkh_scriptpubkey(pubkey_hash: bytes) -> List[ScriptElement]:
        """P2PKH (Pay to Public Key Hash) 锁定脚本"""
        return [
            ScriptElement(OpCode.OP_DUP, None),
            ScriptElement(OpCode.OP_HASH160, None),
            ScriptElement(None, pubkey_hash),
            ScriptElement(OpCode.OP_EQUALVERIFY, None),
            ScriptElement(OpCode.OP_CHECKSIG, None)
        ]
    
    @staticmethod
    def p2pkh_scriptsig(signature: bytes, pubkey: bytes) -> List[ScriptElement]:
        """P2PKH 解锁脚本"""
        return [
            ScriptElement(None, signature),
            ScriptElement(None, pubkey)
        ]
    
    @staticmethod
    def p2sh_scriptpubkey(script_hash: bytes) -> List[ScriptElement]:
        """P2SH (Pay to Script Hash) 锁定脚本"""
        return [
            ScriptElement(OpCode.OP_HASH160, None),
            ScriptElement(None, script_hash),
            ScriptElement(OpCode.OP_EQUAL, None)
        ]
    
    @staticmethod
    def multisig_script(m: int, pubkeys: List[bytes]) -> List[ScriptElement]:
        """多重签名脚本 (m-of-n)"""
        n = len(pubkeys)
        if m > n or m < 1 or n > 16:
            raise ValueError("无效的多重签名参数")
        
        script = []
        
        # 添加 m
        if m == 1:
            script.append(ScriptElement(OpCode.OP_1, None))
        else:
            script.append(ScriptElement(OpCode(0x50 + m), None))
        
        # 添加公钥
        for pubkey in pubkeys:
            script.append(ScriptElement(None, pubkey))
        
        # 添加 n
        if n == 1:
            script.append(ScriptElement(OpCode.OP_1, None))
        else:
            script.append(ScriptElement(OpCode(0x50 + n), None))
        
        # 添加检查多重签名操作
        script.append(ScriptElement(OpCode.OP_CHECKMULTISIG, None))
        
        return script

# 3. 脚本分析器
class ScriptAnalyzer:
    """脚本分析器"""
    
    @staticmethod
    def analyze_script_type(script: List[ScriptElement]) -> str:
        """分析脚本类型"""
        if len(script) == 5:
            ops = [elem.op_code for elem in script if elem.op_code]
            if (ops == [OpCode.OP_DUP, OpCode.OP_HASH160, 
                       OpCode.OP_EQUALVERIFY, OpCode.OP_CHECKSIG]):
                return "P2PKH"
        
        if len(script) == 3:
            ops = [elem.op_code for elem in script if elem.op_code]
            if ops == [OpCode.OP_HASH160, OpCode.OP_EQUAL]:
                return "P2SH"
        
        # 检查多重签名
        if len(script) >= 4:
            if (script[0].op_code and script[-1].op_code == OpCode.OP_CHECKMULTISIG):
                return f"MultiSig"
        
        return "Custom"
    
    @staticmethod
    def estimate_script_size(script: List[ScriptElement]) -> int:
        """估算脚本大小（字节）"""
        size = 0
        for element in script:
            if element.op_code:
                size += 1  # 操作码占1字节
            if element.data:
                data_len = len(element.data)
                if data_len <= 75:
                    size += 1 + data_len  # 长度字节 + 数据
                elif data_len <= 255:
                    size += 2 + data_len  # OP_PUSHDATA1 + 长度字节 + 数据
                else:
                    size += 3 + data_len  # OP_PUSHDATA2 + 2字节长度 + 数据
        return size

# 4. 时间锁脚本
class TimeLockScripts:
    """时间锁脚本"""
    
    @staticmethod
    def absolute_timelock_script(locktime: int, pubkey_hash: bytes) -> List[ScriptElement]:
        """绝对时间锁脚本"""
        locktime_bytes = locktime.to_bytes(4, 'little')
        return [
            ScriptElement(None, locktime_bytes),
            ScriptElement(OpCode.OP_CHECKLOCKTIMEVERIFY, None),
            ScriptElement(OpCode.OP_DROP, None),
            ScriptElement(OpCode.OP_DUP, None),
            ScriptElement(OpCode.OP_HASH160, None),
            ScriptElement(None, pubkey_hash),
            ScriptElement(OpCode.OP_EQUALVERIFY, None),
            ScriptElement(OpCode.OP_CHECKSIG, None)
        ]
    
    @staticmethod
    def relative_timelock_script(sequence: int, pubkey_hash: bytes) -> List[ScriptElement]:
        """相对时间锁脚本"""
        sequence_bytes = sequence.to_bytes(4, 'little')
        return [
            ScriptElement(None, sequence_bytes),
            ScriptElement(OpCode.OP_CHECKSEQUENCEVERIFY, None),
            ScriptElement(OpCode.OP_DROP, None),
            ScriptElement(OpCode.OP_DUP, None),
            ScriptElement(OpCode.OP_HASH160, None),
            ScriptElement(None, pubkey_hash),
            ScriptElement(OpCode.OP_EQUALVERIFY, None),
            ScriptElement(OpCode.OP_CHECKSIG, None)
        ]

# 5. 脚本构建器
class ScriptBuilder:
    """脚本构建器"""
    
    def __init__(self):
        self.elements = []
    
    def add_op(self, op_code: OpCode) -> 'ScriptBuilder':
        """添加操作码"""
        self.elements.append(ScriptElement(op_code, None))
        return self
    
    def add_data(self, data: bytes) -> 'ScriptBuilder':
        """添加数据"""
        self.elements.append(ScriptElement(None, data))
        return self
    
    def add_number(self, number: int) -> 'ScriptBuilder':
        """添加数字"""
        if number == 0:
            self.elements.append(ScriptElement(OpCode.OP_0, None))
        elif 1 <= number <= 16:
            self.elements.append(ScriptElement(OpCode(0x50 + number), None))
        else:
            # 将数字转换为字节并添加
            data = number.to_bytes((number.bit_length() + 7) // 8, 'little')
            self.elements.append(ScriptElement(None, data))
        return self
    
    def build(self) -> List[ScriptElement]:
        """构建脚本"""
        return self.elements.copy()

# 演示代码
if __name__ == "__main__":
    print("比特币脚本系统完整演示")
    print("=" * 50)
    
    # 1. P2PKH脚本演示
    print("\n1. P2PKH (Pay to Public Key Hash) 脚本演示:")
    
    # 生成模拟的公钥哈希
    pubkey = secrets.token_bytes(33)  # 33字节公钥
    pubkey_hash = hashlib.new('ripemd160', hashlib.sha256(pubkey).digest()).digest()
    signature = secrets.token_bytes(64)  # 64字节签名
    
    # 创建P2PKH脚本
    scriptpubkey = StandardScripts.p2pkh_scriptpubkey(pubkey_hash)
    scriptsig = StandardScripts.p2pkh_scriptsig(signature, pubkey)
    
    print(f"锁定脚本: {' '.join(str(elem) for elem in scriptpubkey)}")
    print(f"解锁脚本: {' '.join(str(elem) for elem in scriptsig)}")
    
    # 执行脚本
    executor = ScriptExecutor()
    combined_script = scriptsig + scriptpubkey
    result = executor.execute_script(combined_script)
    print(f"执行结果: {'成功' if result else '失败'}")
    
    # 2. 脚本分析
    print("\n2. 脚本类型分析:")
    analyzer = ScriptAnalyzer()
    script_type = analyzer.analyze_script_type(scriptpubkey)
    script_size = analyzer.estimate_script_size(scriptpubkey)
    print(f"脚本类型: {script_type}")
    print(f"脚本大小: {script_size} 字节")
    
    # 3. 多重签名脚本演示
    print("\n3. 多重签名脚本演示:")
    pubkeys = [secrets.token_bytes(33) for _ in range(3)]
    multisig_script = StandardScripts.multisig_script(2, pubkeys)
    
    print(f"2-of-3多重签名脚本:")
    for i, elem in enumerate(multisig_script):
        print(f"  {i+1}. {elem}")
    
    multisig_type = analyzer.analyze_script_type(multisig_script)
    multisig_size = analyzer.estimate_script_size(multisig_script)
    print(f"脚本类型: {multisig_type}")
    print(f"脚本大小: {multisig_size} 字节")
    
    # 4. 时间锁脚本演示
    print("\n4. 时间锁脚本演示:")
    
    # 绝对时间锁（区块高度 800000）
    timelock_script = TimeLockScripts.absolute_timelock_script(800000, pubkey_hash)
    print(f"绝对时间锁脚本（区块高度800000）:")
    for i, elem in enumerate(timelock_script):
        print(f"  {i+1}. {elem}")
    
    timelock_size = analyzer.estimate_script_size(timelock_script)
    print(f"时间锁脚本大小: {timelock_size} 字节")
    
    # 5. 自定义脚本构建
    print("\n5. 自定义脚本构建演示:")
    
    builder = ScriptBuilder()
    custom_script = (builder
                    .add_number(10)
                    .add_number(5)
                    .add_op(OpCode.OP_ADD)
                    .add_number(15)
                    .add_op(OpCode.OP_EQUAL)
                    .build())
    
    print("自定义脚本 (10 + 5 == 15):")
    for i, elem in enumerate(custom_script):
        print(f"  {i+1}. {elem}")
    
    # 执行自定义脚本
    custom_executor = ScriptExecutor()
    custom_result = custom_executor.execute_script(custom_script)
    print(f"自定义脚本执行结果: {'成功' if custom_result else '失败'}")
    
    # 6. 脚本统计信息
    print("\n6. 脚本系统统计:")
    total_opcodes = len([op for op in OpCode])
    supported_opcodes = [
        OpCode.OP_0, OpCode.OP_1, OpCode.OP_DUP, OpCode.OP_DROP,
        OpCode.OP_EQUAL, OpCode.OP_EQUALVERIFY, OpCode.OP_HASH160,
        OpCode.OP_SHA256, OpCode.OP_CHECKSIG
    ]
    
    print(f"总操作码数量: {total_opcodes}")
    print(f"已实现操作码: {len(supported_opcodes)}")
    print(f"实现率: {len(supported_opcodes)/total_opcodes*100:.1f}%")
    
    print("\n注意：这是教学示例，实际生产环境需要:")
    print("- 完整的ECDSA签名验证")
    print("- 所有操作码的实现")
    print("- 完善的错误处理")
    print("- 安全性检查和限制")