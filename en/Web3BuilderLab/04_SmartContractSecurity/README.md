# Smart Contract Security in Practice

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2026--05-orange)
![difficulty](https://img.shields.io/badge/difficulty-advanced-red)

> Smart contracts often protect real funds. A small logic bug can become a complete loss in one transaction. This lab teaches the most common Solidity vulnerabilities, secure coding habits, automated audit tools, and how to read an audit report.

## Table of Contents

- [Why Security Matters](#why-security-matters)
- [Common Vulnerabilities](#common-vulnerabilities)
- [Secure Development Practices](#secure-development-practices)
- [Automated Audit Tools](#automated-audit-tools)
- [How to Read an Audit Report](#how-to-read-an-audit-report)
- [Practical Security Checklist](#practical-security-checklist)
- [Summary](#summary)
- [Further Reading](#further-reading)

---

## Why Security Matters

Traditional software can usually be patched after a bug is found. Smart contracts are different:

- Deployed bytecode may be immutable.
- Contracts can hold user funds directly.
- Attackers do not need to compromise servers.
- One successful transaction can drain an entire pool or vault.
- Public mempools make profitable attacks easier to automate.

The goal is not to memorize every historical exploit. The goal is to build a security mindset:

1. Know the common failure modes.
2. Keep privileged operations small and explicit.
3. Test both normal flows and hostile flows.
4. Use proven libraries instead of rewriting standards.
5. Treat every external call as a trust boundary.

Security is a process, not a single audit at the end.

## Common Vulnerabilities

### Reentrancy

Reentrancy happens when a contract makes an external call before updating its own state. The called contract can reenter the original contract while the old state is still visible.

Vulnerable example:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Vulnerable example. Do not use in production.
contract VulnerableVault {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");

        // Bug: external call happens before the balance is cleared.
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] = 0;
    }
}
```

The attacker contract can call `withdraw()` again from its `receive()` function before `balances[msg.sender]` becomes zero.

Safer version:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SecureVault is ReentrancyGuard {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");

        // Effects first.
        balances[msg.sender] = 0;

        // Interactions last.
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

Main defenses:

- Follow Checks-Effects-Interactions.
- Use OpenZeppelin `ReentrancyGuard` on sensitive flows.
- Be careful with token callbacks, hooks, vault shares, and bridge receivers.
- Remember that ERC-777, ERC-721, ERC-1155, and custom tokens can trigger callbacks.

### Integer Overflow and Underflow

Before Solidity 0.8, arithmetic overflow and underflow did not revert automatically. A `uint8` value of `255 + 1` became `0`, and `0 - 1` became `255`.

Solidity 0.8+ checks arithmetic by default:

```solidity
pragma solidity ^0.8.24;

contract ModernAccounting {
    mapping(address => uint256) public balances;

    function debit(address user, uint256 amount) external {
        // Reverts automatically if amount is larger than the balance.
        balances[user] -= amount;
    }
}
```

The remaining danger is `unchecked`:

```solidity
function risky(uint256 x) external pure returns (uint256) {
    unchecked {
        return x + 1;
    }
}
```

Use `unchecked` only when you can prove the operation cannot overflow. It is common for gas optimization inside bounded loops, but it should not wrap user-controlled accounting logic.

### Access Control Bugs

Access control bugs happen when powerful functions are callable by the wrong address.

Vulnerable example:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VulnerableAdmin {
    mapping(address => uint256) public balances;

    function mint(address to, uint256 amount) external {
        // Bug: anyone can mint.
        balances[to] += amount;
    }

    function emergencyWithdraw() external {
        // Bug: anyone can withdraw all ETH from this contract.
        payable(msg.sender).transfer(address(this).balance);
    }
}
```

Safer version:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract SecureAdmin is AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    mapping(address => uint256) public balances;

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        balances[to] += amount;
    }

    function emergencyWithdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        payable(msg.sender).transfer(address(this).balance);
    }
}
```

Access control rules:

- Use `msg.sender`, not `tx.origin`, for authorization.
- Use OpenZeppelin `Ownable` or `AccessControl`.
- Protect minting, pausing, upgrading, sweeping, oracle updates, and fee changes.
- Put high-risk admin roles behind a multisig and timelock.
- Emit events for every privileged action.

### `tx.origin` Authentication

`tx.origin` is the original externally owned account that started the transaction. `msg.sender` is the direct caller.

If a victim contract checks `tx.origin == owner`, a malicious contract can trick the owner into calling it, then call the victim contract from inside that transaction.

Bad pattern:

```solidity
require(tx.origin == owner, "Not owner");
```

Use:

```solidity
require(msg.sender == owner, "Not owner");
```

In modern Web3, this matters even more because account abstraction, smart wallets, and transaction delegation make caller relationships more complex. Authorization should be explicit and local to the contract logic.

### Oracle Manipulation

Many DeFi protocols need asset prices. If a protocol reads a single DEX spot price as its oracle, an attacker may use a flash loan to move the price for one transaction.

Risky pattern:

```text
large flash loan -> manipulate DEX pool price -> borrow or withdraw at fake price -> repay flash loan
```

Defenses:

- Use robust oracle networks where appropriate.
- Prefer time-weighted average prices for DEX-derived prices.
- Aggregate multiple sources for important assets.
- Check liquidity depth and stale price conditions.
- Add circuit breakers for abnormal price movement.

### Front-Running and MEV

Transactions may be visible before they are included in a block. Searchers can reorder or insert transactions around profitable trades.

Common examples:

- Sandwiching large swaps.
- Front-running liquidation opportunities.
- Back-running oracle updates.
- Copying profitable public transactions.

Defenses depend on the product:

- Set reasonable slippage limits.
- Use private transaction relays where appropriate.
- Use commit-reveal designs for sensitive actions.
- Avoid exposing profitable intermediate states.

### Unchecked External Calls

External calls can fail. Some token contracts do not return booleans exactly as expected. Some contracts revert in fallback paths.

Use OpenZeppelin `SafeERC20` for token interactions:

```solidity
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenVault {
    using SafeERC20 for IERC20;

    function pull(IERC20 token, address from, uint256 amount) external {
        token.safeTransferFrom(from, address(this), amount);
    }
}
```

For native ETH transfers, always check the return value:

```solidity
(bool success, ) = receiver.call{value: amount}("");
require(success, "ETH transfer failed");
```

## Secure Development Practices

### Use Minimal Privilege

Every role should have only the permissions it needs. A deployment owner that can mint unlimited tokens, upgrade implementations, change fees, pause withdrawals, and sweep funds is a major governance risk.

Prefer:

- Separate roles for minting, pausing, upgrading, and treasury operations.
- Multisig for admin roles.
- Timelock for irreversible or high-impact changes.
- Short-lived emergency powers with public event logs.

### Follow Checks-Effects-Interactions

Structure sensitive functions in this order:

1. Checks: validate inputs, balances, permissions, deadlines, and state.
2. Effects: update local state.
3. Interactions: call external contracts or send ETH.

Example:

```solidity
function withdraw(uint256 amount) external nonReentrant {
    require(amount > 0, "Zero amount");
    require(balances[msg.sender] >= amount, "Insufficient balance");

    balances[msg.sender] -= amount;

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

### Use Audited Libraries

Use OpenZeppelin Contracts for standard building blocks:

| Need | Common library |
|------|----------------|
| ERC-20 / ERC-721 / ERC-1155 | OpenZeppelin token contracts |
| Access control | `Ownable`, `AccessControl` |
| Reentrancy protection | `ReentrancyGuard` |
| Emergency pause | `Pausable` |
| Token transfers | `SafeERC20` |
| Signature verification | `ECDSA`, `MessageHashUtils` |

Do not rewrite ERC standards or cryptographic utilities unless you have a strong reason and a formal review process.

### Write Hostile Tests

Good tests include more than the happy path:

- Unauthorized users should fail.
- Zero values and maximum values should be handled.
- External calls should fail safely.
- Reentrancy attempts should fail.
- Fuzz tests should explore random inputs.
- Invariant tests should check properties that must always hold.

Foundry fuzz example:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {SecureVault} from "../src/SecureVault.sol";

contract SecureVaultFuzzTest is Test {
    SecureVault vault;
    address user = address(0xA11CE);

    function setUp() public {
        vault = new SecureVault();
    }

    function testFuzz_DepositUpdatesBalance(uint96 amount) public {
        vm.assume(amount > 0);

        vm.deal(user, amount);
        vm.prank(user);
        vault.deposit{value: amount}();

        assertEq(vault.balances(user), amount);
    }

    function testFuzz_NoBalanceCannotWithdraw(address randomUser) public {
        vm.assume(randomUser != address(0));
        vm.assume(vault.balances(randomUser) == 0);

        vm.prank(randomUser);
        vm.expectRevert("No balance");
        vault.withdraw();
    }
}
```

Run:

```bash
forge test --match-contract SecureVaultFuzzTest
forge test --match-contract SecureVaultFuzzTest --fuzz-runs 10000
```

## Automated Audit Tools

Automated tools do not replace manual review, but they catch many common mistakes quickly.

### Slither

Slither is a Solidity static analyzer from Trail of Bits. It is fast, useful in CI, and good at finding common vulnerability patterns.

Install and run:

```bash
pip install slither-analyzer
slither .
```

Useful variants:

```bash
slither . --filter-paths "node_modules|lib"
slither . --exclude-informational --exclude-low
```

Read Slither output carefully. It usually tells you:

- The affected contract.
- The affected function.
- The source line range.
- The detector name.
- A reference explaining the issue.

Do not blindly silence warnings. First decide whether the issue is real, mitigated by another condition, or a false positive.

### Mythril

Mythril uses symbolic execution to explore possible execution paths.

Install and run:

```bash
pip install mythril
myth analyze contracts/MyContract.sol
myth analyze contracts/MyContract.sol --solv 0.8.24
myth analyze contracts/MyContract.sol --execution-timeout 300
```

Mythril is slower than Slither but may find deeper paths. It is useful for critical contracts, minimal reproduction cases, and learning how symbolic tools reason about contract state.

### Foundry Fuzzing and Invariants

Fuzzing feeds random inputs into test functions. Invariant testing checks properties across many state transitions.

Example invariant:

```text
sum of all user balances must never exceed total assets held by the vault
```

For vaults, lending protocols, AMMs, and bridges, invariants are often more valuable than individual unit tests because they encode the economic rules of the system.

### Tool Comparison

| Tool | Method | Best at | Speed |
|------|--------|---------|-------|
| Slither | Static analysis | Common patterns and CI checks | Fast |
| Mythril | Symbolic execution | Deeper path exploration | Slower |
| Foundry fuzz | Randomized testing | Edge cases and assumptions | Medium |
| Foundry invariants | Stateful testing | Protocol-level properties | Medium |

A practical workflow:

1. Write unit tests and fuzz tests during development.
2. Run Slither before every serious review.
3. Add invariants for accounting-heavy contracts.
4. Use Mythril or similar symbolic tools for critical paths.
5. Get manual review before mainnet deployment.

## How to Read an Audit Report

An audit report is not a safety certificate. It is a scoped review of a specific codebase at a specific commit.

A professional report usually includes:

| Section | What to check |
|---------|---------------|
| Executive Summary | Overall scope, risk level, and key findings |
| Scope | Which contracts and commit were reviewed |
| Methodology | Tools, manual review process, and assumptions |
| Findings | Issues grouped by severity |
| Recommendations | Suggested fixes |
| Fix Review | Whether fixes were reviewed after remediation |
| Appendix | Tool output, test coverage, extra notes |

Severity usually means:

| Severity | Meaning | Example |
|----------|---------|---------|
| Critical | Direct loss of funds or complete control loss | Reentrancy drain, admin bypass |
| High | Serious protocol failure under realistic conditions | Oracle manipulation, broken accounting |
| Medium | Risk under specific conditions | Missing stale price check |
| Low | Best-practice issue or limited impact | Missing events, minor validation gap |
| Informational | Clarity or maintainability improvement | Naming, comments, gas notes |

Questions to ask:

- Were all Critical and High findings fixed?
- Was the fix reviewed by the auditors?
- Did the audit cover the deployed commit?
- Were proxy implementations and upgrade paths included?
- Were tests, scripts, and deployment configuration reviewed?
- Did the team change code after the audit?
- Does the protocol still rely on centralized admin keys?

For users, an audit is one signal. It does not remove the need to understand permissions, upgradeability, oracle design, and economic assumptions.

## Practical Security Checklist

Before deploying or reviewing a contract, check:

- [ ] Every privileged function has explicit access control.
- [ ] No authorization logic relies on `tx.origin`.
- [ ] External calls happen after local state updates.
- [ ] Sensitive functions use `nonReentrant` where appropriate.
- [ ] ERC-20 transfers use `SafeERC20`.
- [ ] Return values from low-level calls are checked.
- [ ] `unchecked` blocks are justified and not user-accounting paths.
- [ ] Oracles handle stale data, bad data, and liquidity manipulation.
- [ ] Admin roles use multisig and timelock for high-impact actions.
- [ ] Upgrade paths are documented and permissioned.
- [ ] Events are emitted for key state changes.
- [ ] Tests include failure cases and hostile scenarios.
- [ ] Slither has been run and findings have been triaged.
- [ ] Critical accounting rules are covered by fuzz or invariant tests.
- [ ] The deployed bytecode is verified on a block explorer.

## Summary

Smart contract security is a core Web3 engineering skill.

Key ideas:

- Reentrancy is prevented by state updates before external calls and by `ReentrancyGuard`.
- Solidity 0.8+ protects normal arithmetic, but `unchecked` still needs review.
- Access control should be explicit, minimal, and protected by multisig for high-risk roles.
- Oracle design is part of security, not an integration detail.
- Automated tools are useful, but manual review and strong tests remain necessary.
- An audit report is scoped evidence, not a guarantee.

The best way to improve is to read real incidents, write exploit tests, fix vulnerable examples, and keep a checklist close while building.

## Further Reading

- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/5.x/) - audited Solidity libraries and security patterns
- [OpenZeppelin Ethernaut](https://ethernaut.openzeppelin.com/) - interactive smart contract security challenges
- [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/) - DeFi security practice labs
- [Slither](https://github.com/crytic/slither) - Solidity static analyzer
- [Mythril](https://github.com/Consensys/mythril) - symbolic execution tool for EVM contracts
- [Foundry Book](https://book.getfoundry.sh/) - testing, fuzzing, and invariant testing with Foundry
- [Secureum](https://secureum.substack.com/) - smart contract security education
- [Rekt](https://rekt.news/) - postmortems of Web3 security incidents

