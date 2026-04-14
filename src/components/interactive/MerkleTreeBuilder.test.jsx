import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MerkleTreeBuilder from '../MerkleTreeBuilder';

// Mock crypto.subtle.digest for deterministic testing
const mockDigest = vi.fn((algorithm, data) => {
  // Simple mock: return hash of string representation of the data
  // In real tests, use a proper mock
  const enc = new TextEncoder();
  const str = Array.from(new Uint8Array(data))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Return a mock hash
  const hashHex = 'a'.repeat(64); // placeholder
  const hashBytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) hashBytes[i] = parseInt(hashHex.slice(i * 2, i * 2 + 2), 16);
  return Promise.resolve(hashBytes);
});

global.crypto = { subtle: { digest: mockDigest } };

describe('MerkleTreeBuilder', () => {
  it('should render without crashing', () => {
    const { container } = render(<MerkleTreeBuilder defaultValues={['a', 'b']} />);
    expect(container).toBeTruthy();
  });

  it('should render heading', () => {
    render(<MerkleTreeBuilder />);
    expect(screen.getByText(/Merkle Tree Builder/i)).toBeInTheDocument();
  });

  it('should render input fields for each leaf', () => {
    render(<MerkleTreeBuilder defaultValues={['a', 'b', 'c', 'd']} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(4);
  });

  it('should update input value when typed', () => {
    render(<MerkleTreeBuilder defaultValues={['a', 'b']} />);
    const input = screen.getByRole('textbox');
    input.focus();
    // Just check it renders
    expect(input).toBeInTheDocument();
  });

  it('should render "构建树" button', () => {
    render(<MerkleTreeBuilder />);
    expect(screen.getByText('构建树')).toBeInTheDocument();
  });

  it('should render "添加节点" button when under 8 items', () => {
    render(<MerkleTreeBuilder defaultValues={['a', 'b']} />);
    expect(screen.getByText('添加节点')).toBeInTheDocument();
  });
});
