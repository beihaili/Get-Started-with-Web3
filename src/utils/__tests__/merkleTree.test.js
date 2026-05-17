import { describe, expect, it } from 'vitest';
import { buildMerkleTree, abbreviateHash } from '../merkleTree';

describe('merkleTree', () => {
  it('builds a SHA-256 Merkle tree for four transaction strings', async () => {
    const levels = await buildMerkleTree(['a', 'b', 'c', 'd']);

    expect(levels).toHaveLength(3);
    expect(levels[0]).toHaveLength(4);
    expect(levels[1]).toHaveLength(2);
    expect(levels[2]).toHaveLength(1);
    expect(levels[2][0].hash).toBe(
      '58c89d709329eb37285837b042ab6ff72c7c8f74de0446b091b6a0131c102cfd'
    );
  });

  it('duplicates the final node when building a parent level from an odd count', async () => {
    const levels = await buildMerkleTree(['a', 'b', 'c']);

    expect(levels[1]).toHaveLength(2);
    expect(levels[1][1].duplicatedRight).toBe(true);
    expect(levels[1][1].leftHash).toBe(levels[0][2].hash);
    expect(levels[1][1].rightHash).toBe(levels[0][2].hash);
  });

  it('abbreviates hashes to the first eight characters', () => {
    expect(abbreviateHash('58c89d709329eb37')).toBe('58c89d70');
  });
});
