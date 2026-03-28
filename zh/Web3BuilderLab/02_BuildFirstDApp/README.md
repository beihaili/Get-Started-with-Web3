# 构建你的第一个 DApp

![status](https://img.shields.io/badge/ 状态 - 已完成 - success)
![author](https://img.shields.io/badge/ 作者 - beihaili-blue)
![date](https://img.shields.io/badge/ 日期 - 2025--06-orange)
![difficulty](https://img.shields.io/badge/ 难度 - 中级 - yellow)

> 💡 DApp（去中心化应用）是 Web3 世界的核心载体。与传统 Web 应用不同，DApp 的后端逻辑运行在区块链上，用户通过钱包与智能合约直接交互，无需信任中间人。本课将带你从零开始，用 React + wagmi 构建一个能连接钱包、读取链上数据的完整 DApp。

<div align="center">
<a href="https://twitter.com/bhbtc1337">🐦 Twitter</a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">💬 微信交流群 </a> |
<a href="https://github.com/beihaili/Get-Started-with-Web3">⭐ GitHub</a>
</div>

> 购买 BTC / ETH / USDT 等加密货币推荐 [币安](https://www.binance.com/zh-CN)[注册链接](https://www.bsmkweb.cc/register?ref=39797374)

## 目录

- [前言](# 前言)
- [DApp 架构概述](#dapp - 架构概述)
- [创建项目](# 创建项目)
- [配置 wagmi](# 配置 - wagmi)
- [包装应用](# 包装应用)
- [实现钱包连接](# 实现钱包连接)
- [读取智能合约数据（进阶）](# 读取智能合约数据进阶)
- [动手实战](# 动手实战)
- [常见问题](# 常见问题)
- [总结](# 总结)
- [延伸阅读](# 延伸阅读)

## 前言

### 什么是 DApp？

DApp（Decentralized Application）即去中心化应用。它和你平时使用的微信、淘宝等传统 Web 应用有一个根本性的区别：

** 传统 Web 应用：**
```
用户 → 前端界面 → 后端服务器 → 数据库
          ↑
     服务器控制一切
```

- 你的数据存储在公司的服务器上。
- 公司可以随时修改规则、冻结你的账户。
- 你必须信任这家公司不会作恶。

**DApp：**
```
用户 → 前端界面 → 钱包签名 → 区块链（智能合约）
          ↑
     代码即法律，规则公开透明
```

- 核心逻辑运行在区块链上的智能合约中，任何人都可以审计。
- 用户通过钱包（而非账号密码）控制自己的资产和数据。
- 一旦部署，合约规则无法被单方面篡改。

### 本课目标

完成本课后，你将能够：

1. 理解 DApp 的前端架构和关键依赖库。
2. 使用 React + wagmi 搭建一个完整的 DApp 项目。
3. 实现钱包连接、断开、余额查询等核心功能。
4. 读取链上智能合约数据（以 USDT 的 totalSupply 为例）。

** 前置知识：**
- 完成「Web3 快速入门」模块，了解钱包和区块链基础。
- 具备基本的 React 和 JavaScript 开发经验。
- 已安装 MetaMask 钱包并连接到以太坊主网或测试网。

## DApp 架构概述

一个典型的 DApp 前端由以下几层组成：

```
┌─────────────────────────────────────────────────┐
│                   用户 (User)                     │
│         在浏览器中打开 DApp 页面                     │
└────────────────────┬────────────────────────────┘
                     │ 交互
┌────────────────────▼────────────────────────────┐
│              前端 (React App)                     │
│   UI 界面 + wagmi hooks + 状态管理                 │
└────────────────────┬────────────────────────────┘
                     │ 调用
┌────────────────────▼────────────────────────────┐
│             钱包 (MetaMask)                       │
│   管理私钥、签名交易、授权操作                       │
└────────────────────┬────────────────────────────┘
                     │ JSON-RPC
┌────────────────────▼────────────────────────────┐
│           RPC 节点 (Alchemy / Infura)            │
│   将请求转发到区块链网络                             │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│              区块链 (Ethereum)                    │
│   智能合约存储和执行、交易验证和记录                   │
└─────────────────────────────────────────────────┘
```

### 关键库介绍

构建现代 DApp 前端，我们需要三个核心库：

| 库 | 作用 | 类比 |
|---|---|---|
| **wagmi** | React Hooks 形式的以太坊交互库 | 就像 React Query 之于 REST API |
| **viem** | 底层以太坊交互库（wagmi 的基础） | 就像 axios 之于 HTTP |
| **@tanstack/react-query** | 异步状态管理和缓存 | 管理链上数据的请求、缓存、刷新 |

** 为什么选择 wagmi 而不是 ethers.js？**

- wagmi 提供了声明式的 React Hooks，代码更简洁。
- 内置连接状态管理、自动重连、多链切换。
- 与 React 的渲染模型完美契合，不需要手动处理 `useEffect` 中的异步逻辑。
- 社区活跃，已成为 DApp 前端的事实标准。

## 创建项目

### 第一步：初始化 Vite + React 项目

```bash
# 创建项目
npm create vite@latest my-dapp -- --template react

# 进入项目目录
cd my-dapp

# 安装核心依赖
npm install wagmi viem@2.x @tanstack/react-query
```

### 第二步：了解项目结构

安装完成后，你的项目结构如下：

```
my-dapp/
├── public/
├── src/
│   ├── App.jsx          # 主组件（稍后改写）
│   ├── main.jsx         # 入口文件（需要包装 Provider）
│   ├── wagmi.js         # wagmi 配置文件（新建）
│   └── App.css          # 样式文件
├── index.html
├── package.json
└── vite.config.js
```

我们将新建 `src/wagmi.js` 存放配置，修改 `src/main.jsx` 添加 Provider，重写 `src/App.jsx` 实现核心功能。

## 配置 wagmi

在 `src/` 目录下新建 `wagmi.js` 文件。这是整个 DApp 的区块链连接配置：

```javascript
//src/wagmi.js
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

/**
 * wagmi 配置
 * - chains: 支持的区块链网络
 * - connectors: 钱包连接方式
 * - transports: 与区块链通信的方式
 */
export const config = createConfig ({
  chains: [mainnet, sepolia],
  connectors: [
    //injected 连接器：自动检测浏览器中安装的钱包（如 MetaMask）
    injected (),
    // WalletConnect：通过扫码连接移动端钱包（需要 projectId）
    // 前往 https://cloud.walletconnect.com/ 免费获取 projectId
    walletConnect ({
      projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
    }),
  ],
  transports: {
    // 每条链需要配置独立的 transport（通信方式）
    [mainnet.id]: http (),   // 使用默认的公共 RPC
    [sepolia.id]: http (),   // 测试网也用默认 RPC
  },
});
```

### 核心概念解析

**Connector（连接器）是什么？**

Connector 是钱包和 DApp 之间的桥梁。不同的连接方式对应不同的 connector：

| Connector | 说明 | 典型场景 |
|---|---|---|
| `injected ()` | 检测浏览器插件钱包 | MetaMask、Rabby、Coinbase Wallet 等 |
| `walletConnect ()` | 通过 WalletConnect 协议连接 | 手机端钱包扫码连接 |
| `coinbaseWallet ()` | Coinbase Wallet 专用连接器 | Coinbase 钱包用户 |

`injected ()` 是最常用的 —— 当用户安装了 MetaMask 浏览器插件后，MetaMask 会在 `window.ethereum` 上注入一个 Provider 对象，`injected ()` 连接器正是通过它与钱包通信。

**Transport（传输方式）是什么？**

Transport 决定了 DApp 如何与区块链节点通信：

- **`http ()`**：通过 HTTP JSON-RPC 请求与节点通信，最常用、最稳定。
- **`webSocket ()`**：通过 WebSocket 长连接通信，适合需要实时监听事件的场景。

默认情况下 `http ()` 不传参数会使用链的公共 RPC。如果你需要更快更稳定的连接，可以传入 Alchemy 或 Infura 的 URL：

```javascript
import { http } from 'wagmi';

// 使用 Alchemy 提供的 RPC
http ('https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY')
```

## 包装应用

wagmi 使用 React 的 Provider 模式来向整个组件树提供区块链连接能力。我们需要修改 `src/main.jsx`：

```jsx
//src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi';
import App from './App';
import './index.css';

// 创建 React Query 客户端实例，用于管理链上数据的缓存
const queryClient = new QueryClient ();

ReactDOM.createRoot (document.getElementById ('root')).render (
  <React.StrictMode>
    {/* WagmiProvider 提供区块链连接配置 */}
    <WagmiProvider config={config}>
      {/* QueryClientProvider 提供数据缓存和请求管理 */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
```

### 为什么需要 Provider 模式？

如果你用过 React，应该对 Context 不陌生。Provider 模式的核心思想是：** 把共享状态放在组件树的顶层，任何子组件都可以直接访问，而不需要层层传递 props。**

在 DApp 中，「当前连接的钱包地址」「当前所在的链」这些信息几乎每个组件都可能用到。如果不用 Provider，你需要把这些数据从顶层一路传下去 —— 这就是所谓的 "prop drilling" 问题。

两层 Provider 的职责分工：
- **`WagmiProvider`**：管理钱包连接状态、链信息、合约交互等区块链相关状态。
- **`QueryClientProvider`**：管理异步请求的缓存、重试、刷新等 —— 链上数据请求本质也是异步请求。

## 实现钱包连接

现在来到最核心的部分 —— 重写 `src/App.jsx`，实现完整的钱包连接功能：

```jsx
//src/App.jsx
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';

function App () {
  //useAccount: 获取当前钱包连接状态和地址
  const { address, isConnected, chain } = useAccount ();

  //useConnect: 获取可用的连接器，并提供连接方法
  const { connectors, connect, isPending } = useConnect ();

  //useDisconnect: 提供断开连接的方法
  const { disconnect } = useDisconnect ();

  //useBalance: 查询指定地址的 ETH 余额
  // 只有在连接状态下才查询，避免无效请求
  const { data: balance } = useBalance ({
    address: address,
    query: { enabled: isConnected },
  });

  // 未连接状态：显示可用的钱包列表
  if (!isConnected) {
    return (
      <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
        <h1>🌐 My First DApp</h1>
        <p > 请选择一个钱包进行连接：</p>

        {connectors.map ((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect ({ connector })}
            disabled={isPending}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 16px',
              margin: '8px 0',
              fontSize: '16px',
              cursor: isPending ? 'wait' : 'pointer',
              borderRadius: '8px',
              border: '1px solid #ccc',
              background: isPending ? '#f0f0f0' : '#fff',
            }}
          >
            {connector.name}
            {isPending && ' (连接中...)'}
          </button>
        ))}
      </div>
    );
  }

  // 已连接状态：显示账户信息
  return (
    <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1>🌐 My First DApp</h1>

      {/* 账户信息 */}
      <div style={{
        padding: '16px',
        borderRadius: '12px',
        background: '#f8f9fa',
        marginBottom: '16px',
      }}>
        <p><strong > 钱包地址：</strong></p>
        <code style={{ fontSize: '14px', wordBreak: 'break-all' }}>
          {address}
        </code>

        <p style={{ marginTop: '12px' }}>
          <strong > 当前网络：</strong> {chain?.name ?? ' 未知 '}
        </p>

        <p>
          <strong>ETH 余额：</strong>{' '}
          {balance
            ? `${parseFloat (balance.formatted).toFixed (4)} ${balance.symbol}`
            : ' 加载中...'}
        </p>
      </div>

      {/* 断开连接按钮 */}
      <button
        onClick={() => disconnect ()}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '8px',
          border: 'none',
          background: '#e74c3c',
          color: '#fff',
        }}
      >
        断开连接
      </button>
    </div>
  );
}

export default App;
```

### 关键 Hooks 详解

| Hook | 功能 | 返回值 |
|---|---|---|
| `useAccount ()` | 获取当前账户状态 | `address`（地址）、`isConnected`（是否已连接）、`chain`（当前链） |
| `useConnect ()` | 连接钱包 | `connectors`（可用连接器列表）、`connect ()`（连接方法）、`isPending`（是否连接中） |
| `useDisconnect ()` | 断开钱包 | `disconnect ()`（断开方法） |
| `useBalance ()` | 查询原生代币余额 | `data`（余额数据，含 `formatted` 和 `symbol`） |

### 运行效果

启动开发服务器：

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173`，你将看到：

1. ** 未连接状态 **：页面显示所有可用的钱包连接器按钮（如 "MetaMask"、"WalletConnect"）。
2. ** 点击 MetaMask**：MetaMask 弹出授权窗口，要求你确认连接。
3. ** 连接成功 **：页面显示你的钱包地址、当前网络名称和 ETH 余额。
4. ** 点击「断开连接」**：回到未连接状态。

这就是一个最基础的 DApp 了 —— 仅用几十行代码，你就实现了钱包连接和链上数据读取。

## 读取智能合约数据（进阶）

连接钱包只是第一步。DApp 的核心价值在于与智能合约交互。接下来我们用 `useReadContract` hook 读取链上合约数据。

### 示例：读取 USDT 的总发行量

USDT（Tether）是最广泛使用的稳定币之一。它是一个部署在以太坊上的 ERC-20 合约，我们可以调用它的 `totalSupply ()` 函数查询总发行量。

### ABI 是什么？

ABI（Application Binary Interface）是智能合约的接口描述，告诉前端「这个合约有哪些函数、接受什么参数、返回什么类型」。你可以把它理解为合约的 API 文档。

**ABI 从哪里获取？**
- **Etherscan**：在合约页面的 "Contract" → "ABI" 标签下复制。
- **npm 包 **：一些知名合约（如 ERC-20）有标准化的 ABI 包。
- ** 编译产物 **：如果你自己写的合约，编译后会自动生成 ABI。

对于读取 `totalSupply`，我们只需要 ABI 中关于该函数的定义：

```javascript
// ERC-20 标准中 totalSupply 函数的 ABI 片段
const erc20Abi = [
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',   //view 表示只读，不消耗 gas
    inputs: [],                 // 无输入参数
    outputs: [
      { name: '', type: 'uint256' },  // 返回 uint256 类型的数值
    ],
  },
];
```

### 完整代码：合约数据读取组件

新建 `src/ContractReader.jsx`：

```jsx
//src/ContractReader.jsx
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

// USDT 合约地址（以太坊主网）
const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

// 只需要包含我们要调用的函数的 ABI
const erc20Abi = [
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
];

function ContractReader () {
  // 读取 USDT 总发行量
  const { data: totalSupply, isLoading: isLoadingSupply } = useReadContract ({
    address: USDT_ADDRESS,
    abi: erc20Abi,
    functionName: 'totalSupply',
  });

  // 读取 USDT 代币符号
  const { data: symbol, isLoading: isLoadingSymbol } = useReadContract ({
    address: USDT_ADDRESS,
    abi: erc20Abi,
    functionName: 'symbol',
  });

  // 读取 USDT 的小数位数
  const { data: decimals, isLoading: isLoadingDecimals } = useReadContract ({
    address: USDT_ADDRESS,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const isLoading = isLoadingSupply || isLoadingSymbol || isLoadingDecimals;

  return (
    <div style={{
      padding: '16px',
      borderRadius: '12px',
      background: '#eef6ff',
      marginTop: '16px',
    }}>
      <h3>📊 链上合约数据 </h3>
      <p><strong > 合约：</strong> USDT (Tether)</p>
      <p>
        <strong > 合约地址：</strong>{' '}
        <a
          href={`https://etherscan.io/address/${USDT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '13px' }}
        >
          {USDT_ADDRESS.slice (0, 10)}...{USDT_ADDRESS.slice (-8)}
        </a>
      </p>

      {isLoading ? (
        <p>⏳ 正在从区块链读取数据...</p>
      ) : (
        <>
          <p>
            <strong > 代币符号：</strong> {symbol}
          </p>
          <p>
            <strong > 小数位数：</strong> {decimals?.toString ()}
          </p>
          <p>
            <strong > 总发行量：</strong>{' '}
            {totalSupply && decimals
              ? `${Number (formatUnits (totalSupply, decimals)).toLocaleString ()} ${symbol}`
              : ' 读取失败 '}
          </p>
        </>
      )}
    </div>
  );
}

export default ContractReader;
```

然后在 `App.jsx` 的已连接状态区域中引入该组件：

```jsx
// 在 App.jsx 顶部添加导入
import ContractReader from './ContractReader';

// 在「断开连接」按钮上方添加
<ContractReader />
```

运行后，当你连接钱包并处于以太坊主网时，页面会实时显示 USDT 的代币符号、小数位数和总发行量 —— 这些数据都是直接从链上智能合约读取的，没有经过任何中间服务器。

### useReadContract 详解

`useReadContract` 是 wagmi 中最常用的合约读取 hook，核心参数如下：

```javascript
const { data, isLoading, isError, error, refetch } = useReadContract ({
  address: '0x...',          // 合约地址
  abi: [...],                // 合约 ABI
  functionName: 'balanceOf', // 要调用的函数名
  args: ['0x...'],           // 函数参数（可选）
  chainId: 1,                // 指定链 ID（可选，默认当前链）
  query: {
    enabled: true,           // 是否启用查询（可用于条件查询）
    refetchInterval: 10000,  // 自动刷新间隔（毫秒）
  },
});
```

它底层使用 `@tanstack/react-query` 管理请求状态，因此自带缓存、去重、重试、自动刷新等能力 —— 你不需要自己写 `useEffect` + `useState` 来处理异步逻辑。

## 🧪 动手实战

本课配有 Lab 实战环境，你可以在浏览器中直接编写和运行代码。

** 实战任务：**
1. 搭建完整的 DApp 项目并连接 MetaMask 钱包。
2. 显示当前连接的钱包地址和 ETH 余额。
3. 读取任意 ERC-20 合约的 `name`、`symbol` 和 `totalSupply`。

点击课程页面的「开始实战」按钮，进入交互式实战环境。

## 常见问题

### ❓ 点击连接按钮后 MetaMask 没有弹出窗口？

** 原因：** `injected ()` 连接器需要检测到 `window.ethereum` 对象。如果 MetaMask 未安装或被其他钱包插件覆盖，可能无法弹出。

** 解决方案：**
- 确认 MetaMask 浏览器插件已安装并启用。
- 检查是否有多个钱包插件冲突（Rabby、Coinbase Wallet 等可能覆盖 `window.ethereum`）。
- 在 MetaMask 设置中确认当前网站未被阻止。
- 尝试刷新页面后重新连接。

### ❓ 切换网络后页面数据没有更新？

wagmi 已经内置了链变更的自动处理。当用户在 MetaMask 中切换网络时，`useAccount` 返回的 `chain` 会自动更新，相关的 `useBalance` 和 `useReadContract` 查询也会自动重新请求。

如果你发现数据没有刷新，可能是因为：
- 目标链没有在 `wagmi.js` 的 `chains` 中配置。
- 目标链没有配置对应的 `transport`。

确保你的配置中包含所有需要支持的链：

```javascript
import { mainnet, sepolia, polygon } from 'wagmi/chains';

export const config = createConfig ({
  chains: [mainnet, sepolia, polygon],
  transports: {
    [mainnet.id]: http (),
    [sepolia.id]: http (),
    [polygon.id]: http (),
  },
  //...
});
```

### ❓ 如何将 DApp 部署到 Vercel？

你的 DApp 本质上就是一个 Vite + React 项目，部署流程和普通前端项目完全相同：

```bash
# 1. 将代码推送到 GitHub
git init
git add .
git commit -m "feat: my first dapp"
git remote add origin https://github.com/your-name/my-dapp.git
git push -u origin main

# 2. 前往 vercel.com 导入 GitHub 仓库
# 3. Vercel 会自动检测 Vite 框架，直接点击 Deploy

# 或者使用 Vercel CLI 部署
npm install -g vercel
vercel
```

部署后，用户访问你的网站时只需要有 MetaMask 插件，就能与你的 DApp 交互 —— 不需要你运行任何后端服务器。

### ❓ 公共 RPC 速度很慢怎么办？

默认的公共 RPC 节点有请求频率限制，高峰时段可能延迟较高。推荐使用专业的 RPC 服务：

- **Alchemy**：https://www.alchemy.com/ （免费额度充足，推荐新手使用）
- **Infura**：https://infura.io/ （ConsenSys 旗下，老牌稳定）
- **QuickNode**：https://www.quicknode.com/

注册后获取 API Key，替换 transport 配置即可：

```javascript
transports: {
  [mainnet.id]: http ('https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY'),
  [sepolia.id]: http ('https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY'),
},
```

## 总结

在本课中，我们从零构建了一个完整的 DApp 前端，涵盖了以下核心知识点：

### 🏗️ 架构层面
- DApp 与传统 Web 应用的根本区别：后端逻辑运行在区块链上，用户通过钱包控制资产。
- 前端 → 钱包 → RPC 节点 → 区块链的完整数据流。
- wagmi + viem + React Query 的现代 DApp 技术栈。

### 💻 实践层面
- 使用 `createConfig` 配置链、连接器和传输方式。
- 使用 `WagmiProvider` + `QueryClientProvider` 包装应用。
- 使用 `useAccount`、`useConnect`、`useDisconnect`、`useBalance` 实现钱包交互。
- 使用 `useReadContract` 读取智能合约数据。

### 🔑 核心理念
- ** 声明式交互 **：用 React Hooks 描述「要什么数据」，而不是手动管理异步请求流程。
- ** 合约即 API**：ABI 就是合约的接口文档，`useReadContract` 就是调用合约的 `fetch`。
- ** 钱包即身份 **：不再需要账号密码，钱包地址就是用户的唯一身份标识。

下一步，你可以尝试：
- 调用合约的写入函数（`useWriteContract`），发起链上交易。
- 监听合约事件（`useWatchContractEvent`），实时获取链上变更。
- 集成 ConnectKit 或 RainbowKit，获得更美观的钱包连接 UI。

## 延伸阅读

- [wagmi 官方文档](https://wagmi.sh/) — 完整的 API 参考和示例
- [viem 文档](https://viem.sh/) — 底层以太坊交互库文档
- [Ethereum.org DApp 教程](https://ethereum.org/en/developers/tutorials/) — 以太坊官方开发者教程
- [WalletConnect 文档](https://docs.walletconnect.com/) — 多钱包连接协议
- [Alchemy University](https://university.alchemy.com/) — 免费的 Web3 开发课程

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">🏠 返回主页 </a> |
<a href="https://twitter.com/bhbtc1337">🐦 关注作者 </a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">📝 加入交流群 </a>
</div>
