# Lab: 构建你的第一个 DApp

> 通过本实验，你将使用 React + wagmi + viem 构建一个可以连接钱包、查询余额的去中心化应用（DApp）。

## 前置准备

- **Node.js 18+** 已安装（[下载地址](https://nodejs.org/)）
  ```bash
  node --version  # 确认版本 >= 18
  ```
- **MetaMask** 浏览器插件已安装并创建了钱包
- 一个代码编辑器（推荐 VS Code）

---

## Step 1: 创建 React 项目

使用 Vite 快速创建一个 React 项目：

```bash
npm create vite@latest my-first-dapp -- --template react
cd my-first-dapp
npm install
```

---

## Step 2: 安装 Web3 依赖

安装 wagmi（React Hooks for Ethereum）、viem（底层交互库）和 TanStack React Query（异步状态管理）：

```bash
npm install wagmi viem@2.x @tanstack/react-query
```

---

## Step 3: 配置 wagmi

创建 `src/wagmi.js`，定义链和连接器配置：

```js
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(), // MetaMask 等注入式钱包
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
```

**要点说明：**

- `chains` 定义支持的网络，这里配置了以太坊主网和 Sepolia 测试网
- `injected()` 连接器会自动检测浏览器中安装的钱包（如 MetaMask）
- `http()` 使用默认的公共 RPC 端点；生产环境建议替换为 Alchemy/Infura 等服务

---

## Step 4: 包装 App 组件

替换 `src/main.jsx` 为以下内容：

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi';
import App from './App';
import './index.css';

// 创建 React Query 客户端，用于管理异步请求缓存
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
```

**要点说明：**

- `WagmiProvider` 为整个应用提供钱包连接上下文
- `QueryClientProvider` 是 wagmi v2 的必需依赖，用于管理链上数据的缓存和重新获取

---

## Step 5: 实现钱包连接界面

替换 `src/App.jsx` 为以下内容：

```jsx
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';

function App() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  // 未连接钱包时显示连接按钮
  if (!isConnected) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>My First DApp</h1>
        <p style={styles.subtitle}>连接你的钱包开始使用</p>
        <div style={styles.buttonGroup}>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              style={styles.button}
            >
              {isPending ? '连接中...' : `连接 ${connector.name}`}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 已连接钱包时显示账户信息
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My First DApp</h1>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>钱包信息</h2>

        <div style={styles.infoRow}>
          <span style={styles.label}>地址：</span>
          <span style={styles.value}>{address}</span>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.label}>网络：</span>
          <span style={styles.value}>{chain?.name ?? '未知'}</span>
        </div>

        {balance && (
          <div style={styles.infoRow}>
            <span style={styles.label}>余额：</span>
            <span style={styles.value}>
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </span>
          </div>
        )}
      </div>

      <button onClick={() => disconnect()} style={styles.disconnectButton}>
        断开连接
      </button>
    </div>
  );
}

// 内联样式（简化演示，生产环境推荐使用 CSS 框架）
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    padding: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    marginBottom: '2rem',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  button: {
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '1rem',
    padding: '2rem',
    marginTop: '2rem',
    minWidth: '400px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: '#f1f5f9',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #334155',
  },
  label: {
    color: '#94a3b8',
    fontWeight: '500',
  },
  value: {
    color: '#e2e8f0',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    maxWidth: '250px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  disconnectButton: {
    marginTop: '2rem',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#f87171',
    backgroundColor: 'transparent',
    border: '2px solid #f87171',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

export default App;
```

**核心 Hooks 说明：**

| Hook | 作用 |
|------|------|
| `useAccount` | 获取当前连接的钱包地址、连接状态、所在链 |
| `useConnect` | 提供连接钱包的方法和可用连接器列表 |
| `useDisconnect` | 提供断开钱包连接的方法 |
| `useBalance` | 查询指定地址的原生代币余额 |

---

## Step 6: 运行并测试

启动开发服务器：

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173`，你应该看到：

1. **连接页面**：显示「连接 MetaMask」按钮
2. 点击按钮后，MetaMask 弹窗请求连接授权
3. **账户信息页面**：连接成功后显示钱包地址、当前网络和 ETH 余额
4. 点击「断开连接」可以断开钱包

### 测试清单

- [ ] 页面正常加载，显示连接按钮
- [ ] 点击连接按钮后 MetaMask 弹出授权窗口
- [ ] 授权后正确显示钱包地址
- [ ] 正确显示当前网络名称（如 Ethereum、Sepolia）
- [ ] 正确显示 ETH 余额
- [ ] 切换 MetaMask 网络后页面自动更新
- [ ] 断开连接后回到初始页面

---

## 完成

恭喜你构建了第一个 DApp！你已经掌握了：

- 使用 Vite 创建 React 项目
- 配置 wagmi 连接以太坊网络
- 使用 React Hooks 实现钱包连接和余额查询
- 理解 DApp 的基本架构（前端 + 钱包 + 区块链）

返回课程继续学习：[Get Started with Web3](https://beihaili.github.io/Get-Started-with-Web3/)

---

## 继续扩展

完成本实验后，你可以尝试：

- **读取合约数据**：使用 `useReadContract` 读取链上合约的公开数据（如 ERC-20 余额）
- **发送交易**：使用 `useWriteContract` 调用合约函数（如转账 ERC-20 代币）
- **监听事件**：使用 `useWatchContractEvent` 实时监听合约事件
- **添加多链支持**：配置 Arbitrum、Base 等 L2 网络，实现链切换功能
- **集成 ENS**：使用 `useEnsName` 将地址解析为可读的 `.eth` 域名
- **美化界面**：引入 Tailwind CSS 或 shadcn/ui 提升用户体验
- **结合上一个实验**：连接你部署的 ERC-20 合约，实现代币转账 DApp
