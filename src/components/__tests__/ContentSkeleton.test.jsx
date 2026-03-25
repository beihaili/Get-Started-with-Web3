import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContentSkeleton from '../ContentSkeleton';

describe('ContentSkeleton', () => {
  it('should render skeleton elements', () => {
    render(<ContentSkeleton />);
    expect(screen.getByTestId('content-skeleton')).toBeInTheDocument();
  });

  it('should render multiple skeleton lines', () => {
    const { container } = render(<ContentSkeleton />);
    const skeletonLines = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletonLines.length).toBeGreaterThan(3);
  });
});
