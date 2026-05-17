const encoder = new TextEncoder();

const bytesToHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

/**
 * Hashes a string with the browser-native Web Crypto SHA-256 implementation.
 */
export async function sha256Hex(value) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto API is not available');
  }

  const digest = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(value));
  return bytesToHex(digest);
}

export const abbreviateHash = (hash) => hash.slice(0, 8);

/**
 * Builds a leaf-first Merkle tree from transaction strings.
 * Odd parent levels duplicate the final node, matching the standard Merkle-tree pattern.
 */
export async function buildMerkleTree(transactions) {
  const leaves = await Promise.all(
    transactions.map(async (transaction, index) => ({
      hash: await sha256Hex(transaction),
      value: transaction,
      index,
      type: 'leaf',
    }))
  );

  const levels = [leaves];

  while (levels.at(-1).length > 1) {
    const currentLevel = levels.at(-1);
    const parentLevel = [];

    for (let index = 0; index < currentLevel.length; index += 2) {
      const left = currentLevel[index];
      const right = currentLevel[index + 1] || left;
      const duplicatedRight = !currentLevel[index + 1];

      parentLevel.push({
        hash: await sha256Hex(left.hash + right.hash),
        leftHash: left.hash,
        rightHash: right.hash,
        duplicatedRight,
        type: 'branch',
      });
    }

    levels.push(parentLevel);
  }

  return levels;
}
