import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MarkdownRenderer from '../MarkdownRenderer';

describe('MarkdownRenderer images', () => {
  it('renders lesson images with lazy loading, async decoding, dimensions, and preserved attributes', () => {
    render(
      <MarkdownRenderer
        basePath="/Get-Started-with-Web3/en/GetStartedWithBitcoin/03_BitcoinTx/"
        content={
          '<img src="./img/tx.png" alt="Transaction structure" class="lesson-diagram" width="640" height="360" />'
        }
      />
    );

    const image = screen.getByRole('img', { name: 'Transaction structure' });

    expect(image).toHaveAttribute(
      'src',
      '/Get-Started-with-Web3/en/GetStartedWithBitcoin/03_BitcoinTx/img/tx.png'
    );
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
    expect(image).toHaveAttribute('width', '640');
    expect(image).toHaveAttribute('height', '360');
    expect(image).toHaveClass('lesson-diagram');
    expect(image).toHaveClass('rounded-lg');
  });

  it('uses image metadata to add dimensions to markdown images without inline attrs', () => {
    render(
      <MarkdownRenderer
        basePath="/Get-Started-with-Web3/content/en/GetStartedWithBitcoin/03_BitcoinTx/"
        imageMetadataBase="en/GetStartedWithBitcoin/03_BitcoinTx/"
        imageMetadata={{
          'en/GetStartedWithBitcoin/03_BitcoinTx/img/tx.png': {
            width: 1280,
            height: 720,
          },
        }}
        content="![Transaction chain](./img/tx.png)"
      />
    );

    const image = screen.getByRole('img', { name: 'Transaction chain' });

    expect(image).toHaveAttribute(
      'src',
      '/Get-Started-with-Web3/content/en/GetStartedWithBitcoin/03_BitcoinTx/img/tx.png'
    );
    expect(image).toHaveAttribute('width', '1280');
    expect(image).toHaveAttribute('height', '720');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
  });
});
