#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
比特币密码学完整代码示例
包含本章节涉及的所有密码学操作实现

依赖安装:
pip install ecdsa mnemonic base58 cryptography

使用方法:
python crypto_examples.py
"""

import hashlib
import time
import ecdsa
from ecdsa import SigningKey, SECP256k1
import binascii
import secrets
import base58
import hmac
import struct
import os
import base64
from mnemonic import Mnemonic
from cryptography.fernet import Fernet

class BitcoinCrypto:
    """比特币密码学工具包"""
    
    def __init__(self):
        self.curve_params = {
            'p': 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F,
            'n': 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141,
            'Gx': 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798,
            'Gy': 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8
        }
    
    def sha256(self, data):
        """SHA-256哈希"""
        if isinstance(data, str):
            data = data.encode('utf-8')
        return hashlib.sha256(data).hexdigest()
    
    def double_sha256(self, data):
        """双重SHA-256（比特币标准）"""
        if isinstance(data, str):
            data = data.encode('utf-8')
        first = hashlib.sha256(data).digest()
        return hashlib.sha256(first).hexdigest()
    
    def demonstrate_avalanche_effect(self):
        """演示雪崩效应"""
        print("=== SHA-256雪崩效应演示 ===")
        original = "Hello Bitcoin"
        modified = "Hello bitcoin"
        
        print(f"原始: '{original}' -> {self.sha256(original)}")
        print(f"修改: '{modified}' -> {self.sha256(modified)}")
        print("结论: 微小改动导致完全不同的哈希值\n")
    
    def simple_proof_of_work(self, data, difficulty=4):
        """简化工作量证明演示"""
        print(f"=== 挖矿演示 (难度{difficulty}) ===")
        target = "0" * difficulty
        nonce = 0
        start_time = time.time()
        
        while True:
            test_data = f"{data}{nonce}"
            hash_result = self.sha256(test_data)
            
            if hash_result.startswith(target):
                elapsed = time.time() - start_time
                print(f"挖矿成功! Nonce: {nonce}, 耗时: {elapsed:.2f}秒")
                print(f"哈希: {hash_result}\n")
                break
            nonce += 1
    
    def generate_keypair(self):
        """生成比特币密钥对"""
        private_key = secrets.randbelow(self.curve_params['n'])
        signing_key = SigningKey.from_secret_exponent(private_key, curve=SECP256k1)
        
        return {
            'private_key': hex(private_key),
            'public_key_compressed': self.compress_public_key(signing_key.verifying_key),
            'signing_key': signing_key
        }
    
    def compress_public_key(self, verifying_key):
        """压缩公钥格式"""
        point = verifying_key.pubkey.point
        x, y = point.x(), point.y()
        prefix = '03' if y % 2 == 1 else '02'
        return prefix + f'{x:064x}'
    
    def sign_and_verify(self, message, keypair):
        """数字签名演示"""
        print("=== 数字签名演示 ===")
        print(f"消息: {message}")
        
        # 签名
        message_hash = hashlib.sha256(message.encode()).digest()
        signature = keypair['signing_key'].sign(message_hash)
        sig_hex = binascii.hexlify(signature).decode()
        
        print(f"签名: {sig_hex[:32]}...")
        
        # 验证
        try:
            keypair['signing_key'].verifying_key.verify(signature, message_hash)
            print("✅ 签名验证成功")
        except:
            print("❌ 签名验证失败")
        
        # 篡改测试
        tampered = message + "x"
        tampered_hash = hashlib.sha256(tampered.encode()).digest()
        try:
            keypair['signing_key'].verifying_key.verify(signature, tampered_hash)
            print("❌ 篡改消息验证成功（不应该发生）")
        except:
            print("✅ 篡改消息验证失败（正确行为）\n")
    
    def private_key_to_address(self, private_key_hex):
        """从私钥生成比特币地址"""
        print("=== 地址生成过程 ===")
        
        # 1. 生成公钥
        private_key_int = int(private_key_hex, 16)
        signing_key = SigningKey.from_secret_exponent(private_key_int, curve=SECP256k1)
        compressed_pubkey = self.compress_public_key(signing_key.verifying_key)
        print(f"1. 压缩公钥: {compressed_pubkey}")
        
        # 2. SHA-256
        pubkey_bytes = bytes.fromhex(compressed_pubkey)
        sha256_hash = hashlib.sha256(pubkey_bytes).digest()
        
        # 3. RIPEMD-160
        ripemd160_hash = hashlib.new('ripemd160', sha256_hash).digest()
        print(f"2. 公钥哈希: {ripemd160_hash.hex()}")
        
        # 4. 添加版本和校验和
        versioned = b'\x00' + ripemd160_hash
        checksum = hashlib.sha256(hashlib.sha256(versioned).digest()).digest()[:4]
        
        # 5. Base58编码
        address = base58.b58encode(versioned + checksum).decode()
        print(f"3. 比特币地址: {address}\n")
        
        return address

class HDWallet:
    """简化的HD钱包实现"""
    
    def __init__(self, mnemonic_phrase=None):
        self.mnemo = Mnemonic('english')
        
        if mnemonic_phrase is None:
            self.mnemonic = self.mnemo.generate(strength=128)  # 12个词
        else:
            if not self.mnemo.check(mnemonic_phrase):
                raise ValueError("无效的助记词")
            self.mnemonic = mnemonic_phrase
        
        # 生成种子
        self.seed = self.mnemo.to_seed(self.mnemonic)
        
        # 生成主私钥
        master_key = hmac.new(b"Bitcoin seed", self.seed, hashlib.sha512).digest()
        self.master_private_key = master_key[:32]
        self.master_chain_code = master_key[32:]
    
    def derive_child(self, parent_key, parent_chain, index):
        """派生子密钥"""
        if index >= 0x80000000:  # 硬化派生
            data = b'\x00' + parent_key + struct.pack('>I', index)
        else:  # 正常派生（简化实现）
            data = parent_key + struct.pack('>I', index)
        
        child_key = hmac.new(parent_chain, data, hashlib.sha512).digest()
        return child_key[:32], child_key[32:]
    
    def get_address(self, account=0, change=0, index=0):
        """获取指定路径的地址"""
        # 简化的BIP44路径派生 m/44'/0'/account'/change/index
        current_key = self.master_private_key
        current_chain = self.master_chain_code
        
        # 派生路径
        for i in [44 + 0x80000000, 0x80000000, account + 0x80000000, change, index]:
            current_key, current_chain = self.derive_child(current_key, current_chain, i)
        
        # 生成地址
        crypto = BitcoinCrypto()
        return crypto.private_key_to_address(current_key.hex())

class SecurityDemo:
    """安全最佳实践演示"""
    
    def secure_random_demo(self):
        """安全随机数生成演示"""
        print("=== 安全随机数生成 ===")
        
        # 不安全的方式
        import random
        unsafe = random.randint(1, 2**256)
        print(f"❌ random模块: {hex(unsafe)[:20]}...")
        
        # 安全的方式
        safe1 = secrets.randbelow(2**256)
        safe2 = int.from_bytes(os.urandom(32), 'big')
        
        print(f"✅ secrets模块: {hex(safe1)[:20]}...")
        print(f"✅ os.urandom: {hex(safe2)[:20]}...\n")
    
    def encrypt_private_key(self, private_key, password):
        """私钥加密示例"""
        print("=== 私钥加密演示 ===")
        
        # 使用PBKDF2派生密钥
        salt = os.urandom(16)
        key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
        key_base64 = base64.urlsafe_b64encode(key)
        
        # 加密私钥
        f = Fernet(key_base64)
        encrypted = f.encrypt(private_key.encode())
        
        print(f"原始私钥: {private_key}")
        print(f"盐值: {salt.hex()}")
        print(f"加密私钥: {encrypted.hex()[:32]}...")
        
        # 解密验证
        decrypted = f.decrypt(encrypted).decode()
        print(f"解密成功: {'✅' if decrypted == private_key else '❌'}\n")

def main():
    """主演示程序"""
    print("🔐 比特币密码学完整演示\n")
    
    # 初始化工具
    crypto = BitcoinCrypto()
    
    # 1. 哈希函数演示
    crypto.demonstrate_avalanche_effect()
    crypto.simple_proof_of_work("比特币区块", difficulty=3)
    
    # 2. 数字签名演示
    keypair = crypto.generate_keypair()
    crypto.sign_and_verify("从Alice转账1BTC给Bob", keypair)
    
    # 3. 地址生成演示
    test_private_key = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    crypto.private_key_to_address(test_private_key)
    
    # 4. HD钱包演示
    print("=== HD钱包演示 ===")
    hd_wallet = HDWallet()
    print(f"助记词: {hd_wallet.mnemonic}")
    
    # 生成几个地址
    for i in range(3):
        addr = hd_wallet.get_address(account=0, change=0, index=i)
        print(f"地址{i}: {addr}")
    print()
    
    # 5. 安全演示
    security = SecurityDemo()
    security.secure_random_demo()
    security.encrypt_private_key(test_private_key, "SecurePassword123!")
    
    print("🎉 演示完成！")

if __name__ == "__main__":
    main()
