# Lesson 09: Bitcoin Core Node

![status](https://img.shields.io/badge/Status-Completed-success)
![author](https://img.shields.io/badge/Author-beihaili-blue)
![date](https://img.shields.io/badge/Date-2025--06-orange)
![difficulty](https://img.shields.io/badge/Difficulty-Intermediate-yellow)

> 💡 Self-learning Web3 is no easy task. As a newcomer to Web3, I'm putting together the simplest and most intuitive tutorials for beginners. I've integrated high-quality resources from the open-source community to guide you from beginner to expert in Web3. I'll update 1-3 lessons per week.
>
> Follow me on Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
>
> Join the discussion group: [Form Link](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> Open-sourced on GitHub: [Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [Introduction](#introduction)
- [What Is a Bitcoin Node](#what-is-a-bitcoin-node)
- [Why Run a Bitcoin Node](#why-run-a-bitcoin-node)
- [How to Set Up a Bitcoin Node](#how-to-set-up-a-bitcoin-node)
- [FAQ](#faq)
- [Conclusion](#conclusion)

## Introduction

On January 3, 2009, an ordinary Saturday, on a small server in Helsinki, Finland, the anonymous developer Satoshi Nakamoto ran a program called a Bitcoin node and mined Bitcoin's genesis block. People at the time had no idea that an entirely new era was quietly unfolding.

We may never know who Satoshi Nakamoto is, but we can clearly see the Bitcoin node's source code and thus understand Satoshi's vision. In the source code, Satoshi set the block size to 1 MB, meaning that within the roughly 10-minute block interval, the Bitcoin network can only process 1 MB of data. While this appears to limit Bitcoin's growth, what was Satoshi's purpose? To ensure decentralization!

Small blocks guarantee that ordinary users can easily run a Bitcoin client on their home computers. This strategy has proven effective — as of now, after 15 years of operation, the Bitcoin blockchain is only about 663 GB, well within the capacity of a home computer. We can imagine what Satoshi was thinking when establishing the small block size: a brand new asset that relies not on governments or any centralized authority, but on nodes spanning the globe — even the universe — connecting to each other, self-organizing and cooperating, ultimately weaving a brilliant network!

## What is a Bitcoin Full Node

A Bitcoin full node is a node that independently verifies every transaction in every block on the valid blockchain with the most proof-of-work. It independently determines the validity of all transactions and blocks by autonomously downloading, storing, and verifying the entire transaction history since Bitcoin's inception, thus ensuring that users can use Bitcoin securely without trusting any third party.

## Pros and Cons of Running a Full Node

### Pros

- **Decentralization**: Full nodes independently verify transactions, ensuring network decentralization and reliability.
- **Privacy**: Full nodes don't rely on third-party servers, thus enhancing privacy.
- **Network Security**: Full nodes help maintain Bitcoin network security by verifying transactions and blocks.
- **Data Integrity**: Full nodes can verify the integrity of the blockchain, ensuring data hasn't been tampered with.
- **Data Trustworthiness**: Full nodes can verify the blockchain's completeness, ensuring data authenticity.

### Cons

- **Resource Consumption**: Full nodes require significant hard drive space and computing resources.
- **Bandwidth Consumption**: Full nodes need stable network bandwidth to process and sync blockchain data.

## How to Run a Bitcoin Full Node

Let's get straight to running a Bitcoin full node.

### 1. Prerequisites

Ensure that the host or server you plan to run the full node on meets the following requirements:
- At least 1 TB of hard drive space (as of 2025, the Bitcoin blockchain is about 660 GB, expected to reach 1 TB in 2026).
- Stable internet access.

### 2. Download Bitcoin Core Client

- Visit the [Bitcoin Core website](https://bitcoin.org/en/download) and download the version suitable for your operating system.

- Verify the downloaded file's integrity by computing the file hash and comparing it with the hash provided on the website:
    - Download the `SHA256SUMS.asc` file and `SHA256SUMS` from the website.
    - Install gpg:
    `sudo apt-get install gnupg` / `brew install gpg`
    - Import the public key:
    `gpg --keyserver hkp://keyserver.ubuntu.com --recv-keys 01EA5486DE18A882D4C2684590C8019E36C2E964`
    - Verify using the commands:
    `gpg --verify SHA256SUMS.asc SHA256SUMS`
    `shasum -a 256 [your downloaded filename]`
    - Compare the two hash values; if they match, then the file is intact.

- After downloading, extract the file, navigate to the folder, and run `bitcoind`.

### 3. Launch Bitcoin Core Client

- Configure Bitcoin Core:
    - The Bitcoin Core configuration file is typically located at:
    `Linux/macOS: ~/.bitcoin/bitcoin.conf`
    `Windows: C:\Users\<YourUsername>\AppData\Roaming\Bitcoin\bitcoin.conf`
    - If the file doesn't exist, you can create it manually. In the terminal (macOS or Linux), use:
    `mkdir -p ~/.bitcoin`
    `touch ~/.bitcoin/bitcoin.conf`
    - Configuration file contents: Add the following basic configuration to `bitcoin.conf`:
    ```
    # Enable testnet (optional)
    # testnet=1
    # Set RPC username and password (for client interaction)
    rpcuser=yourusername
    rpcpassword=yourpassword
    # Set RPC listen address and port
    rpcallowip=127.0.0.1         # Allow local connections
    rpcport=8332                 # Default RPC port
    # Enable P2P network port (communication with other nodes)
    port=8333                    # Default P2P port
    listen=1                     # Allow listening for inbound connections
    # Node connection settings
    maxconnections=40            # Max connections, default 125, adjust as needed
    addnode=seed.bitcoin.sipa.be # Manually add a node
    ```
    - `testnet`: Set to 1 to enable the test network.
    - `rpcuser` and `rpcpassword`: Username and password for RPC access; set your own.
    - `rpcallowip`: Restrict RPC access by IP.
    - `addnode`: Add known nodes for faster syncing.

- Start via command line:
`bitcoind -daemon`

- Check if Bitcoin Core is running:
`bitcoin-cli getblockchaininfo`
    - If you see output like the following, it means the Bitcoin Core client is running:
```json
{
  "chain": "main",
  "blocks": 864960,
  "headers": 864960,
  "bestblockhash": "00000000000000000000af903762b90d4523ff7395ebdbf34ba18f17cd4e9cee",
  "difficulty": 92049594548485.47,
  "time": 1728520811,
  "mediantime": 1728517565,
  "verificationprogress": 0.9999992558144524,
  "initialblockdownload": false,
  "chainwork": "0000000000000000000000000000000000000000930dc84827142da2656fb2ff",
  "size_on_disk": 689537999029,
  "pruned": false,
  "warnings": ""
}
```

### 4. Sync Data

- After starting the Bitcoin Core client, it will automatically begin downloading and verifying blockchain data. This is a time-consuming process that may take several hours or even days.
- Data directory (optional): If disk space is limited, you can change the data directory to another drive or location:
    `datadir=/path/to/your/data_directory`
    `datadir=/mnt/data/bitcoin`

### 5. Common Configuration Options

- Depending on your needs, you can add these configurations:
    - Disable GUI (suitable for servers)
    `daemon=1`
    - Limit hard drive usage (in MB); older blocks are deleted when exceeded
    `prune=550`
    - Set transaction fee target (adjust as needed)
    `txconfirmtarget=6`           # Target confirmation time (in blocks)
    - Optimize bandwidth usage
    `maxuploadtarget=500`         # Max upload traffic (MB/day)

### 6. Using Bitcoin Core Client

- GUI launch:
    `bitcoin-qt`
- Command-line launch (Linux/macOS):
    `bitcoind -daemon`

### 7. Stopping Bitcoin Core Client

- GUI stop:
    `bitcoin-qt`
- Command-line stop (Linux/macOS):
    `bitcoin-cli stop`

### 8. Other Common Operations

- Check current node sync status
    `bitcoin-cli getblockchaininfo`
- Check current block height
    `bitcoin-cli getblockcount`
- Check current balance
    `bitcoin-cli getbalance`
- View current unconfirmed transactions
    `bitcoin-cli getrawmempool`
- View unconfirmed transaction count
    `bitcoin-cli getmempoolinfo`

## Practical Experience and Pitfall Guide for Running a Bitcoin Node

When running a Bitcoin node in practice, you may encounter various technical challenges. Below are key considerations and solutions based on real-world experience to help you avoid common pitfalls and keep your node running stably.

### Storage Media Selection and File Systems

#### File System Selection

**Problem**: Different file systems have a huge impact on Bitcoin database stability. Non-journaling file systems like ExFAT are prone to data corruption during power outages or abnormal shutdowns.

**Solution**:
- **macOS users**: Use the APFS file system.
- **Windows users**: Use the NTFS file system.
- **Linux users**: Use the ext4 or XFS file system.
- **Avoid Using**: ExFAT, FAT32, and other non-journaling file systems.

**Practical experience**:
```
When running a Bitcoin node on an external SSD formatted as ExFAT, frequent database corruption occurred.
After reformatting the same SSD to APFS, node stability improved significantly with no further corruption.
```

#### External Storage Device Considerations

**Problem**: Disconnecting external storage devices can corrupt the Bitcoin database.

**Solution**:
- Use high-quality USB cables and ports.
- Avoid plugging/unplugging storage devices while the node is running.
- Consider using a UPS to prevent sudden power outages.
- Regularly back up `wallet.dat` and other important configuration files.

### Node Resource Management

#### Disk Space Management

**Problem**: The complete Bitcoin blockchain (as of 2025) has reached 660 GB+ and continues to grow.

**Solution**:
1. **Pruned Mode**:
   ```
   # Set in bitcoin.conf to limit blockchain storage to 2 GB
   prune=2000
   ```

   **Pros**:
   - Dramatically reduces disk usage (can be as low as 2-10 GB).
   - Still a fully validating node; security is unaffected.
   - Can send/receive transactions and use wallet features.

   **Cons**:
   - Initial sync time is not reduced (still needs to download the entire blockchain for validation).
   - Cannot serve old block data (already pruned).
   - Cannot use `txindex` or other full indexing features.

2. **Understanding how pruned mode works**:
   - The node still downloads and validates the complete blockchain.
   - After validation, it deletes the oldest block data, keeping only recent blocks.
   - Always retains the complete UTXO set (unspent transaction outputs).

#### Memory and CPU Optimization

**Problem**: Default configuration may cause excessive memory usage, affecting system stability.

**Solution**:
```
# Optimized bitcoin.conf parameters
dbcache=450           # Database cache size (MB), adjust based on system memory
maxmempool=300        # Mempool size limit (MB)
par=2                 # Script verification threads, adjust based on CPU cores
maxorphantx=10        # Limit orphan transactions for better stability
blocksonly=1          # Download blocks only, don't relay transactions, greatly reduces bandwidth
```

### Monitoring and Auto-Recovery

#### Node Monitoring Script

To ensure stable node operation, you can use an automated monitoring script to periodically check node status and restart when necessary:

```bash
#!/bin/bash

# Bitcoin node monitoring script
# Function: Checks node status on each run, logs sync progress, restarts node if needed
# Usage: Set as a cron job to run every 30 minutes

# Configuration variables
BITCOIN_CONF="/path/to/bitcoin.conf"
BITCOIN_DATA="/path/to/bitcoin/data"
LOG_FILE="/path/to/bitcoin_monitor.log"
MAX_LOG_SIZE=10000000  # 10 MB, log will be cleared when exceeded

# Check if configuration file exists
check_config_exists() {
    if [ ! -f "$BITCOIN_CONF" ]; then
        echo "$(date): Error - Config file not found: $BITCOIN_CONF" >> "$LOG_FILE"
        return 1
    fi
    return 0
}

# Check if Bitcoin node is running
check_node_running() {
    if pgrep -x "bitcoind" > /dev/null; then
        return 0
    else
        echo "$(date): Warning - Bitcoin node is not running" >> "$LOG_FILE"
        return 1
    fi
}

# Check for data corruption
check_data_corruption() {
    local log_file="$(dirname"$BITCOIN_CONF")/debug.log"
    if [ -f "$log_file" ]; then
        if tail -n 100 "$log_file" | grep -q -E "(corruption|corrupted|checksum|error.*block|fatal|Corrupted)"; then
            echo "$(date): Warning - Possible data corruption detected" >> "$LOG_FILE"
            return 0
        fi
    fi
    return 1
}

# Start Bitcoin node
start_node() {
    local reindex_needed=false

    # Check if reindexing is needed
    if check_data_corruption; then
        reindex_needed=true
    fi

    if [ "$reindex_needed" = true ]; then
        echo "$(date): Info - Starting Bitcoin node with -reindex flag..." >> "$LOG_FILE"
        bitcoind -datadir="$BITCOIN_DATA" -daemon -reindex
    else
        echo "$(date): Info - Starting Bitcoin node (no reindex)..." >> "$LOG_FILE"
        bitcoind -datadir="$BITCOIN_DATA" -daemon
    fi
}

# Main function
main() {
    # Check configuration
    if ! check_config_exists; then
        return 1
    fi

    # Check if node is running
    if ! check_node_running; then
        echo "$(date): Info - Attempting to start node..." >> "$LOG_FILE"
        start_node
    else
        echo "$(date): Info - Bitcoin node is running" >> "$LOG_FILE"
    fi

    return 0
}

# Execute main function
main
```

### Lightweight Alternatives

If the resource requirements for running a full node are too high, consider the following lightweight alternatives:

#### SPV Wallets

**Features**:
- Downloads only the block headers (~50 MB) instead of full blocks.
- Can be set up in minutes.
- Extremely low resource requirements.

**Recommended Options**:
- **Electrum**: A fully featured lightweight wallet (https://electrum.org/)
- **BlueWallet**: A Mobile-friendly SPV wallet (https://bluewallet.io/)
- **Wasabi Wallet**: A Privacy-focused SPV wallet (https://wasabiwallet.io/)

**Security Comparison**:
- SPV wallets verify transactions via Merkle proofs rather than verifying all transactions.
- Slightly less secure than full nodes, but it is usually sufficient for individual users.
- Requires trusting remote servers for correct information.

### Common Troubleshooting

#### Node Won't Sync

**Troubleshooting steps**:
1. Check network connectivity (especially firewall settings).
2. Ensure sufficient disk space.
3. Check `debug.log` for error messages.
4. Try adding a known node:
   ```
   addnode=seed.bitcoin.sipa.be add
   ```

#### Database Corruption

**Symptoms**:
- Erros such as "database corruption" or "checksum mismatch" appear in the logs.
- Node crashes or fails to start.

**Solutions**:
1. Restart with the `-reindex` flag:
   ```
   bitcoind -reindex
   ```
2. If that still fails, you may need to delete the `blocks` and `chainstate` directories and re-sync.

## FAQ

#### ❓ Do I need a powerful computer to run a Bitcoin node?

You don't need a particularly high-end computer, but there are some minimum requirements:

1. **Storage**: At least 700 GB of available space, preferably 1 TB (the blockchain continues to grow).
2. **Memory**: At least 2 GB RAM, 4 GB or more recommended.
3. **Network**: Stable broadband connection; roughly 200 GB of monthly data transfer.
4. **Processor**: Any modern multi-core processor will do.

If resources are limited, consider using pruned mode, which can reduce storage requirements to around 10 GB.

#### ❓ My Bitcoin node has sync issues — data sync is very slow. What should I do?

Slow sync is a common issue. Here are some solutions:

1. **Manually add nodes**: Add reliable node addresses in the configuration file.
2. **Check the firewall**: Ensure port 8333 is open.
3. **Upgrade hardware**: If possible, use an SSD instead of an HDD.
4. **Use fast sync**: Download a blockchain snapshot from a trusted source for quick startup.

#### ❓ What's the difference between a Bitcoin node and mining?

This is a common point of confusion:

1. **Bitcoin node**: Validates and relays transactions, maintains a complete copy of the blockchain, and do not earn mining rewards.
2. **Mining**: Attempts to solve mathematical puzzles to create new blocks and earn Bitcoin rewards.

Running a node won't directly earn you Bitcoin rewards, but it's crucial for maintaining Bitcoin's decentralization and security.

#### ❓ Does my node need to run 24/7?

No. While running continuously is most beneficial for the Bitcoin network, you can shut down and restart your node as needed. When you restart, the node will automatically sync any new blocks since it was last shut down.

## References

- [Bitcoin Core Documentation](https://bitcoin.org/en/developer-reference#bitcoin-core)
- [Bitcoin Core Source Code](https://github.com/bitcoin/bitcoin)
- [Bitcoin White Paper](https://bitcoin.org/bitcoin.pdf)
- [Bitcoin Developer Guide](https://bitcoin.org/en/developer-guide)
- [Running a Bitcoin Full Node](https://yishi.io/how-to-run-bitcoin-full-node/)

## Conclusion

Running a Bitcoin node is not just a technical exercise, but it's also a way of participating in a financial revolution. When you set up your own node, you're not just using Bitcoin; you're contributing to the security and resilience of its decentralized network.

Every running node is a guardian of the Bitcoin network and your participation makes this vast financial system more enduring. Whether you use a full node or pruned mode, you're contributing to a more open, fair, and free financial future.

Fifteen years after that front page headline in The Times, we have reason to believe in Satoshi's words: "I'm very confident that blockchain technology will become a new economic model, and young people will find all sorts of ways to create value using blockchain technology."

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">🏠 Back to Home</a> |
<a href="https://twitter.com/bhbtc1337">🐦 Follow the Author</a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">📝 Join the Discussion</a>
</div>
