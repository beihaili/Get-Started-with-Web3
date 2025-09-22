"""
Lightning Network支付应用实现
展示基于Lightning Network的实际支付场景应用
"""

import time
from typing import Dict, List, Optional

class LightningPaymentApp:
    """Lightning支付应用"""
    
    def __init__(self, ln_node):
        self.ln_node = ln_node
        self.user_wallets: Dict[str, Dict] = {}
        self.merchant_accounts: Dict[str, Dict] = {}
        self.payment_history: Dict[str, Dict] = {}
    
    def create_user_wallet(self, user_id: str) -> Dict:
        """为用户创建Lightning钱包"""
        wallet_info = {
            'user_id': user_id,
            'node_pubkey': f"pubkey_{user_id}_{int(time.time())}",
            'channels': [],
            'balance': 0,
            'created_at': time.time()
        }
        
        self.user_wallets[user_id] = wallet_info
        return wallet_info
    
    def fund_wallet(self, user_id: str, amount: int) -> bool:
        """为钱包充值（开启支付通道）"""
        if user_id not in self.user_wallets:
            return False
        
        # 模拟找到流动性较好的节点
        liquidity_node = self._find_high_liquidity_node()
        
        # 模拟开启支付通道
        channel_result = self._simulate_channel_opening(liquidity_node['pubkey'], amount)
        
        if channel_result['success']:
            self.user_wallets[user_id]['channels'].append(channel_result['channel_id'])
            self.user_wallets[user_id]['balance'] += amount
            return True
        
        return False
    
    def process_payment(self, payer_id: str, payee_id: str, amount: int, description: str = "") -> Dict:
        """处理Lightning支付"""
        if payer_id not in self.user_wallets or payee_id not in self.user_wallets:
            return {'success': False, 'error': 'User not found'}
        
        payer_wallet = self.user_wallets[payer_id]
        payee_wallet = self.user_wallets[payee_id]
        
        # 检查余额
        if payer_wallet['balance'] < amount:
            return {'success': False, 'error': 'Insufficient balance'}
        
        # 模拟生成支付请求
        invoice = self._create_invoice(payee_wallet['node_pubkey'], amount, description)
        
        # 模拟执行支付
        payment_result = self._simulate_payment(payer_wallet['node_pubkey'], invoice['bolt11'])
        
        if payment_result['success']:
            # 更新余额
            payer_wallet['balance'] -= amount
            payee_wallet['balance'] += amount
            
            # 记录交易
            payment_record = {
                'payment_id': payment_result['payment_hash'],
                'payer': payer_id,
                'payee': payee_id,
                'amount': amount,
                'description': description,
                'timestamp': time.time(),
                'fees': payment_result['fees_paid']
            }
            
            self.payment_history[payment_result['payment_hash']] = payment_record
            
            return {
                'success': True,
                'payment_id': payment_result['payment_hash'],
                'fees_paid': payment_result['fees_paid']
            }
        
        return {'success': False, 'error': payment_result.get('error', 'Payment failed')}
    
    def create_merchant_invoice(self, merchant_id: str, amount: int, description: str, expiry_minutes: int = 60) -> Dict:
        """为商户创建发票"""
        if merchant_id not in self.merchant_accounts:
            self.merchant_accounts[merchant_id] = {
                'merchant_id': merchant_id,
                'invoices': {},
                'payments_received': []
            }
        
        invoice_id = f"inv_{merchant_id}_{int(time.time())}"
        payment_hash = f"hash_{invoice_id}"
        
        invoice = {
            'invoice_id': invoice_id,
            'merchant_id': merchant_id,
            'amount': amount,
            'description': description,
            'payment_hash': payment_hash,
            'expiry_time': time.time() + (expiry_minutes * 60),
            'status': 'pending',
            'created_at': time.time()
        }
        
        self.merchant_accounts[merchant_id]['invoices'][invoice_id] = invoice
        
        # 生成BOLT11发票
        bolt11_invoice = f"lnbc{amount}1{payment_hash}"
        
        return {
            'invoice_id': invoice_id,
            'bolt11': bolt11_invoice,
            'payment_hash': payment_hash,
            'amount': amount,
            'expiry_time': invoice['expiry_time']
        }
    
    def pay_merchant_invoice(self, payer_id: str, bolt11_invoice: str) -> Dict:
        """支付商户发票"""
        # 解析BOLT11发票（简化版本）
        invoice_info = self._parse_bolt11(bolt11_invoice)
        
        if not invoice_info:
            return {'success': False, 'error': 'Invalid invoice'}
        
        # 查找对应的发票
        invoice = self._find_invoice_by_hash(invoice_info['payment_hash'])
        if not invoice:
            return {'success': False, 'error': 'Invoice not found'}
        
        # 检查发票是否过期
        if time.time() > invoice['expiry_time']:
            return {'success': False, 'error': 'Invoice expired'}
        
        # 执行支付
        payment_result = self._simulate_invoice_payment(payer_id, invoice)
        
        if payment_result['success']:
            # 更新发票状态
            invoice['status'] = 'paid'
            invoice['paid_at'] = time.time()
            invoice['payer'] = payer_id
            
            # 记录商户收款
            merchant_id = invoice['merchant_id']
            self.merchant_accounts[merchant_id]['payments_received'].append({
                'invoice_id': invoice['invoice_id'],
                'amount': invoice['amount'],
                'payer': payer_id,
                'timestamp': time.time()
            })
            
            return {
                'success': True,
                'payment_hash': invoice['payment_hash'],
                'amount': invoice['amount'],
                'fees_paid': payment_result['fees_paid']
            }
        
        return {'success': False, 'error': payment_result.get('error', 'Payment failed')}
    
    def get_payment_history(self, user_id: str, limit: int = 10) -> List[Dict]:
        """获取用户支付历史"""
        user_payments = []
        for payment in self.payment_history.values():
            if payment['payer'] == user_id or payment['payee'] == user_id:
                user_payments.append(payment)
        
        # 按时间倒序排列
        user_payments.sort(key=lambda x: x['timestamp'], reverse=True)
        return user_payments[:limit]
    
    def get_merchant_summary(self, merchant_id: str) -> Dict:
        """获取商户收款汇总"""
        if merchant_id not in self.merchant_accounts:
            return {'error': 'Merchant not found'}
        
        merchant = self.merchant_accounts[merchant_id]
        total_received = sum(payment['amount'] for payment in merchant['payments_received'])
        
        return {
            'merchant_id': merchant_id,
            'total_invoices': len(merchant['invoices']),
            'total_received': total_received,
            'payments_count': len(merchant['payments_received']),
            'recent_payments': merchant['payments_received'][-5:]  # 最近5笔
        }
    
    def _find_high_liquidity_node(self) -> Dict:
        """找到高流动性节点（模拟）"""
        return {
            'pubkey': 'high_liquidity_node_pubkey',
            'capacity': 10000000,
            'fee_rate': 0.001
        }
    
    def _simulate_channel_opening(self, node_pubkey: str, amount: int) -> Dict:
        """模拟开启支付通道"""
        return {
            'success': True,
            'channel_id': f"channel_{node_pubkey}_{int(time.time())}",
            'capacity': amount
        }
    
    def _create_invoice(self, node_pubkey: str, amount: int, description: str) -> Dict:
        """创建发票（模拟）"""
        payment_hash = f"hash_{node_pubkey}_{amount}_{int(time.time())}"
        return {
            'payment_hash': payment_hash,
            'bolt11': f"lnbc{amount}1{payment_hash}",
            'amount': amount,
            'description': description
        }
    
    def _simulate_payment(self, payer_pubkey: str, bolt11: str) -> Dict:
        """模拟支付执行"""
        # 模拟支付费用（基于支付金额的0.1%）
        amount = self._extract_amount_from_bolt11(bolt11)
        fees = max(1, int(amount * 0.001))  # 最少1 satoshi
        
        return {
            'success': True,
            'payment_hash': f"payment_{int(time.time())}",
            'fees_paid': fees
        }
    
    def _parse_bolt11(self, bolt11: str) -> Optional[Dict]:
        """解析BOLT11发票（简化版本）"""
        if not bolt11.startswith('lnbc'):
            return None
        
        # 简化的解析逻辑
        try:
            # 提取金额和支付哈希
            amount_str = bolt11[4:bolt11.find('1')]
            payment_hash = bolt11[bolt11.find('1')+1:]
            amount = int(amount_str) if amount_str.isdigit() else 0
            
            return {
                'amount': amount,
                'payment_hash': payment_hash
            }
        except:
            return None
    
    def _find_invoice_by_hash(self, payment_hash: str) -> Optional[Dict]:
        """根据支付哈希查找发票"""
        for merchant in self.merchant_accounts.values():
            for invoice in merchant['invoices'].values():
                if invoice['payment_hash'] == payment_hash:
                    return invoice
        return None
    
    def _simulate_invoice_payment(self, payer_id: str, invoice: Dict) -> Dict:
        """模拟发票支付"""
        if payer_id not in self.user_wallets:
            return {'success': False, 'error': 'Payer wallet not found'}
        
        payer_wallet = self.user_wallets[payer_id]
        amount = invoice['amount']
        
        if payer_wallet['balance'] < amount:
            return {'success': False, 'error': 'Insufficient balance'}
        
        # 模拟支付费用
        fees = max(1, int(amount * 0.001))
        
        # 扣除余额
        payer_wallet['balance'] -= (amount + fees)
        
        return {
            'success': True,
            'fees_paid': fees
        }
    
    def _extract_amount_from_bolt11(self, bolt11: str) -> int:
        """从BOLT11中提取金额（简化版本）"""
        try:
            amount_str = bolt11[4:bolt11.find('1')]
            return int(amount_str) if amount_str.isdigit() else 0
        except:
            return 0

if __name__ == "__main__":
    # Lightning支付应用示例
    print("=== Lightning支付应用示例 ===")
    
    app = LightningPaymentApp(None)  # 简化示例，无需真实LN节点
    
    # 创建用户钱包
    alice_wallet = app.create_user_wallet("alice")
    bob_wallet = app.create_user_wallet("bob")
    print(f"创建用户钱包 - Alice: {alice_wallet['user_id']}, Bob: {bob_wallet['user_id']}")
    
    # 为Alice充值
    if app.fund_wallet("alice", 1000000):  # 1000万 satoshis
        print(f"Alice钱包充值成功，余额: {app.user_wallets['alice']['balance']} satoshis")
    
    # Alice向Bob转账
    payment_result = app.process_payment("alice", "bob", 100000, "转账给Bob")
    if payment_result['success']:
        print(f"转账成功，支付ID: {payment_result['payment_id'][:16]}...")
        print(f"手续费: {payment_result['fees_paid']} satoshis")
    
    # 商户发票示例
    print("\n=== 商户支付示例 ===")
    
    # 创建商户发票
    invoice = app.create_merchant_invoice("coffee_shop", 50000, "拿铁咖啡", 15)
    print(f"商户发票创建成功，金额: {invoice['amount']} satoshis")
    print(f"BOLT11: {invoice['bolt11'][:30]}...")
    
    # Bob支付商户发票
    if app.fund_wallet("bob", 500000):  # 为Bob充值
        payment_result = app.pay_merchant_invoice("bob", invoice['bolt11'])
        if payment_result['success']:
            print(f"商户支付成功，金额: {payment_result['amount']} satoshis")
    
    # 查看商户收款汇总
    merchant_summary = app.get_merchant_summary("coffee_shop")
    print(f"\n商户收款汇总:")
    print(f"  总发票数: {merchant_summary['total_invoices']}")
    print(f"  总收款: {merchant_summary['total_received']} satoshis")
    print(f"  支付次数: {merchant_summary['payments_count']}")
    
    # 查看用户支付历史
    alice_history = app.get_payment_history("alice", 5)
    print(f"\nAlice最近支付历史:")
    for payment in alice_history:
        print(f"  {payment['payment_id'][:10]}... -> {payment['payee']}: {payment['amount']} satoshis")