# Get Started With Web3
---
自学入门`Web3`不是一件容易的事，作为一个刚刚入门Web3的新人，梳理一下最简单直观的`Web3`小白入门教程。整合开源社区优质资源，为大家从入门到精通web3指路。每周更新1-3讲.

欢迎关注我的推特：[@beihai1337](https://twitter.com/beihai1337)

北航区块链协会DAO推特： [@BHBA_DAO](https://twitter.com/BHBA_DAO)

进入微信交流群请填表： [表格链接](https://forms.gle/QMBwL6LwZyQew1tX8)

文章开源在github： [https://github.com/beihaili/Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)

----

# 比特币节点

## 前言：守护去中心化世界的信任
2009年1月3日，中本聪在芬兰赫尔辛基的一个小型服务器上运行了比特币节点，挖出了比特币的第一个区块，也就是创世区块。当时的人们并不了解，这个区块的诞生，意味着一个全新的数字货币时代的到来。我们无从得知中本聪是谁，但是我们能够清楚的看到比特币节点的源码，清晰的看到中本聪的想法。在比特币节点的源码中，中本聪规定区块大小为1MB，这意味着在大约10分钟的出块间隔时间里，比特币网络只能处理1M的数据。看起来这是对比特币发展的一个限制，那么中本聪的目的是什么呢？是保证去中心化！小区块保证了一般用户可以在自家电脑上简单的运行比特币客户端，这个策略被证明是有效的，截至目前比特币网络运行15年比特币节点的大小仅为500G，可以在一台家用电脑上运行。我们可以想像，中本聪在确立小区块时脑海中在想什么：一个全新的资产，不靠政府或任何中心化的信用，靠的是遍布全球甚至全宇宙的节点互相连接，自发组织，自发合作编织出了璀璨网络！

## 什么是比特币全节点
比特币全节点是比特币网络中的一个重要组成部分，它负责验证和存储比特币网络中的所有交易和区块数据。全节点是比特币网络的信任基础，它们通过验证所有交易和区块来确保网络的安全性和去中心化。

## 如何运行一个比特币全节点
废话不多说，让我们来运行一个比特币全节点。

### 1. 准备条件
确保你要运行全节点的主机或服务器满足以下条件：
- 至少1T容量的硬盘空间（截止2024年，比特币区块链大小约为500G，预计2026年达到1T）
- 稳定访问国际互联网

### 2. 下载比特币核心客户端
+ 访问[比特币核心网站](https://bitcoin.org/en/download)，下载适合你操作系统的版本。
+ 验证下载的文件是否完整，可以通过计算文件的哈希值，并与网站上提供的哈希值进行对比
    - 下载网站提供的SHA256SUMS.asc文件，和SHA256SUMS’
    - 安装gpg：
    `sudo apt-get install gnupg`/`brew install gpg`
    - 导入公钥：
    `gpg --keyserver hkp://keyserver.ubuntu.com --recv-keys 01EA5486DE18A882D4C2684590C8019E36C2E964`
    - 使用命令验证：
    `gpg --verify SHA256SUMS.asc SHA256SUMS`
    `shasum -a 256 [你下载的文件名]`
    - 对比两个文件的哈希值，如果一致，则说明文件完整。

+ 下载完成后，解压文件，进入文件夹，运行`bitcoind`

### 3. 启动比特币核心客户端
+ 配置比特币核心客户端：
    - Bitcoin Core 的配置文件通常位于以下位置：
	`Linux/macOS：~/.bitcoin/bitcoin.conf`
	`Windows： C:\Users\<YourUsername>\AppData\Roaming\Bitcoin\bitcoin.conf`
    - 如果该文件不存在，可以手动创建。你可以在终端（macOS 或 Linux）中使用以下命令：
	`mkdir -p ~/.bitcoin`
	`touch ~/.bitcoin/bitcoin.conf` 
    - 配置文件内容：在 bitcoin.conf 文件中，添加以下基础配置：
    ```
    # 启用测试网络（可选）
    # testnet=1
    # 设置 RPC 用户名和密码（用于与客户端交互）
    rpcuser=yourusername
    rpcpassword=yourpassword
    # 设置 RPC 监听地址和端口
    rpcallowip=127.0.0.1         # 允许本地连接
    rpcport=8332                 # 默认的 RPC 端口
    # 启用 P2P 网络端口（与其他节点通信）
    port=8333                    # 默认的 P2P 端口
    listen=1                     # 允许监听入站连接
    # 节点连接设置
    maxconnections=40            # 最大连接数，默认 125，可根据网络情况调整
    addnode=seed.bitcoin.sipa.be # 手动添加节点
    ```
    - testnet：设置为 1 时启用测试网络。
    - rpcuser 和 rpcpassword：用于 RPC 访问的用户名和密码，请自行设置。
    - rpcallowip：限制 RPC 的访问 IP。
    - addnode：可以添加一些已知的节点，以便快速同步。

+ 用命令行运行：
`bitcoind -daemon`
+ 查看比特币核心客户端是否运行：
`bitcoin-cli getblockchaininfo`
    - 如果出现以下信息，则说明比特币核心客户端正在运行：
`{
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
}`

### 4. 同步数据
+ 启动 Bitcoin Core 客户端后，它会自动开始下载和验证区块链数据。这是一个非常耗时的过程，可能需要几小时甚至几天时间。
+ 数据目录（可选）如果你的磁盘空间有限，可以将数据目录更改到其他驱动器或位置：
    `datadir=/path/to/your/data_directory`
    `datadir=/mnt/data/bitcoin`

### 5.常用配置项
+ 根据具体需求，还可以添加以下配置：
    - 禁用图形界面（适用于服务端）
    `daemon=1`
    - 限制硬盘空间使用（以 MB 为单位），超出时删除旧区块
    `prune=550`
    - 设置交易费率（按需调整）
    `txconfirmtarget=6`           # 目标确认时间（以区块数计算）
    - 优化带宽使用
    `maxuploadtarget=500`         # 最大上传流量（MB/天）

### 6. 使用比特币核心客户端
+ GUI 启动：
    `bitcoin-qt`
+ 使用命令行启动（Linux/macOS）
    `bitcoind -daemon`

## 比特币全节点的优缺点

### 优点
+ 去中心化：全节点可以独立验证交易，确保网络的去中心化和可靠性。
+ 隐私性：全节点不会依赖第三方服务器，提升隐私性。
+ 支持网络安全：全节点通过验证交易和区块，帮助维护比特币网络的安全。
+ 数据完整性：全节点可以验证区块链的完整性，确保数据不被篡改。
+ 数据可信：全节点可以验证区块链的完整性，确保数据不被篡改。
### 缺点
+ 资源消耗：全节点需要大量的硬盘空间和计算资源。
+ 网络带宽：全节点需要稳定的网络带宽，以处理和同步区块链数据。
+ 安全性：全节点需要妥善保护，避免被黑客攻击。

## 比特币全节点的未来
比特币全节点是比特币网络的信任基础，它们通过验证所有交易和区块来确保网络的安全性和去中心化。随着比特币网络的发展，全节点的角色将变得更加重要。未来，全节点可能会集成更多的功能，如智能合约执行、隐私保护等，以满足不断增长的业务需求。







