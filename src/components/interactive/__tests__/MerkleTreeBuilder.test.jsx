import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MerkleTreeBuilder } from '../MerkleTreeBuilder';

const sampleTransactions = ['a', 'b', 'c', 'd'];
const sampleRoot = '58c89d709329eb37285837b042ab6ff72c7c8f74de0446b091b6a0131c102cfd';

describe('MerkleTreeBuilder', () => {
  it('renders a SHA-256 root for the controlled transaction list', async () => {
    render(<MerkleTreeBuilder initialTransactions={sampleTransactions} lang="en" />);

    expect(screen.getByRole('heading', { name: 'Merkle Tree Builder' })).toBeInTheDocument();
    expect(await screen.findByText('58c89d70')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Transaction \d/)).toHaveLength(4);
  });

  it('shows the full hash after tapping an abbreviated hash', async () => {
    render(<MerkleTreeBuilder initialTransactions={sampleTransactions} lang="en" />);

    const rootHash = await screen.findByRole('button', { name: 'Root hash 58c89d70' });
    fireEvent.click(rootHash);

    expect(screen.getByText(sampleRoot)).toBeInTheDocument();
  });

  it('adds and removes transactions within the allowed 4 to 8 range', async () => {
    render(<MerkleTreeBuilder initialTransactions={sampleTransactions} lang="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Add transaction' }));

    expect(screen.getAllByLabelText(/Transaction \d/)).toHaveLength(5);

    fireEvent.click(screen.getByRole('button', { name: 'Remove transaction 5' }));

    expect(screen.getAllByLabelText(/Transaction \d/)).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Remove transaction 1' })).toBeDisabled();
  });
});
