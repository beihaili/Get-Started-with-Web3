import argparse
from decimal import Decimal
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException

def main():
    """
    一个简单的工具，用于创建并广播一笔使用指定低费率的比特币交易。
    """
    parser = argparse.ArgumentParser(
        description="A simple tool to create and broadcast a low-fee Bitcoin transaction.",
        formatter_class=argparse.RawTextHelpFormatter
    )
    # --- RPC 配置 ---
    rpc_group = parser.add_argument_group('Bitcoin Core RPC Configuration')
    rpc_group.add_argument('--rpc-user', required=True, help="Bitcoin Core RPC username.")
    rpc_group.add_argument('--rpc-password', required=True, help="Bitcoin Core RPC password.")
    rpc_group.add_argument('--rpc-host', default='127.0.0.1', help="Bitcoin Core RPC host. (Default: 127.0.0.1)")
    rpc_group.add_argument('--rpc-port', default=8332, help="Bitcoin Core RPC port. (Default: 8332 for mainnet)")

    # --- 交易参数 ---
    tx_group = parser.add_argument_group('Transaction Details')
    tx_group.add_argument('--recipient', required=True, help="The Bitcoin address to send to.")
    tx_group.add_argument('--amount', required=True, type=Decimal, help="The amount of BTC to send.")
    tx_group.add_argument('--fee-rate', required=True, type=Decimal, help="The desired fee rate in sat/vB (e.g., 0.1).")

    args = parser.parse_args()

    # --- 1. 连接到 Bitcoin Core ---
    try:
        rpc_url = f"http://{args.rpc_user}:{args.rpc_password}@{args.rpc_host}:{args.rpc_port}"
        rpc_connection = AuthServiceProxy(rpc_url)
        # 测试连接
        rpc_connection.getblockchaininfo()
        print("✅ Successfully connected to Bitcoin Core.")
    except Exception as e:
        print(f"❌ Error: Could not connect to Bitcoin Core. Details: {e}")
        return

    # --- 2. 创建并资助裸交易 ---
    print("\n--- Step 1: Creating and Funding Transaction ---")
    try:
        # 定义输出
        outputs = {args.recipient: f"{args.amount:.8f}"}
        
        # 定义交易选项，最关键的是指定费率
        # 注意：fundrawtransaction期望费率单位是 BTC/kB
        fee_rate_btc_per_kb = args.fee_rate * Decimal('0.00001')
        options = {'feeRate': f"{fee_rate_btc_per_kb:.8f}"}

        print(f"   Attempting to fund a transaction with fee rate: {args.fee_rate} sat/vB ({fee_rate_btc_per_kb:.8f} BTC/kB)")

        # 使用 fundrawtransaction 自动选择UTXO并计算费用
        # 1. 先创建一个只有输出的裸交易
        unsigned_tx = rpc_connection.createrawtransaction([], outputs)
        # 2. 让节点为其"注资"（选择输入、添加找零地址、计算费用）
        funded_tx_result = rpc_connection.fundrawtransaction(unsigned_tx, options)
        
        funded_tx_hex = funded_tx_result['hex']
        fee_paid = funded_tx_result['fee']
        print(f"✅ Transaction funded successfully. Fee paid: {fee_paid:.8f} BTC")

    except JSONRPCException as e:
        print(f"❌ Error funding transaction: {e}")
        print("   This might happen if your node's `minrelaytxfee` is higher than the specified fee rate,")
        print("   or if you don't have enough funds.")
        return

    # --- 3. 签名交易 ---
    print("\n--- Step 2: Signing Transaction ---")
    try:
        signed_tx_result = rpc_connection.signrawtransactionwithwallet(funded_tx_hex)
        if not signed_tx_result.get('complete', False):
            print("❌ Error: Could not sign the transaction completely.")
            return
        
        signed_tx_hex = signed_tx_result['hex']
        print("✅ Transaction signed successfully.")

    except JSONRPCException as e:
        print(f"❌ Error signing transaction: {e}")
        return

    # --- 4. 通过本地节点广播 ---
    print("\n--- Step 3: Broadcasting Transaction via local node ---")
    try:
        txid = rpc_connection.sendrawtransaction(signed_tx_hex)
        print(f"\n🎉 Transaction broadcasted successfully via your node!")
        print(f"   Transaction ID (txid): {txid}")
        print(f"   It is now in your node's mempool and being relayed to peers.")
        print(f"   Confirmation time will depend on network congestion.")
        print(f"   Track it here: https://mempool.space/tx/{txid}")
    except JSONRPCException as e:
        print(f"❌ Error broadcasting transaction: {e}")
        print("   If you see 'absurdly-high-fee', it's a safety check. Consider re-running.")
        print("   If you see 'min relay fee not met', your bitcoin.conf change was not effective. Did you restart the node?")


if __name__ == '__main__':
    main() 