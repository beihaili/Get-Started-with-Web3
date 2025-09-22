#!/usr/bin/env python3
"""
BIP 324加密通信协议演示
演示比特币P2P网络的加密传输协议
"""

import hashlib
import secrets
import time
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend


class BIP324Protocol:
    """BIP 324 v2传输协议实现"""
    
    def __init__(self):
        self.version = 2  # v2传输协议
        self.encryption_enabled = True
        self.authentication_enabled = True
        self.private_key = None
        self.public_key = None
        self.shared_secret = None
        self.session_keys = None
        
    def generate_key_pair(self):
        """生成椭圆曲线密钥对"""
        # 使用secp256k1曲线
        self.private_key = ec.generate_private_key(ec.SECP256K1(), default_backend())
        self.public_key = self.private_key.public_key()
        
        print("生成密钥对完成")
        return self.public_key
    
    def perform_ecdh(self, peer_public_key):
        """执行椭圆曲线Diffie-Hellman密钥交换"""
        if not self.private_key:
            raise ValueError("本地私钥未初始化")
        
        # 执行ECDH
        self.shared_secret = self.private_key.exchange(ec.ECDH(), peer_public_key)
        print(f"ECDH完成，共享密钥长度: {len(self.shared_secret)} 字节")
        
        return self.shared_secret
    
    def derive_session_keys(self, shared_secret, salt=b""):
        """派生会话密钥"""
        # 使用HKDF派生多个密钥
        hkdf = HKDF(
            algorithm=hashes.SHA256(),
            length=64,  # 派生64字节，用于多个密钥
            salt=salt,
            info=b"bip324_session_keys",
            backend=default_backend()
        )
        
        derived_keys = hkdf.derive(shared_secret)
        
        # 分割派生的密钥
        self.session_keys = {
            'send_key': derived_keys[:16],      # 发送加密密钥
            'recv_key': derived_keys[16:32],    # 接收加密密钥
            'send_mac': derived_keys[32:48],    # 发送MAC密钥
            'recv_mac': derived_keys[48:64],    # 接收MAC密钥
        }
        
        print("会话密钥派生完成")
        return self.session_keys
    
    def establish_encrypted_connection(self, peer_public_key):
        """建立加密连接"""
        print("建立BIP 324加密连接...")
        
        # 1. 生成本地密钥对
        if not self.private_key:
            self.generate_key_pair()
        
        # 2. 执行ECDH密钥交换
        shared_secret = self.perform_ecdh(peer_public_key)
        
        # 3. 派生会话密钥
        salt = secrets.token_bytes(16)  # 随机盐值
        self.derive_session_keys(shared_secret, salt)
        
        print("加密连接建立成功")
        return True
    
    def encrypt_message(self, plaintext):
        """加密消息"""
        if not self.session_keys:
            raise ValueError("会话密钥未建立")
        
        # 使用ChaCha20-Poly1305加密（简化演示，使用AES-GCM）
        nonce = secrets.token_bytes(12)  # 12字节随机nonce
        
        cipher = Cipher(
            algorithms.AES(self.session_keys['send_key']),
            modes.GCM(nonce),
            backend=default_backend()
        )
        
        encryptor = cipher.encryptor()
        ciphertext = encryptor.update(plaintext.encode()) + encryptor.finalize()
        
        # 返回nonce + ciphertext + tag
        encrypted_data = nonce + ciphertext + encryptor.tag
        
        print(f"消息加密完成，密文长度: {len(encrypted_data)} 字节")
        return encrypted_data
    
    def decrypt_message(self, encrypted_data):
        """解密消息"""
        if not self.session_keys:
            raise ValueError("会话密钥未建立")
        
        # 分离nonce、密文和tag
        nonce = encrypted_data[:12]
        tag = encrypted_data[-16:]
        ciphertext = encrypted_data[12:-16]
        
        cipher = Cipher(
            algorithms.AES(self.session_keys['recv_key']),
            modes.GCM(nonce, tag),
            backend=default_backend()
        )
        
        decryptor = cipher.decryptor()
        plaintext = decryptor.update(ciphertext) + decryptor.finalize()
        
        print(f"消息解密完成，明文长度: {len(plaintext)} 字节")
        return plaintext.decode()
    
    def get_connection_info(self):
        """获取连接信息"""
        return {
            'protocol_version': self.version,
            'encryption_enabled': self.encryption_enabled,
            'authentication_enabled': self.authentication_enabled,
            'has_session_keys': bool(self.session_keys),
            'public_key_available': bool(self.public_key)
        }


class P2PEncryptedConnection:
    """加密的P2P连接"""
    
    def __init__(self, node_id):
        self.node_id = node_id
        self.protocol = BIP324Protocol()
        self.is_encrypted = False
        
    def initiate_handshake(self, peer_protocol):
        """发起加密握手"""
        print(f"{self.node_id} 发起BIP 324握手...")
        
        # 1. 生成本地密钥对
        my_public_key = self.protocol.generate_key_pair()
        
        # 2. 获取对等节点公钥
        peer_public_key = peer_protocol.generate_key_pair()
        
        # 3. 建立加密连接
        success = self.protocol.establish_encrypted_connection(peer_public_key)
        
        if success:
            self.is_encrypted = True
            print(f"{self.node_id} 加密握手成功")
        
        return success
    
    def send_encrypted_message(self, message):
        """发送加密消息"""
        if not self.is_encrypted:
            raise ValueError("连接未加密")
        
        encrypted = self.protocol.encrypt_message(message)
        print(f"{self.node_id} 发送加密消息: {message[:50]}...")
        return encrypted
    
    def receive_encrypted_message(self, encrypted_data):
        """接收加密消息"""
        if not self.is_encrypted:
            raise ValueError("连接未加密")
        
        plaintext = self.protocol.decrypt_message(encrypted_data)
        print(f"{self.node_id} 接收解密消息: {plaintext[:50]}...")
        return plaintext


def demo_bip324_encryption():
    """演示BIP 324加密通信"""
    print("=== BIP 324加密通信演示 ===")
    
    # 创建两个节点
    alice = P2PEncryptedConnection("Alice")
    bob = P2PEncryptedConnection("Bob")
    
    print("\n1. 建立加密连接...")
    
    # Alice发起与Bob的加密握手
    handshake_success = alice.initiate_handshake(bob.protocol)
    
    if handshake_success:
        # 同步Bob的会话密钥（简化处理）
        bob.protocol.session_keys = alice.protocol.session_keys.copy()
        # 交换发送和接收密钥
        bob.protocol.session_keys['send_key'], bob.protocol.session_keys['recv_key'] = \
            bob.protocol.session_keys['recv_key'], bob.protocol.session_keys['send_key']
        bob.protocol.session_keys['send_mac'], bob.protocol.session_keys['recv_mac'] = \
            bob.protocol.session_keys['recv_mac'], bob.protocol.session_keys['send_mac']
        bob.is_encrypted = True
        
        print("\n2. 测试加密消息传输...")
        
        # Alice发送消息给Bob
        message1 = "Hello Bob! This is an encrypted message from Alice."
        encrypted_msg1 = alice.send_encrypted_message(message1)
        decrypted_msg1 = bob.receive_encrypted_message(encrypted_msg1)
        print(f"消息验证: {message1 == decrypted_msg1}")
        
        # Bob回复Alice
        message2 = "Hi Alice! I received your encrypted message successfully."
        encrypted_msg2 = bob.send_encrypted_message(message2)
        decrypted_msg2 = alice.receive_encrypted_message(encrypted_msg2)
        print(f"消息验证: {message2 == decrypted_msg2}")
        
        print("\n3. 连接信息:")
        print(f"Alice: {alice.protocol.get_connection_info()}")
        print(f"Bob: {bob.protocol.get_connection_info()}")
        
        print("\n✓ BIP 324加密通信演示成功完成")
    else:
        print("✗ 加密握手失败")


def compare_protocols():
    """比较v1和v2协议"""
    print("\n=== 协议版本比较 ===")
    
    comparison = {
        '特性': ['传输加密', '前向安全', '流量分析抗性', '认证', '向后兼容'],
        'v1协议': ['❌', '❌', '❌', '❌', '✅'],
        'v2协议(BIP324)': ['✅', '✅', '✅', '✅', '✅']
    }
    
    print(f"{'特性':<15} {'v1协议':<10} {'v2协议(BIP324)'}")
    print("-" * 40)
    for i, feature in enumerate(comparison['特性']):
        v1 = comparison['v1协议'][i]
        v2 = comparison['v2协议(BIP324)'][i]
        print(f"{feature:<15} {v1:<10} {v2}")
    
    print("\nBIP 324优势:")
    print("• 端到端加密保护隐私")
    print("• 防止被动监听和流量分析")
    print("• 抵御中间人攻击")
    print("• 保持与旧版本的兼容性")


if __name__ == "__main__":
    try:
        demo_bip324_encryption()
        compare_protocols()
    except ImportError:
        print("缺少cryptography库，请安装: pip install cryptography")
        print("演示BIP 324概念性功能...")
        
        # 概念演示（不需要加密库）
        protocol = BIP324Protocol()
        print(f"协议信息: {protocol.get_connection_info()}")
        compare_protocols()