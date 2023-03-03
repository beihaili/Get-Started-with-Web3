# Get Started With Web3: 3. 使用Web3的第一个DApp

---

自学入门`Web3`不是一件容易的事，作为一个刚刚入门Web3的新人，梳理一下最简单直观的`Web3`小白入门教程。整合开源社区优质资源，为大家从入门到精通web3指路。每周更新1-3讲.

欢迎关注我的推特：[@beihai1337](https://twitter.com/beihai1337)

北航区块链协会DAO推特： [@BHBA_DAO](https://twitter.com/BHBA_DAO)

进入微信交流群请填表： [表格链接](https:)

文章开源在github： [github.com/beihai1337/GetStartedWithWeb3](https://github.com/beihai1337/GetStartedWithWeb3)

---

## Dapp是什么

Dapp是`Decentralized Application`的缩写，中文翻译为去中心化应用。Dapp是一种基于区块链的应用，它的运行不依赖于中心化的服务器，而是依赖于区块链网络。Dapp的运行结果会被写入区块链中，所有人都可以通过区块链查询到交易的执行结果。Dapp的应用场景广泛，可应用于：

- 去中心化金融：著名的有：Uniswap，Compound，Aave，Synthetix，MakerDAO，Yearn Finance，Curve Finance，Balancer等
- 去中心化社交：著名的有：Damus，Lens protocol等
- NFT：著名的有：OpenSea，Rarible，SuperRare等
- 其他：治理，投票 著名的有：Snapshot，Gnosis等

## 运行Dapp的流程

运行Dapp的流程如下：

1. 开发者创建一个区块链钱包，并获得一些以太币来支付交易费用。
2. 开发者编写Dapp的智能合约，并使用Solidity编程语言进行编码。
3. 开发者部署智能合约到以太坊网络中，例如通过Remix或Truffle等工具。
4. 开发者创建一个前端应用程序来与智能合约进行交互，例如使用React或AngularJS等工具。
5. 专业用户和开发者可以通过web3库连接前端应用程序和以太坊网络，以便与智能合约进行交互。
6. 普通用户通过前端应用程序与智能合约进行交互，例如提交交易或查询数据。

作为快速入门，本文仅介绍第6步，即普通用户通过前端应用程序与智能合约进行交互。第1-5步的内容将在后续的文章中介绍。

## 使用Web3的第一个DApp

这里以[Uniswap](https://uniswap.org/)为例，介绍如何使用Web3的第一个DApp。

1. 打开[Uniswap](https://app.uniswap.org/#/swap)，点击`Metamask`选择`Görli测试网络`。
2. 点击`Connect to a wallet`，选择`Metamask`，然后点击`Connect`。
3. 点击`Select a token`，选择`ETH`，然后点击`Select`。
4. 点击`Select a token`，选择`BTC`，然后点击`Select`。
4. 输入希望交换的金额`0.1`，然后点击`Swap`。
5. 点击`Confirm Swap`，然后点击`Swap`。这时交易已经被提交到以太坊网络中，等待被打包。
6. 点击`View on Etherscan`，然后点击`View`。
7. 交易成功上链，可以在[以太坊区块浏览器](https://goerli.etherscan.io/)中查询到交易的执行结果。

## 总结
本文介绍了如何使用Web3的第一个DApp，即使用Uniswap交换`Görli测试网络`的以太币和比特币。这里使用的是Görli测试网络，因此交易费用非常低，可以随意尝试。如果你想在主网上交易，可以使用以太坊网络，但是交易费用会比较高，因此需要谨慎操作。Dapp的流程中的第1-5步在本文中略去了，实际上它们也很重要，将在后续的进阶学习中介绍。现在，你可以作为用户参与到几乎所有的区块链Dapp应用了，恭喜！🎉🎉🎉好玩归好玩，还是要继续学习哦。下一篇文章我们将进入进阶学习。



