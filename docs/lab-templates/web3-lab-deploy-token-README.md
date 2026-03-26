# Lab: 从零部署 ERC-20 代币

> 通过本实验，你将使用 Foundry 从零开始创建、测试并部署一个 ERC-20 代币到 Sepolia 测试网。

## 前置准备

- **Foundry** 已安装（[安装指南](https://book.getfoundry.sh/getting-started/installation)）
  ```bash
  curl -L https://foundry.paradigm.xyz | bash
  foundryup
  ```
- **MetaMask** 钱包已安装，并持有 Sepolia 测试网 ETH
  - 可通过 [Sepolia Faucet](https://sepoliafaucet.com/) 领取测试 ETH
- 一个代码编辑器（推荐 VS Code + Solidity 插件）

---

## Step 1: 初始化 Foundry 项目

```bash
forge init my-token
cd my-token
```

这会创建一个标准的 Foundry 项目结构：

```
my-token/
├── src/           # 合约源码
├── test/          # 测试文件
├── script/        # 部署脚本
├── lib/           # 依赖库
└── foundry.toml   # Foundry 配置
```

删除模板自带的示例文件：

```bash
rm src/Counter.sol test/Counter.t.sol script/Counter.s.sol
```

---

## Step 2: 安装 OpenZeppelin 合约库

```bash
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

配置 `foundry.toml`，添加 remappings 让编译器能正确找到依赖：

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
remappings = ["@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/"]
```

---

## Step 3: 编写 ERC-20 合约

创建 `src/MyToken.sol`：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title MyToken — 一个简单的 ERC-20 代币
/// @notice 部署时会将全部初始供应量铸造给部署者
contract MyToken is ERC20 {
    /// @param initialSupply 初始供应量（以最小单位 wei 表示）
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply);
    }
}
```

**要点说明：**

- 继承 OpenZeppelin 的 `ERC20`，自动获得 `transfer`、`approve`、`transferFrom` 等标准功能
- `constructor` 在部署时执行一次，将 `initialSupply` 数量的代币铸造给 `msg.sender`（部署者）
- 代币默认 18 位小数，`1 ether`（即 `1e18`）代表 1 个完整代币

---

## Step 4: 编写测试

创建 `test/MyToken.t.sol`：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken public token;
    address public deployer = address(this);
    address public alice = address(0x1);

    uint256 public constant INITIAL_SUPPLY = 1_000_000 ether; // 1,000,000 个代币

    function setUp() public {
        token = new MyToken(INITIAL_SUPPLY);
    }

    /// @notice 验证代币名称
    function test_Name() public view {
        assertEq(token.name(), "MyToken");
    }

    /// @notice 验证代币符号
    function test_Symbol() public view {
        assertEq(token.symbol(), "MTK");
    }

    /// @notice 验证初始供应量全部分配给部署者
    function test_InitialSupply() public view {
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
        assertEq(token.balanceOf(deployer), INITIAL_SUPPLY);
    }

    /// @notice 验证转账功能
    function test_Transfer() public {
        uint256 amount = 1000 ether;

        token.transfer(alice, amount);

        assertEq(token.balanceOf(alice), amount);
        assertEq(token.balanceOf(deployer), INITIAL_SUPPLY - amount);
    }

    /// @notice 验证余额不足时转账失败
    function test_TransferInsufficientBalance() public {
        vm.prank(alice); // 以 alice 身份调用
        vm.expectRevert(); // 预期 revert
        token.transfer(deployer, 1 ether);
    }
}
```

运行测试：

```bash
forge test -vvv
```

你应该看到所有 5 个测试通过：

```
[PASS] test_Name()
[PASS] test_Symbol()
[PASS] test_InitialSupply()
[PASS] test_Transfer()
[PASS] test_TransferInsufficientBalance()
```

---

## Step 5: 部署到 Sepolia 测试网

### 5.1 创建部署脚本

创建 `script/DeployMyToken.s.sol`：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyToken.sol";

contract DeployMyToken is Script {
    function run() external {
        uint256 initialSupply = 1_000_000 ether; // 1,000,000 个代币

        vm.startBroadcast();
        MyToken token = new MyToken(initialSupply);
        vm.stopBroadcast();

        console.log("MyToken deployed at:", address(token));
    }
}
```

### 5.2 配置环境变量

创建 `.env` 文件（**切勿提交到 Git**）：

```bash
PRIVATE_KEY=你的钱包私钥
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/你的API密钥
ETHERSCAN_API_KEY=你的Etherscan_API密钥
```

加载环境变量：

```bash
source .env
```

### 5.3 执行部署

```bash
forge script script/DeployMyToken.s.sol:DeployMyToken \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

部署成功后，终端会输出合约地址，记录下来用于下一步验证。

---

## Step 6: 在 Etherscan 验证合约

验证后，任何人都可以在 Etherscan 上阅读你的合约源码。

```bash
forge verify-contract <你的合约地址> src/MyToken.sol:MyToken \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --chain sepolia \
  --constructor-args $(cast abi-encode "constructor(uint256)" 1000000000000000000000000)
```

> `1000000000000000000000000` 是 `1_000_000 ether` 的 wei 表示（1,000,000 × 10^18）。

验证成功后，你可以在 `https://sepolia.etherscan.io/address/<你的合约地址>#code` 查看源码。

---

## 完成

恭喜你完成了 ERC-20 代币的部署！你已经掌握了：

- 使用 Foundry 初始化和管理 Solidity 项目
- 继承 OpenZeppelin 标准合约
- 编写和运行 Foundry 测试
- 部署合约到测试网并进行 Etherscan 验证

返回课程继续学习：[Get Started with Web3](https://beihaili.github.io/Get-Started-with-Web3/)

---

## 继续扩展

完成本实验后，你可以尝试：

- **添加铸造功能**：实现 `mint()` 函数，允许 owner 增发代币（使用 `Ownable`）
- **添加销毁功能**：继承 `ERC20Burnable`，让持有者可以销毁自己的代币
- **添加暂停功能**：继承 `ERC20Pausable`，实现紧急暂停转账
- **部署到主网**：将 RPC URL 切换为以太坊主网或 Base/Arbitrum 等 L2
- **构建前端**：结合下一个实验「构建你的第一个 DApp」，为代币添加交互界面
