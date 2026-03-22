# Smart Contracts

## CertificateNFT

ERC-721 completion certificate deployed on Base.

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Base mainnet ETH for gas (~$1-5)

### Setup
```bash
cd contracts
forge init --no-commit
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

### Deploy
```bash
# Set mint fee to 0.002 ETH (~$5)
forge create --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  CertificateNFT \
  --constructor-args 2000000000000000

# Verify on Basescan
forge verify-contract $CONTRACT_ADDRESS CertificateNFT \
  --chain base \
  --constructor-args $(cast abi-encode "constructor(uint256)" 2000000000000000)
```

### After Deployment
Update `src/features/nft/contractAbi.js` with the deployed contract address.
