"""
原子交换实现
展示跨链无信任交易的哈希时间锁合约(HTLC)机制
"""

import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Optional

class AtomicSwap:
    """原子交换协议实现"""
    
    def __init__(self, initiator: str, participant: str):
        self.initiator = initiator
        self.participant = participant
        self.secret: Optional[str] = None
        self.secret_hash: Optional[str] = None
        self.state = "initialized"
        self.contracts: Dict[str, Dict] = {}
        self.timeouts: Dict[str, datetime] = {}
    
    def initiate_swap(self, initiator_amount: int, participant_amount: int, timeout_hours: int = 24) -> Dict:
        """发起原子交换"""
        # 生成秘密和哈希
        self.secret = secrets.token_hex(32)
        self.secret_hash = hashlib.sha256(self.secret.encode()).hexdigest()
        
        # 设置超时时间
        timeout = datetime.now() + timedelta(hours=timeout_hours)
        self.timeouts['initiator'] = timeout
        self.timeouts['participant'] = timeout - timedelta(hours=12)
        
        # 创建发起者合约
        initiator_contract = self._create_htlc_contract(
            sender=self.initiator,
            recipient=self.participant,
            amount=initiator_amount,
            secret_hash=self.secret_hash,
            timeout=self.timeouts['initiator']
        )
        
        self.contracts['initiator'] = initiator_contract
        self.state = "initiated"
        
        return {
            'secret_hash': self.secret_hash,
            'contract': initiator_contract,
            'timeout': self.timeouts['participant']
        }
    
    def participate_swap(self, participant_amount: int) -> Optional[Dict]:
        """参与原子交换"""
        if self.state != "initiated":
            return None
        
        # 创建参与者合约
        participant_contract = self._create_htlc_contract(
            sender=self.participant,
            recipient=self.initiator,
            amount=participant_amount,
            secret_hash=self.secret_hash,
            timeout=self.timeouts['participant']
        )
        
        self.contracts['participant'] = participant_contract
        self.state = "participated"
        
        return participant_contract
    
    def _create_htlc_contract(self, sender: str, recipient: str, amount: int, 
                             secret_hash: str, timeout: datetime) -> Dict:
        """创建哈希时间锁合约 (HTLC)"""
        contract = {
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
            'secret_hash': secret_hash,
            'timeout': timeout,
            'redeemed': False,
            'refunded': False,
            'created_at': datetime.now()
        }
        return contract
    
    def redeem_initiator_contract(self, secret: str) -> bool:
        """参与者使用秘密赎回发起者的资金"""
        if self.state != "participated":
            return False
        
        # 验证秘密
        calculated_hash = hashlib.sha256(secret.encode()).hexdigest()
        if calculated_hash != self.secret_hash:
            return False
        
        contract = self.contracts['initiator']
        if datetime.now() > contract['timeout']:
            return False
        
        contract['redeemed'] = True
        contract['redeemed_at'] = datetime.now()
        self.state = "participant_redeemed"
        
        return True
    
    def redeem_participant_contract(self, secret: str) -> bool:
        """发起者使用秘密赎回参与者的资金"""
        if self.state != "participant_redeemed":
            return False
        
        # 验证秘密
        calculated_hash = hashlib.sha256(secret.encode()).hexdigest()
        if calculated_hash != self.secret_hash:
            return False
        
        contract = self.contracts['participant']
        if datetime.now() > contract['timeout']:
            return False
        
        contract['redeemed'] = True
        contract['redeemed_at'] = datetime.now()
        self.state = "completed"
        
        return True
    
    def refund_contracts(self) -> bool:
        """超时后退款"""
        current_time = datetime.now()
        refunded = False
        
        # 检查发起者合约退款
        if ('initiator' in self.contracts and 
            current_time > self.timeouts['initiator'] and 
            not self.contracts['initiator']['redeemed']):
            self.contracts['initiator']['refunded'] = True
            self.contracts['initiator']['refunded_at'] = current_time
            refunded = True
        
        # 检查参与者合约退款
        if ('participant' in self.contracts and 
            current_time > self.timeouts['participant'] and 
            not self.contracts['participant']['redeemed']):
            self.contracts['participant']['refunded'] = True
            self.contracts['participant']['refunded_at'] = current_time
            refunded = True
        
        if refunded:
            self.state = "refunded"
        
        return refunded
    
    def get_swap_status(self) -> Dict:
        """获取交换状态"""
        return {
            'state': self.state,
            'initiator': self.initiator,
            'participant': self.participant,
            'secret_hash': self.secret_hash,
            'contracts': self.contracts,
            'timeouts': self.timeouts
        }

class CrossChainBridge:
    """跨链桥接协议"""
    
    def __init__(self, bitcoin_node, alt_chain_node):
        self.bitcoin_node = bitcoin_node
        self.alt_chain_node = alt_chain_node
        self.pending_transfers: Dict[str, Dict] = {}
        self.completed_transfers: Dict[str, Dict] = {}
        self.validators: List[str] = []
    
    def initiate_transfer(self, user_address: str, amount: int, 
                         destination_chain: str, destination_address: str) -> Optional[str]:
        """发起跨链转账"""
        transfer_id = f"transfer_{len(self.pending_transfers)}_{int(datetime.now().timestamp())}"
        
        # 模拟锁定比特币资金
        lock_result = self._lock_bitcoin_funds(user_address, amount)
        
        if lock_result['success']:
            transfer_data = {
                'transfer_id': transfer_id,
                'source_chain': 'bitcoin',
                'destination_chain': destination_chain,
                'user_address': user_address,
                'destination_address': destination_address,
                'amount': amount,
                'lock_tx_hash': lock_result['tx_hash'],
                'status': 'locked',
                'timestamp': datetime.now(),
                'confirmations': 0
            }
            
            self.pending_transfers[transfer_id] = transfer_data
            return transfer_id
        
        return None
    
    def validate_transfer(self, transfer_id: str, validator_signature: str) -> bool:
        """验证并执行跨链转账"""
        if transfer_id not in self.pending_transfers:
            return False
        
        transfer = self.pending_transfers[transfer_id]
        
        # 验证比特币锁定交易
        if self._verify_bitcoin_lock(transfer['lock_tx_hash']):
            # 在目标链上铸造代币
            mint_result = self._mint_wrapped_tokens(
                transfer['destination_address'],
                transfer['amount'],
                transfer['destination_chain']
            )
            
            if mint_result['success']:
                transfer['status'] = 'completed'
                transfer['mint_tx_hash'] = mint_result['tx_hash']
                transfer['completed_at'] = datetime.now()
                
                self.completed_transfers[transfer_id] = transfer
                del self.pending_transfers[transfer_id]
                
                return True
        
        return False
    
    def release_transfer(self, wrapped_amount: int, user_address: str, 
                        destination_btc_address: str) -> Dict:
        """从目标链释放资金回比特币网络"""
        # 销毁包装代币
        burn_result = self._burn_wrapped_tokens(user_address, wrapped_amount)
        
        if burn_result['success']:
            # 释放比特币
            release_result = self._release_bitcoin_funds(
                destination_btc_address, 
                wrapped_amount
            )
            
            if release_result['success']:
                return {
                    'success': True,
                    'burn_tx_hash': burn_result['tx_hash'],
                    'release_tx_hash': release_result['tx_hash']
                }
        
        return {'success': False, 'error': 'Release failed'}
    
    def _lock_bitcoin_funds(self, user_address: str, amount: int) -> Dict:
        """锁定比特币资金（模拟）"""
        return {
            'success': True,
            'tx_hash': f"btc_lock_{hashlib.sha256(f'{user_address}{amount}'.encode()).hexdigest()[:16]}"
        }
    
    def _verify_bitcoin_lock(self, tx_hash: str) -> bool:
        """验证比特币锁定交易（模拟）"""
        return tx_hash.startswith('btc_lock_')
    
    def _mint_wrapped_tokens(self, address: str, amount: int, chain: str) -> Dict:
        """在目标链铸造包装代币（模拟）"""
        return {
            'success': True,
            'tx_hash': f"{chain}_mint_{hashlib.sha256(f'{address}{amount}'.encode()).hexdigest()[:16]}"
        }
    
    def _burn_wrapped_tokens(self, address: str, amount: int) -> Dict:
        """销毁包装代币（模拟）"""
        return {
            'success': True,
            'tx_hash': f"burn_{hashlib.sha256(f'{address}{amount}'.encode()).hexdigest()[:16]}"
        }
    
    def _release_bitcoin_funds(self, address: str, amount: int) -> Dict:
        """释放比特币资金（模拟）"""
        return {
            'success': True,
            'tx_hash': f"btc_release_{hashlib.sha256(f'{address}{amount}'.encode()).hexdigest()[:16]}"
        }

if __name__ == "__main__":
    # 原子交换示例
    print("=== 原子交换示例 ===")
    swap = AtomicSwap("Alice", "Bob")
    
    # Alice发起交换
    init_result = swap.initiate_swap(1000000, 2000000)  # Alice: 1 BTC, Bob: 2 ETH
    print(f"发起交换，秘密哈希: {init_result['secret_hash'][:16]}...")
    
    # Bob参与交换
    participate_result = swap.participate_swap(2000000)
    if participate_result:
        print("Bob成功参与交换")
    
    # Bob使用秘密赎回Alice的BTC
    if swap.redeem_initiator_contract(swap.secret):
        print("Bob成功赎回BTC")
    
    # Alice使用相同秘密赎回Bob的ETH
    if swap.redeem_participant_contract(swap.secret):
        print("Alice成功赎回ETH")
        print("原子交换完成！")
    
    # 跨链桥示例
    print("\n=== 跨链桥示例 ===")
    bridge = CrossChainBridge(None, None)  # 简化示例
    
    # 发起跨链转账
    transfer_id = bridge.initiate_transfer(
        "bitcoin_address_123", 
        500000, 
        "ethereum", 
        "ethereum_address_456"
    )
    
    if transfer_id:
        print(f"发起跨链转账，ID: {transfer_id}")
        
        # 验证转账
        if bridge.validate_transfer(transfer_id, "validator_signature"):
            print("跨链转账完成！")