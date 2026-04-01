# 从零部署 ERC-20 代币

![status](https://img.shields.io/badge/ 状态 - 已完成 - success)
![author](https://img.shields.io/badge/ 作者 - beihaili-blue)
![date](https://img.shields.io/badge/ 日期 - 2025--06-orange)
![difficulty](https://img.shields.io/badge/ 难度 - 中级 - yellow)

> 💡 ERC-20 是以太坊上最基础、最广泛的代币标准，从 USDT 到 UNI，从 LINK 到 SHIB，几乎所有你在交易所见过的代币都遵循这个标准。本课将带你从零开始，用 Foundry 工具链编写、测试并部署一个属于你自己的 ERC-20 代币。这不仅是学习智能合约开发的最佳起点，也是理解 DeFi 世界运转逻辑的钥匙。

<div align="center">
<a href="https://twitter.com/bhbtc1337">🐦 关注作者 Twitter</a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">💬 加入微信交流群 </a> |
<a href="https://github.com/beihaili/Get-Started-with-Web3">⭐ GitHub 仓库 </a>
</div>

> 购买 BTC / ETH / USDT 等加密货币推荐 [币安](https://www.binance.com/zh-CN)[注册链接](https://www.bsmkweb.cc/register?ref=39797374)

---

## 目录

- [前言](# 前言)
- [ERC-20 标准详解](#erc-20 - 标准详解)
- [开发环境搭建](# 开发环境搭建)
- [编写 MyToken 合约](# 编写 - mytoken - 合约)
- [编写测试](# 编写测试)
- [部署到测试网](# 部署到测试网)
- [在 Etherscan 上验证合约](# 在 - etherscan - 上验证合约)
- [动手实战](# 动手实战)
- [总结](# 总结)
- [延伸阅读](# 延伸阅读)

---

## 前言

### 什么是 ERC-20？

ERC-20（Ethereum Request for Comments 20）是以太坊上最广泛采用的代币标准。它由 Fabian Vogelsteller 和 Vitalik Buterin 在 2015 年提出，定义了一组统一的接口，让所有遵循该标准的代币能够被钱包、交易所和其他智能合约无缝识别和交互。

** 为什么 ERC-20 如此重要？**

- 🔄 ** 互操作性 **：任何遵循 ERC-20 的代币都能被 MetaMask、Uniswap 等工具自动支持，不需要额外适配。
- 💱 **DEX 上架 **：Uniswap、SushiSwap 等去中心化交易所天然支持 ERC-20 代币，你的代币部署后就可以创建交易对。
- 🏦 ** 钱包兼容 **：所有主流钱包（MetaMask、Rainbow、Trust Wallet 等）都能一键添加 ERC-20 代币。
- 📋 ** 标准化 **：开发者只需学习一套接口，就能与成千上万种代币交互。

** 现实中的 ERC-20 代币案例：**

| 代币 | 用途 | 市值量级 |
|------|------|---------|
| USDT / USDC | 稳定币 | 千亿美元 |
| UNI | Uniswap 治理代币 | 数十亿美元 |
| LINK | Chainlink 预言机代币 | 数十亿美元 |
| SHIB | Meme 代币 | 数十亿美元 |

### 本课目标

完成本课后，你将能够：

1. 理解 ERC-20 标准的 6 个核心函数和 2 个事件
2. 使用 Foundry 从零搭建 Solidity 开发环境
3. 继承 OpenZeppelin 合约库编写一个完整的 ERC-20 代币
4. 编写单元测试覆盖核心逻辑
5. 将合约部署到 Sepolia 测试网并在 Etherscan 上验证

---

## ERC-20 标准详解

ERC-20 标准定义了 **6 个核心函数 ** 和 **2 个事件 **，这是所有 ERC-20 代币必须实现的接口。

### 标准接口一览

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC20 - ERC-20 代币标准接口
 * @dev 参见 https://eips.ethereum.org/EIPS/eip-20
 */
interface IERC20 {
    // ============ 查询函数 ============

    /// @notice 返回代币的总发行量
    function totalSupply () external view returns (uint256);

    /// @notice 查询某个地址的代币余额
    /// @param account 要查询的地址
    function balanceOf (address account) external view returns (uint256);

    /// @notice 查询 owner 授权给 spender 的剩余额度
    /// @param owner 代币持有者
    /// @param spender 被授权者
    function allowance (address owner, address spender) external view returns (uint256);

    // ============ 操作函数 ============

    /// @notice 直接转账：从调用者地址转代币给接收者
    /// @param to 接收地址
    /// @param amount 转账金额
    function transfer (address to, uint256 amount) external returns (bool);

    /// @notice 授权：允许 spender 从调用者地址代扣最多 amount 的代币
    /// @param spender 被授权的地址
    /// @param amount 授权额度
    function approve (address spender, uint256 amount) external returns (bool);

    /// @notice 代扣转账：spender 从 from 地址转代币到 to 地址（需先获得授权）
    /// @param from 代币来源地址
    /// @param to 接收地址
    /// @param amount 转账金额
    function transferFrom (address from, address to, uint256 amount) external returns (bool);

    // ============ 事件 ============

    /// @notice 代币转移时触发（包括铸造和销毁）
    event Transfer (address indexed from, address indexed to, uint256 value);

    /// @notice 授权额度变更时触发
    event Approval (address indexed owner, address indexed spender, uint256 value);
}
```

### 核心函数详解

我们把 6 个函数分为两类来理解：

** 查询类（view 函数，不消耗 gas）：**

| 函数 | 作用 | 类比 |
|------|------|------|
| `totalSupply ()` | 返回代币总供应量 | 查看银行发行了多少货币 |
| `balanceOf (address)` | 查询某地址余额 | 查看你的银行卡余额 |
| `allowance (owner, spender)` | 查询授权额度 | 查看你给别人设置的代扣上限 |

** 操作类（写入函数，消耗 gas）：**

| 函数 | 作用 | 类比 |
|------|------|------|
| `transfer (to, amount)` | 直接转账 | 直接给朋友转账 |
| `approve (spender, amount)` | 设置授权额度 | 给水电公司设置自动代扣上限 |
| `transferFrom (from, to, amount)` | 代扣转账 | 水电公司从你账户扣费 |

### 为什么需要 approve + transferFrom？

你可能会想：有了 `transfer` 为什么还需要 `approve` 和 `transferFrom` 这两步操作？

这是因为智能合约无法主动「拉取」你的代币。当你在 Uniswap 上兑换代币时，流程是这样的：

```
第 1 步：你调用 approve (uniswapRouter, 1000)
        → 授权 Uniswap 路由合约最多动用你的 1000 个代币

第 2 步：你调用 Uniswap 的 swap 函数
        → Uniswap 内部调用 transferFrom (你的地址，流动性池，500)
        → 从你的账户转 500 个代币到流动性池
        → 同时把对应的另一种代币转给你
```

这种「先授权，再代扣」的模式，是整个 DeFi 生态运转的基础。

### 两个事件

- **Transfer 事件 **：每当代币发生转移时自动发出，区块浏览器和钱包靠监听这个事件来更新余额显示。当 `from` 为零地址时表示铸造，`to` 为零地址时表示销毁。
- **Approval 事件 **：每当授权额度发生变化时发出，DApp 靠它来追踪授权状态。

---

## 开发环境搭建

### Foundry 是什么？

Foundry 是一套用 Rust 编写的高性能 Solidity 开发工具链，由 Paradigm 团队维护。它包含四个核心工具：

| 工具 | 作用 |
|------|------|
| **forge** | 编译、测试、部署智能合约 |
| **cast** | 与链上合约交互（调用函数、查询数据） |
| **anvil** | 本地以太坊节点（用于开发测试） |
| **chisel** | 交互式 Solidity REPL |

** 与其他工具的对比：**

| 特性 | Foundry | Hardhat | Remix |
|------|---------|---------|-------|
| 语言 | Rust（极快） | JavaScript | 浏览器 |
| 测试语言 | Solidity | JavaScript | 手动 |
| 编译速度 | 极快 | 较快 | 中等 |
| Fuzz Testing | 内置 | 需插件 | 不支持 |
| 适合场景 | 专业开发 | 全栈 DApp | 快速原型 |

Foundry 的最大优势是 ** 用 Solidity 写测试 **—— 和合约同一种语言，不需要在 JS 和 Solidity 之间切换思维。

### 安装 Foundry

```bash
# 一键安装 Foundry
curl -L https://foundry.paradigm.xyz | bash

# 安装完成后执行 foundryup 拉取最新版本
foundryup
```

### 验证安装

```bash
# 检查各工具版本
forge --version
# 输出示例：forge 0.2.0 (xxxxxxx 2025-xx-xx)

cast --version
# 输出示例：cast 0.2.0 (xxxxxxx 2025-xx-xx)

anvil --version
# 输出示例：anvil 0.2.0 (xxxxxxx 2025-xx-xx)
```

如果三个命令都正常输出版本号，说明安装成功。

---

## 编写 MyToken 合约

### 第一步：初始化项目

```bash
# 创建新项目
forge init my-token && cd my-token

# 查看项目结构
tree -L 2
```

Foundry 生成的项目结构如下：

```
my-token/
├── foundry.toml          # 项目配置文件
├── lib/                  # 依赖库目录
│   └── forge-std/        # Foundry 标准测试库
├── script/               # 部署脚本
│   └── Counter.s.sol
├── src/                  # 合约源码
│   └── Counter.sol
└── test/                 # 测试文件
    └── Counter.t.sol
```

### 第二步：安装 OpenZeppelin

OpenZeppelin 是经过大量审计的智能合约标准库，我们不需要从零实现 ERC-20 的每一个细节，继承 OpenZeppelin 的实现即可。

```bash
# 安装 OpenZeppelin Contracts v5
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

### 第三步：配置 remappings

在项目根目录创建 `remappings.txt`，让 Foundry 知道如何找到 OpenZeppelin 的代码：

```bash
# 创建 remappings.txt
echo '@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/' > remappings.txt
```

也可以在 `foundry.toml` 中配置：

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
remappings = ["@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/"]
```

### 第四步：编写合约

删除默认的 `Counter.sol`，创建 `src/MyToken.sol`：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken - 一个简单的 ERC-20 代币
 * @author beihaili
 * @notice 用于学习 ERC-20 标准的示例合约
 * @dev 继承 OpenZeppelin 的 ERC20 和 Ownable 合约
 *
 * 功能说明：
 * - 部署时铸造固定数量的初始代币给部署者
 * - 合约所有者可以额外铸造代币（可选功能）
 * - 继承 ERC20 的所有标准功能（transfer, approve, transferFrom 等）
 */
contract MyToken is ERC20, Ownable {
    /// @notice 代币精度，与 ETH 保持一致（18 位小数）
    uint8 private constant DECIMALS = 18;

    /**
     * @notice 构造函数：部署合约时设置代币名称、符号和初始供应量
     * @param name_ 代币全称，例如 "My Awesome Token"
     * @param symbol_ 代币符号，例如 "MAT"
     * @param initialSupply 初始供应量（以最小单位计算，会自动乘以 10^18）
     *
     * @dev 示例：如果 initialSupply = 1_000_000，实际铸造 1,000,000 * 10^18 个最小单位
     *      这意味着代币总量为 100 万个，每个代币可被拆分到 18 位小数
     */
    constructor (
        string memory name_,
        string memory symbol_,
        uint256 initialSupply
    ) ERC20 (name_, symbol_) Ownable (msg.sender) {
        //_mint 是 OpenZeppelin ERC20 的内部函数
        //msg.sender 是部署合约的地址，所有初始代币都铸造给部署者
        _mint (msg.sender, initialSupply * 10 ** decimals ());
    }

    /**
     * @notice 铸造新代币（仅合约所有者可调用）
     * @param to 接收新代币的地址
     * @param amount 铸造数量（最小单位）
     *
     * @dev 这个函数通过 Ownable 的 onlyOwner 修饰符限制权限
     *      只有部署合约的地址（owner）才能调用
     *      注意：这里的 amount 是最小单位，不会自动乘以 decimals
     */
    function mint (address to, uint256 amount) external onlyOwner {
        _mint (to, amount);
    }
}
```

### 逐行代码解读

让我们逐段拆解这个合约：

**1. 许可证和版本声明 **

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
```

- `SPDX-License-Identifier` 声明开源许可证，MIT 是最宽松的许可。
- `pragma solidity ^0.8.20` 指定编译器版本，`^` 表示兼容 0.8.20 及以上的 0.8.x 版本。我们使用 0.8.20+ 是因为 OpenZeppelin v5 需要这个版本。

**2. 导入依赖 **

```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
```

- `ERC20.sol` 包含了 ERC-20 标准的完整实现（totalSupply、balanceOf、transfer 等全部函数）。
- `Ownable.sol` 提供了所有权管理功能（onlyOwner 修饰符、transferOwnership 等）。

**3. 合约继承 **

```solidity
contract MyToken is ERC20, Ownable {
```

- Solidity 的 `is` 关键字实现多继承。
- 我们的合约同时继承了 ERC20 的全部代币功能和 Ownable 的权限管理功能。

**4. 构造函数 **

```solidity
constructor (
    string memory name_,
    string memory symbol_,
    uint256 initialSupply
) ERC20 (name_, symbol_) Ownable (msg.sender) {
    _mint (msg.sender, initialSupply * 10 ** decimals ());
}
```

- 构造函数只在部署时执行一次。
- `ERC20 (name_, symbol_)` 调用父合约的构造函数设置代币名称和符号。
- `Ownable (msg.sender)` 把合约所有者设为部署者。
- `_mint` 铸造初始代币。`decimals ()` 返回 18，所以 `1_000_000 * 10^18` 就是 100 万个代币。

**5. 铸造函数 **

```solidity
function mint (address to, uint256 amount) external onlyOwner {
    _mint (to, amount);
}
```

- `external` 表示只能从外部调用（比 `public` 稍省 gas）。
- `onlyOwner` 是 Ownable 提供的修饰符，非 owner 调用会 revert。
- 这个函数让 owner 可以增发代币，实际项目中需要谨慎使用。

---

## 编写测试

Foundry 的测试用 Solidity 编写，这是它最大的优势之一 —— 用同一种语言写合约和测试，不需要在 JS 和 Solidity 之间切换。

### 测试基础

- 测试合约继承 `forge-std/Test.sol`
- `setUp ()` 函数在每个测试用例前自动执行
- 测试函数必须以 `test` 前缀开头（如 `testTransfer`）
- 以 `testFail` 开头的函数预期会 revert
- 使用 `assertEq`、`assertTrue`、`assertGt` 等断言函数

### 完整测试代码

删除默认的 `Counter.t.sol`，创建 `test/MyToken.t.sol`：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyToken.sol";

/**
 * @title MyToken 测试合约
 * @dev 覆盖代币名称、符号、总供应量、转账、授权等核心场景
 */
contract MyTokenTest is Test {
    MyToken public token;

    // 测试用地址
    address public deployer = address (1);
    address public alice = address (2);
    address public bob = address (3);

    // 初始供应量：100 万个代币
    uint256 public constant INITIAL_SUPPLY = 1_000_000;

    /// @notice 每个测试用例前自动执行
    function setUp () public {
        // 以 deployer 身份部署合约
        vm.prank (deployer);
        token = new MyToken ("My Awesome Token", "MAT", INITIAL_SUPPLY);
    }

    // ============ 基础属性测试 ============

    /// @notice 测试代币名称是否正确
    function testName () public view {
        assertEq (token.name (), "My Awesome Token");
    }

    /// @notice 测试代币符号是否正确
    function testSymbol () public view {
        assertEq (token.symbol (), "MAT");
    }

    /// @notice 测试总供应量是否正确
    function testTotalSupply () public view {
        // INITIAL_SUPPLY * 10^18
        assertEq (token.totalSupply (), INITIAL_SUPPLY * 10 ** 18);
    }

    /// @notice 测试部署者是否收到了全部初始代币
    function testDeployerBalance () public view {
        assertEq (token.balanceOf (deployer), INITIAL_SUPPLY * 10 ** 18);
    }

    // ============ 转账测试 ============

    /// @notice 测试正常转账
    function testTransfer () public {
        uint256 amount = 1000 * 10 ** 18; // 转 1000 个代币

        //deployer 转 1000 MAT 给 alice
        vm.prank (deployer);
        bool success = token.transfer (alice, amount);

        // 断言转账成功
        assertTrue (success);
        // 断言 alice 收到代币
        assertEq (token.balanceOf (alice), amount);
        // 断言 deployer 余额减少
        assertEq (token.balanceOf (deployer), (INITIAL_SUPPLY * 10 ** 18) - amount);
    }

    /// @notice 测试余额不足时转账应 revert
    function testTransferInsufficientBalance () public {
        uint256 amount = 1000 * 10 ** 18;

        //alice 没有代币，尝试转账应该失败
        vm.prank (alice);
        vm.expectRevert (); // 预期下一次调用会 revert
        token.transfer (bob, amount);
    }

    // ============ 授权与代扣测试 ============

    /// @notice 测试 approve + transferFrom 流程
    function testApproveAndTransferFrom () public {
        uint256 amount = 500 * 10 ** 18;

        //deployer 授权 alice 可代扣 500 MAT
        vm.prank (deployer);
        token.approve (alice, amount);

        // 验证授权额度
        assertEq (token.allowance (deployer, alice), amount);

        //alice 使用授权从 deployer 转代币给 bob
        vm.prank (alice);
        token.transferFrom (deployer, bob, amount);

        // 验证余额
        assertEq (token.balanceOf (bob), amount);
        // 验证授权额度已消耗
        assertEq (token.allowance (deployer, alice), 0);
    }

    // ============ Owner 铸造测试 ============

    /// @notice 测试 owner 可以铸造新代币
    function testMintByOwner () public {
        uint256 mintAmount = 5000 * 10 ** 18;

        vm.prank (deployer);
        token.mint (alice, mintAmount);

        assertEq (token.balanceOf (alice), mintAmount);
        // 总供应量应增加
        assertEq (token.totalSupply (), (INITIAL_SUPPLY * 10 ** 18) + mintAmount);
    }

    /// @notice 测试非 owner 不能铸造
    function testMintByNonOwnerReverts () public {
        vm.prank (alice);
        vm.expectRevert (); // 非 owner 调用 mint 应 revert
        token.mint (alice, 1000 * 10 ** 18);
    }
}
```

### 运行测试

```bash
# 运行所有测试（-vv 显示详细日志）
forge test -vv
```

你应该看到类似这样的输出：

```
[⠊] Compiling...
[⠊] Compiling 1 files with Solc 0.8.28
[⠒] Solc 0.8.28 finished in 1.23s
Compiler run successful!

Ran 7 tests for test/MyToken.t.sol:MyTokenTest
[PASS] testApproveAndTransferFrom () (gas: 52341)
[PASS] testDeployerBalance () (gas: 10521)
[PASS] testMintByNonOwnerReverts () (gas: 12105)
[PASS] testMintByOwner () (gas: 36742)
[PASS] testName () (gas: 9823)
[PASS] testSymbol () (gas: 9801)
[PASS] testTotalSupply () (gas: 10478)
[PASS] testTransfer () (gas: 38123)
[PASS] testTransferInsufficientBalance () (gas: 14892)

Suite result: ok. 7 passed; 0 failed; 0 skipped; finished in 2.81ms
```

所有 7 个测试通过，说明我们的合约逻辑正确。

** 测试输出解读：**

- `[PASS]` 表示测试通过
- 括号中的 `gas` 是该测试消耗的 gas 量
- `-vv` 会显示 `emit` 事件和 `console.log` 输出；使用 `-vvvv` 可以看到完整的 EVM 执行 trace

---

## 部署到测试网

### 第一步：编写部署脚本

删除默认的 `Counter.s.sol`，创建 `script/Deploy.s.sol`：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyToken.sol";

/**
 * @title 部署脚本
 * @dev 使用 forge script 命令执行
 *
 * 部署参数：
 * - 代币名称：My Awesome Token
 * - 代币符号：MAT
 * - 初始供应量：1,000,000（100 万个代币）
 */
contract DeployMyToken is Script {
    function run () external {
        // 从环境变量读取私钥
        uint256 deployerPrivateKey = vm.envUint ("PRIVATE_KEY");

        // 开始广播交易（后续的合约调用会被发送到链上）
        vm.startBroadcast (deployerPrivateKey);

        // 部署合约
        MyToken token = new MyToken (
            "My Awesome Token", // 代币名称
            "MAT",             // 代币符号
            1_000_000          // 初始供应量：100 万
        );

        // 打印部署地址
        console.log ("MyToken deployed at:", address (token));

        vm.stopBroadcast ();
    }
}
```

### 第二步：获取 Sepolia 测试网 ETH

部署合约需要支付 gas 费，在测试网上你可以免费获取测试 ETH：

**Sepolia 水龙头（Faucet）：**

- Google Cloud Faucet：https://cloud.google.com/application/web3/faucet/ethereum/sepolia
- Alchemy Faucet：https://sepoliafaucet.com/
- Infura Faucet：https://www.infura.io/faucet/sepolia

通常每次可以领取 0.5 ETH，足够部署好几个合约了。

### 第三步：配置 RPC 和私钥

你需要一个 Sepolia 的 RPC URL。可以在 [Alchemy](https://www.alchemy.com/) 或 [Infura](https://www.infura.io/) 免费申请。

创建 `.env` 文件存放敏感信息：

```bash
# .env 文件（⚠️ 务必添加到 .gitignore！）
PRIVATE_KEY = 你的私钥
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2 / 你的 API 密钥
ETHERSCAN_API_KEY = 你的 Etherscan_API 密钥
```

> ⚠️ ** 安全警告：**
> - ** 永远不要 ** 在命令行中直接暴露持有真实资产的私钥
> - ** 永远不要 ** 把 `.env` 文件提交到 Git 仓库
> - 测试时请使用 ** 专用的测试钱包 **，不要使用你的主钱包
> - Foundry 也支持 `--keystore` 和 `--ledger` 等更安全的方式管理私钥

### 第四步：执行部署

```bash
# 加载环境变量
source .env

# 部署到 Sepolia 测试网
forge script script/Deploy.s.sol:DeployMyToken \
    --rpc-url $SEPOLIA_RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast
```

** 命令参数解析：**

| 参数 | 作用 |
|------|------|
| `script/Deploy.s.sol:DeployMyToken` | 指定部署脚本和合约名 |
| `--rpc-url` | 目标网络的 RPC 端点 |
| `--private-key` | 部署者的私钥（或使用 `--keystore`） |
| `--broadcast` | 实际发送交易（不加这个参数只是模拟） |

部署成功后你会看到：

```
== Logs ==
  MyToken deployed at: 0x1234...abcd

## Setting up 1 EVM.

Chain 11155111

Estimated gas price: 3.5 gwei
Estimated total gas used for script: 876543
Estimated amount required: 0.003067 ETH

###
Finding wallets for all the necessary addresses...
##
Sending transactions [1/1].
⠁ [00:00:05] Waiting for tx hash...
##### sepolia
✅  Hash: 0xabcd...1234
Contract Address: 0x1234...abcd
Block: 12345678
Paid: 0.002345 ETH (876543 gas * 2.67 gwei)
```

记下 `Contract Address`，后续验证和添加代币都需要用到。

---

## 在 Etherscan 上验证合约

验证合约意味着把源代码上传到 Etherscan，让任何人都能查看你的合约代码、通过 Etherscan 界面直接调用函数。

### 执行验证

```bash
# 验证合约
forge verify-contract \
    < 你的合约地址 > \
    src/MyToken.sol:MyToken \
    --chain sepolia \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    --constructor-args $(cast abi-encode "constructor (string,string,uint256)" "My Awesome Token" "MAT" 1000000)
```

** 参数说明：**

- `< 你的合约地址 >`：部署时返回的合约地址
- `src/MyToken.sol:MyToken`：源文件路径和合约名
- `--chain sepolia`：目标网络
- `--constructor-args`：构造函数的 ABI 编码参数（用 `cast abi-encode` 生成）

也可以在部署时一步完成部署 + 验证：

```bash
forge script script/Deploy.s.sol:DeployMyToken \
    --rpc-url $SEPOLIA_RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY
```

### 验证后的好处

1. ** 源码公开 **：Etherscan 上会显示绿色对勾 ✅，表示合约已验证。
2. **Read Contract**：任何人都可以在 Etherscan 上直接查询 `totalSupply`、`balanceOf` 等只读函数。
3. **Write Contract**：连接钱包后可以直接在 Etherscan 上调用 `transfer`、`approve` 等写入函数。
4. ** 信任度提升 **：用户可以阅读源码确认合约行为，极大提升项目透明度。

### 在 MetaMask 中添加代币

1. 打开 MetaMask，确保网络切换到 **Sepolia 测试网 **
2. 点击 **Import Tokens**（导入代币）
3. 输入你的合约地址，MetaMask 会自动识别代币名称和符号
4. 确认添加后，你就能在钱包中看到你的 MAT 代币余额了

---

## 🧪 动手实战

本课配有 **Lab 实战环境 **，帮助你在真实的开发环境中动手操作。

** 如何开始：**

1. 在课程页面点击 **"开始实战"** 按钮
2. 系统会自动为你 fork 一个包含脚手架代码的模板仓库
3. 按照 Lab 中的分步指引完成合约编写、测试和部署

**Lab 与本课文的关系：**

- 📖 ** 本课文 ** = 知识讲解，帮助你理解原理和概念
- 🔧 **Lab** = 动手操作指南，提供完整的代码模板和逐步指引

两者互相配合：先读课文理解原理，再进入 Lab 动手实践。

---

## 总结

在本课中，我们完成了一个完整的 ERC-20 代币从编写到部署的全流程：

1. **ERC-20 标准 **：理解了 6 个核心函数（totalSupply、balanceOf、transfer、approve、transferFrom、allowance）和 2 个事件（Transfer、Approval）的作用和设计逻辑。

2. **Foundry 工具链 **：学会了使用 forge init 初始化项目、forge install 管理依赖、forge test 运行测试、forge script 部署合约。

3. **OpenZeppelin**：学会了通过继承 OpenZeppelin 的审计过的合约库来快速构建安全的代币合约，避免重复造轮子。

4. ** 测试驱动开发 **：用 Solidity 编写了 7 个测试用例，覆盖了名称、符号、总供应量、转账、余额不足 revert、授权代扣、权限控制等核心场景。

5. ** 部署与验证 **：将合约部署到 Sepolia 测试网，并在 Etherscan 上验证源码，最后在 MetaMask 中添加了自定义代币。

ERC-20 是进入智能合约开发世界的最佳起点。掌握了这个标准之后，你可以继续探索 ERC-721（NFT）、ERC-1155（多代币标准）、DeFi 协议开发等更高级的主题。

---

## 延伸阅读

- [EIP-20 标准原文](https://eips.ethereum.org/EIPS/eip-20) — ERC-20 的正式规范文档
- [OpenZeppelin ERC20 文档](https://docs.openzeppelin.com/contracts/5.x/erc20) — OpenZeppelin v5 的 ERC20 实现文档
- [Foundry Book](https://book.getfoundry.sh/) — Foundry 官方文档，涵盖从入门到高级用法
- [Solidity by Example - ERC20](https://solidity-by-example.org/app/erc20/) — 不使用库的纯手写 ERC-20 实现
- [OpenZeppelin Contracts Wizard](https://wizard.openzeppelin.com/) — 在线可视化生成 ERC-20 / ERC-721 等合约代码

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">🏠 返回主页 </a> |
<a href="https://twitter.com/bhbtc1337">🐦 关注作者 </a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">📝 加入交流群 </a>
</div>
