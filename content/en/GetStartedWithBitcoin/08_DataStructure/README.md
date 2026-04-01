# Lesson 08: Blockchain Data Structures — From Linked Lists to Merkle Trees

![status](https://img.shields.io/badge/status-complete-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2025--06-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> In this chapter, we'll dive deep into the two most fundamental and important data structures in Bitcoin: the blockchain and the Merkle tree. These seemingly simple structures, empowered by cryptography, become a crucial pillar of Bitcoin's security.
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [Introduction: How Bitcoin Makes Data Structures Tamper-Proof](#introduction-how-bitcoin-makes-data-structures-tamper-proof)
- [Hash Pointers: Guardians of Data Structures](#hash-pointers-guardians-of-data-structures)
- [Blockchain: A Tamper-Proof Linked List](#blockchain-a-tamper-proof-linked-list)
- [Merkle Trees: Efficient Data Verification](#merkle-trees-efficient-data-verification)
- [Practical Applications: SPV and Light Nodes](#practical-applications-spv-and-light-nodes)
- [FAQ](#faq)
- [Conclusion](#conclusion)

## Introduction: How Bitcoin Makes Data Structures Tamper-Proof

Bitcoin's genius lies in the fact that it didn't invent entirely new data structures — instead, it **cleverly added cryptographic elements to ordinary data structures**.

**Core insight**:
- Linked list + Hash pointers = Blockchain (tamper-proof linked list)
- Binary tree + Hash pointers = Merkle tree (verifiable binary tree)

In traditional centralized systems, data integrity is guaranteed by a trusted central authority. But in decentralized systems like Bitcoin, we need a method that allows every participant to:
- Independently verify data integrity
- Quickly detect data tampering
- Efficiently synchronize and verify transactions

**Solution**: Add "hash pointers" — a cryptographic tool — to ordinary data structures.

## Hash Pointers: Guardians of Data Structures

### Starting with Real-World Pointers

Imagine you're looking up a book in a library:
- **Regular index card**: Only tells you "the book is on shelf A-12-34"
- **Anti-counterfeit index card**: Tells you the location AND includes the book's "fingerprint"

If someone secretly replaces the book:
- The regular index card wouldn't notice
- The anti-counterfeit index card can detect it immediately

### The Evolution of Pointers in Computer Science

In computer science, a **regular pointer** stores the memory address of a data structure:
```
Regular pointer p -> Memory address of struct A -> Contents of struct A
```

A **hash pointer** stores not only the address but also the hash of the structure's contents:
```
Hash pointer h -> {
  Address: Location of struct A
  Hash: SHA256 of struct A's contents
}
```

This way we can not only find the data's location but also detect whether it has been tampered with.

### Technical Implementation

```python
class HashPointer:
    def __init__(self, data, address):
        self.address = address
        self.hash = hashlib.sha256(data.encode()).hexdigest()

    def verify_data(self, data):
        return self.hash == hashlib.sha256(data.encode()).hexdigest()
```

### Properties of Hash Pointers

| Property | Regular Pointer | Hash Pointer |
|----------|----------------|-------------|
| Locate data | Yes | Yes |
| Detect tampering | No | Yes |
| Storage overhead | Small | Larger |
| Verification speed | Not needed | Fast |

## Blockchain: A Tamper-Proof Linked List

### The "Domino Effect" Tamper-Proof Mechanism

The fundamental difference between a blockchain and a regular linked list is its tamper-proof property:

**Regular linked list**:
- Modifying a node only affects that node
- Other nodes remain unchanged
- Cannot detect tampering

**Blockchain**:
- Modifying any block triggers a "domino effect"
- Chain reaction affects all subsequent blocks
- Tampering is immediately detectable

### Technical Implementation

```python
class Block:
    def __init__(self, data, prev_hash):
        self.data = data
        self.prev_hash = prev_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        combined = str(self.data) + str(self.prev_hash)
        return hashlib.sha256(combined.encode()).hexdigest()

class Blockchain:
    def __init__(self):
        self.genesis = Block("Genesis", "0" * 64)
        self.blocks = {self.genesis.hash: self.genesis}
        self.head = self.genesis

    def add_block(self, data):
        new_block = Block(data, self.head.hash)
        self.blocks[new_block.hash] = new_block
        self.head = new_block
        return new_block

    def verify_chain(self):
        # For detailed implementation, see: data_structure_examples.py
        return self._verify_chain_integrity()
```

### The Chain Reaction of Tamper Detection

Let's see what happens if someone tries to tamper with the blockchain:

```
Genesis Block <- Block 1 <- Block 2 <- Block 3 <- Block 4 (latest)
```

**Tamper scenario**: An attacker modifies the contents of Block 2

1. **First-level impact**: Block 2's hash value changes.
2. **Second-level impact**: The "previous hash" stored in Block 3 no longer matches Block 2's new hash.
3. **Repair attempt**: The attacker must also modify Block 3's previous hash.
4. **Chain reaction**: Block 3 is modified, so its hash changes too, and Block 4 no longer matches.
5. **Endless repairs**: Must keep modifying all the way to the latest block.

### Achieving Tamper-Evident Properties

The blockchain achieves two important security properties:

- **Tamper-Evident**: Able to detect tampering.
- **Tamper-Resistant**: Makes tampering computationally infeasible.

**Key insight**: Just by storing the latest block's hash, you can detect any tampering of the entire chain!

```python
# Verify the integrity of the entire chain
def verify_chain_integrity(latest_block_hash):
    """Only one hash is needed to verify the entire chain"""
    if latest_block_hash != stored_hash:
        return "Chain has been tampered with!"
    return "Chain is intact"
```

### Blockchain Tamper-Proof Properties

1. **Hash linking**: Each block is linked to the previous one via a hash pointer.
2. **Cascade effect**: Modifying any block breaks the hash of all subsequent blocks.
3. **Simple verification**: Only need to store the latest block's hash to verify the entire chain.
4. **Storage optimization**: Nodes can keep only the most recent several thousand blocks; earlier blocks can be verified and obtained from other nodes.

## Merkle Trees: Efficient Data Verification

### Understanding Merkle Trees Through "Package Inventory"

Imagine you're a warehouse manager for a delivery company:

**Traditional approach:**
```
Finding a single package:
1. Check the entire warehouse
2. Time complexity: O(n)
```

**Merkle tree approach:**
```
Zone-based warehouse management:
1. Each zone has an inventory list
2. Zone lists form a master list
3. Time complexity: O(log n)
```

### Technical Implementation

```python
class MerkleNode:
    def __init__(self, data=None, left=None, right=None):
        self.data = data
        self.left = left
        self.right = right
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        if self.data:  # Leaf node
            return hashlib.sha256(self.data.encode()).hexdigest()
        else:  # Internal node
            combined = self.left.hash + self.right.hash
            return hashlib.sha256(combined.encode()).hexdigest()

class MerkleTree:
    def __init__(self, transactions):
        self.leaves = [MerkleNode(tx) for tx in transactions]
        self.root = self.build_tree(self.leaves[:])

    def build_tree(self, nodes):
        # For complete implementation, see: data_structure_examples.py
        # Core logic shown here
        if len(nodes) == 1:
            return nodes[0]
        # ... recursively build the tree structure
```

### Properties of Merkle Trees

| Property | Description | Complexity |
|----------|-------------|------------|
| Build tree | Bottom-up construction | O(n) |
| Verify transaction | Provide Merkle path | O(log n) |
| Update transaction | Recalculate path | O(log n) |
| Space usage | Additional hash storage | O(n) |

## Practical Applications: SPV and Light Nodes

### Bitcoin Node Classification

In the Bitcoin network, nodes fall into two categories:

**Full Node**:
- Stores complete block content: block header + block body.
- Has detailed information for all transactions.
- Can independently verify all transactions and blocks.
- Typically runs on servers or PCs.

**Light Node**:
- Stores only block header information.
- Does not have the complete transaction list.
- Relies on full nodes to provide Merkle proofs.
- Suitable for mobile wallet applications.

### Block Structure Explained

Each Bitcoin block consists of two parts:

```
Block = Block Header + Block Body
```

**Block Header** contains:
- Hash of the previous block
- Merkle root hash
- Timestamp, difficulty, and other metadata

**Block Body** contains:
- The actual transaction list
- Organized as a Merkle tree

### SPV (Simplified Payment Verification) Background

**Real-world challenge**:
- A full node needs to store the entire blockchain (hundreds of GB).
- A mobile wallet cannot store that much data.
- But users need to verify transaction authenticity.

**Core question**: How can you verify a transaction without downloading all the data?

**SPV Solution:**
```python
class SPVNode:
    def __init__(self):
        self.block_headers = {}  # Store block headers

    def verify_transaction(self, tx_hash, block_hash, merkle_proof):
        """Verify whether a transaction is in a specified block"""
        if block_hash not in self.block_headers:
            return False
        block_header = self.block_headers[block_hash]
        return self.verify_merkle_proof(tx_hash, merkle_proof,
                                       block_header['merkle_root'])
```

### Light Node Verification Flow

**Core verification flow:**

```python
# 1. Get block headers
def sync_block_headers(self, start_height, count):
    # Sync block header information from full nodes
    pass

# 2. Verify Merkle proof
def verify_merkle_proof(self, tx_hash, proof, root_hash):
    current_hash = hashlib.sha256(tx_hash.encode()).hexdigest()
    for step in proof:
        # Recompute hash based on position information
        if step['is_left']:
            combined = current_hash + step['hash']
        else:
            combined = step['hash'] + current_hash
        current_hash = hashlib.sha256(combined.encode()).hexdigest()
    return current_hash == root_hash

### Merkle Proof Verification Scenario

Let's simulate a real-world scenario:

**Scenario**: Alice transfers to Bob using her mobile wallet, and Bob needs to verify whether this transaction has actually been written to the blockchain.

**Participants**:
- Bob: Light node user (mobile wallet)
- Full node: Server providing the Merkle proof

**Verification process**:

1. **Bob's request**: "Please prove that the Alice -> Bob transaction is in Block #12345"

2. **Full node's response**: Provides the Merkle proof path
   ```
   Merkle Proof = [
     { hash: "0x789...", is_left: false },  # Sibling node 1
     { hash: "0xabc...", is_left: true },   # Sibling node 2
     { hash: "0xdef...", is_left: false }   # Sibling node 3
   ]
   ```

3. **Bob's verification process**:
   ```python
   # Bob only needs to verify this path
   current_hash = hash("Alice -> Bob transaction")
   for step in merkle_proof:
       if step.is_left:
           current_hash = hash(step.hash + current_hash)
       else:
           current_hash = hash(current_hash + step.hash)

   # The final result must equal the Merkle root in the block header
   assert current_hash == block_header.merkle_root
   ```

4. **Verification result**:
   - If the final hash matches -> The transaction is indeed in the block
   - If the final hash doesn't match -> The transaction doesn't exist or data was tampered with

**Key advantages**:
- Bob doesn't need to download the entire block (which may contain thousands of transactions).
- Only a few hash values are needed to complete verification.
- Verification complexity: O(log n) instead of O(n).

# For detailed implementation, see: data_structure_examples.py
```

## Bitcoin's Merkle Tree Implementation

### Bitcoin Uses a Standard (Unsorted) Merkle Tree

**Important clarification**: Bitcoin uses a **standard Merkle tree**. Transaction order is the order in which they appear in the block — **no sorting is performed**.

```python
# How transactions are organized in a Bitcoin block
class BitcoinBlock:
    def __init__(self, transactions):
        # Transactions are in their block order, not sorted
        self.transactions = transactions
        self.merkle_tree = MerkleTree(transactions)  # Maintain original order
        self.merkle_root = self.merkle_tree.root.hash
```

### Why Doesn't Bitcoin Need Sorting?

1. **SPV verification**: Light nodes need to verify that a transaction is indeed in a block.
2. **Block verification**: Full nodes need to verify that a block's Merkle root is correct.
3. **Simple and fast**: No additional sorting overhead when building blocks.

**Not needed**:
- Proving a transaction is "not in" a block (rarely needed in Bitcoin).
- Complex membership queries.
- Data audit functionality.

### How Bitcoin's Merkle Tree Works in Practice

**Transaction order:**
```
Transaction order in a block:
1. Coinbase transaction (mining reward, always first)
2. User transaction 1
3. User transaction 2
4. ...
5. User transaction N

The Merkle tree is built in this order — no sorting!
```

**Construction process:**
```python
def build_bitcoin_merkle_tree(transactions):
    """Bitcoin Merkle tree construction method"""
    # 1. Maintain original transaction order
    leaves = [hash(tx) for tx in transactions]

    # 2. If transaction count is odd, duplicate the last one
    if len(leaves) % 2 == 1:
        leaves.append(leaves[-1])

    # 3. Pair up and build upward
    while len(leaves) > 1:
        next_level = []
        for i in range(0, len(leaves), 2):
            combined = leaves[i] + leaves[i+1]
            next_level.append(double_sha256(combined))
        leaves = next_level

    return leaves[0]  # Merkle root
```

### Real Example: Bitcoin Block #100000

Let's look at a real Bitcoin block example:

**Block information**:
- Height: 100,000
- Transaction count: 4
- Merkle root: `f3e94742aca4b5ef85488dc37c06c3282295ffec960994b2c0d5ac2a25a95766`

**Transaction list** (in original order):
1. Coinbase: `8c14f0db3df150123e6f3dbbf30f8b955a8249b62ac1d1ff16284aefa3d06d87`
2. User TX: `fff2525b8931402dd09222c50775608f75787bd2b87e56995a7bdd30f79702c4`
3. User TX: `6359f0868171b1d194cbee1af2f16ea598ae8fad666d9b012c8ed2b79a236ec4`
4. User TX: `e9a66845e05d5abc0ad04ec80f774a7e585c6e8db975962d069a522137b80c1d`

**Merkle tree construction:**
```
Level 4:                     [Merkle Root]
                              /      \
Level 3:                [Hash1_2]      [Hash3_4]
                      /      \        /      \
Level 2:        [Hash1] [Hash2] [Hash3] [Hash4]
             (Coinbase) (TX1)   (TX2)   (TX3)
```

This is exactly how Bitcoin works in practice!


### Applicability Boundaries of Hash Pointers

Based on the above concepts, hash pointers have one important limitation:

**Data structures that CAN use hash pointers**:
- Linked lists (blockchain)
- Tree structures (Merkle trees)
- Directed acyclic graphs (DAGs)

**Data structures that CANNOT use hash pointers**:
- Cyclic structures (circular linked lists, graphs with cycles)

**Why don't cycles work?**
```
Circular linked list example:
A -> B -> C -> A  (if using hash pointers)

Problem: Circular dependency
- A's hash depends on C's content
- C's hash depends on B's content
- B's hash depends on A's content
- A's hash depends on C's content <- Forms a cycle!

Result: Cannot determine the hash value of any node
```


## FAQ

### Why not use a regular linked list?

**Technical reasons:**
- **Integrity verification**: Regular linked lists cannot detect data tampering.
- **Distributed consensus**: All nodes need to agree on the data state.
- **Light node support**: Regular linked lists don't support SPV verification.

**Security considerations:**
- **Tamper resistance**: Hash linking ensures history cannot be changed.
- **Verification efficiency**: No need to download all data.
- **Fork detection**: Quickly identify chain forks.

### What are the limitations of Merkle trees?

**Technical limitations:**
1. **Storage overhead**: Requires storing additional hash values.
2. **Update cost**: Modifying a leaf node requires recalculating the entire path.
3. **Unsorted nature**: Standard Merkle trees don't support efficient non-existence proofs.

**Solutions:**
1. **Storage optimization**: Use compression techniques.
2. **Batch updates**: Merge multiple update operations.
3. **Sorted variants**: Use sorted Merkle trees.

### How is tree imbalance handled?

**Problem description:**
When the number of transactions is not a power of 2, the tree will be unbalanced.

**Handling method:**
```python
# When the number of nodes is odd, duplicate the last node to balance the tree
if len(nodes) % 2 == 1:
    nodes.append(nodes[-1])

# For the complete tree balancing algorithm, see: data_structure_examples.py
```

## Conclusion

Bitcoin's data structure design represents the combined wisdom of cryptography and computer science:

### Design Philosophy

- **Simplicity**: Uses basic data structures.
- **Verifiability**: Anyone can verify.
- **Efficiency**: Supports light node verification.
- **Security**: Guaranteed by cryptography.

### Technical Highlights

- **Hash pointers**: Add tamper-proof properties to data structures.
- **Blockchain**: Achieves immutable historical records.
- **Merkle trees**: Support efficient data verification.
- **SPV technology**: Makes light node verification possible.

### Practical Value

Mastering these data structures enables you to:
- Understand the foundation of Bitcoin's security.
- Develop light nodes and SPV wallets.
- Design efficient blockchain applications.
- Optimize data verification and synchronization strategies.

### Code Practice

This chapter provides complete, runnable code examples:

| File | Description | Usage |
|------|-------------|-------|
| [`data_structure_examples.py`](./data_structure_examples.py) | Complete data structure implementations | `python data_structure_examples.py` |
| [`test_examples.py`](./test_examples.py) | Functional tests and verification | `python test_examples.py` |

**Learning Checkpoints**:
- Can you run the code and understand the output?
- Can you modify parameters and observe different results?
- Can you explain the Merkle proof verification process?

> **Hands-On Practice**: It's recommended to first run the demo code, then read the implementation details, and finally try modifying code parameters.

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">Home</a> |
<a href="https://twitter.com/bhbtc1337">Follow the Author</a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">Join the Community</a>
</div>
