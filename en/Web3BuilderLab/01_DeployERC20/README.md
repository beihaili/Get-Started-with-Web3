# Deploy an ERC-20 Token From Scratch

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2026--05-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> This lab walks you through building, testing, deploying, and verifying a simple ERC-20 token with Foundry and OpenZeppelin. The goal is not to encourage launching meaningless tokens. The goal is to understand the token standard that powers much of Web3.

## Table of Contents

- [What ERC-20 Is](#what-erc-20-is)
- [What You Will Build](#what-you-will-build)
- [Development Environment](#development-environment)
- [Create the Token Contract](#create-the-token-contract)
- [Write Tests](#write-tests)
- [Deploy to Sepolia](#deploy-to-sepolia)
- [Verify on Etherscan](#verify-on-etherscan)
- [Hands-On Tasks](#hands-on-tasks)
- [Common Mistakes](#common-mistakes)
- [Summary](#summary)
- [Further Reading](#further-reading)

---

## What ERC-20 Is

ERC-20 is the most widely used fungible token standard on Ethereum and EVM chains. “Fungible” means every unit is interchangeable with every other unit, like dollars or ETH.

The standard defines a shared interface:

```solidity
function totalSupply() external view returns (uint256);
function balanceOf(address account) external view returns (uint256);
function transfer(address to, uint256 amount) external returns (bool);
function allowance(address owner, address spender) external view returns (uint256);
function approve(address spender, uint256 amount) external returns (bool);
function transferFrom(address from, address to, uint256 amount) external returns (bool);
```

It also defines two key events:

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);
```

The most important mental model:

- `transfer()` moves your own tokens.
- `approve()` grants another address permission to spend your tokens.
- `transferFrom()` lets the approved address spend within that allowance.

This `approve + transferFrom` pattern powers DEX swaps, lending deposits, vaults, and many DeFi integrations. It is also one of the most common user-risk areas, because unlimited approvals can be abused if a contract is malicious or later compromised.

## What You Will Build

You will create a minimal token named `MyToken`:

- ERC-20 compatible.
- Uses audited OpenZeppelin code.
- Mints an initial supply to the deployer.
- Includes Foundry tests.
- Can be deployed to Sepolia.
- Can be verified on Etherscan.

This is a learning contract. A production token may need ownership controls, supply policy, mint/burn rules, governance, pausability, upgrade decisions, and legal review.

## Development Environment

This lab uses Foundry:

- `forge`: build, test, and script runner.
- `cast`: command-line RPC and ABI tool.
- `anvil`: local Ethereum development node.

Install Foundry:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verify installation:

```bash
forge --version
cast --version
anvil --version
```

Initialize a new project:

```bash
forge init my-token
cd my-token
```

Install OpenZeppelin Contracts:

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

Create `remappings.txt`:

```text
@openzeppelin/=lib/openzeppelin-contracts/
```

## Create the Token Contract

Create `src/MyToken.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title MyToken
/// @notice A minimal ERC-20 token for learning deployment and testing.
contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply);
    }
}
```

Why this is intentionally small:

- OpenZeppelin already implements the standard correctly.
- Solidity 0.8+ has built-in overflow checks.
- The constructor mints once, making the supply easy to reason about.
- There is no owner-only mint function, so no hidden inflation after deployment.

Token decimals default to 18 in OpenZeppelin ERC-20. That means `1 MTK` is represented as `1e18` base units.

## Write Tests

Create `test/MyToken.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MyToken} from "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken token;
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    function setUp() public {
        token = new MyToken(1_000_000 ether);
    }

    function testInitialSupplyBelongsToDeployer() public {
        assertEq(token.totalSupply(), 1_000_000 ether);
        assertEq(token.balanceOf(address(this)), 1_000_000 ether);
    }

    function testTransferMovesBalance() public {
        token.transfer(alice, 100 ether);

        assertEq(token.balanceOf(alice), 100 ether);
        assertEq(token.balanceOf(address(this)), 999_900 ether);
    }

    function testApproveAndTransferFrom() public {
        token.approve(alice, 50 ether);

        vm.prank(alice);
        token.transferFrom(address(this), bob, 50 ether);

        assertEq(token.balanceOf(bob), 50 ether);
        assertEq(token.allowance(address(this), alice), 0);
    }
}
```

Run:

```bash
forge test -vv
```

Expected result: all tests pass.

Tests matter even for a tiny token. They document assumptions: who receives the initial supply, whether transfers work, and whether allowances behave as expected.

## Deploy to Sepolia

Create `.env`:

```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY
```

Never commit `.env`. Add it to `.gitignore`.

Create `script/DeployMyToken.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {MyToken} from "../src/MyToken.sol";

contract DeployMyToken is Script {
    function run() external returns (MyToken) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);
        MyToken token = new MyToken(1_000_000 ether);
        vm.stopBroadcast();

        return token;
    }
}
```

Deploy:

```bash
source .env
forge script script/DeployMyToken.s.sol \
  --rpc-url "$SEPOLIA_RPC_URL" \
  --broadcast \
  -vv
```

Use a test wallet with only small testnet funds. Do not paste a main wallet private key into scripts.

## Verify on Etherscan

After deployment, verify the contract:

```bash
forge verify-contract \
  --chain sepolia \
  --etherscan-api-key "$ETHERSCAN_API_KEY" \
  DEPLOYED_CONTRACT_ADDRESS \
  src/MyToken.sol:MyToken \
  --constructor-args $(cast abi-encode "constructor(uint256)" 1000000000000000000000000)
```

Verification lets other users inspect source code and interact with the contract through Etherscan. For learning, it also helps you understand constructor arguments, ABI encoding, and explorer metadata.

## Hands-On Tasks

Try these exercises:

1. Change the token name and symbol, then redeploy.
2. Add a test that transfer to the zero address reverts.
3. Use `cast call` to read `totalSupply()` from Sepolia.
4. Add the deployed token to MetaMask by contract address.
5. Deploy again with a smaller supply and compare constructor arguments in Etherscan.

## Common Mistakes

| Mistake | Why it matters |
|---------|----------------|
| Using a real wallet private key | Deployment scripts can leak secrets through shell history or logs |
| Forgetting decimals | `1 ether` in tests means `1 * 10^18` token units |
| Writing ERC-20 from scratch | Easy to introduce subtle standard or security bugs |
| Giving unlimited mint power | Hidden inflation destroys user trust |
| Skipping verification | Users cannot inspect the deployed source easily |

## Summary

You learned how to:

- Understand the ERC-20 interface.
- Use OpenZeppelin instead of rewriting token logic.
- Build and test a token with Foundry.
- Deploy to Sepolia.
- Verify source code on Etherscan.

The next lab builds a simple DApp frontend that connects a wallet and reads on-chain data.

## Further Reading

- [ERC-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20)
- [OpenZeppelin ERC-20 Docs](https://docs.openzeppelin.com/contracts/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Solidity Documentation](https://docs.soliditylang.org/)
