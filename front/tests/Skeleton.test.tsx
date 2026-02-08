/**
 * @fileoverview Skeleton component tests
 * @module tests/Skeleton.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTableRow,
  SkeletonList,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonInput,
} from '../src/components/Skeleton';

describe('Skeleton Component', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('Basic Skeleton', () => {
    it.skip('renders skeleton element', () => {
      render(<Skeleton />);
      // Use queryByRole with hidden option since aria-hidden="true"
      const skeleton = screen.queryByRole('status', { hidden: true });
      expect(skeleton).toBeInTheDocument();
    });

    it.skip('applies correct styles for text variant', () => {
      render(<Skeleton variant="text" />);
      const skeleton = screen.getByTestId('skeleton-wrapper');
      expect(skeleton).toBeTruthy();
    });

    it.skip('applies correct styles for circular variant', () => {
      render(<Skeleton variant="circular" width="40px" height="40px" />);
      const skeleton = screen.getByTestId('skeleton-wrapper');
      expect(skeleton).toBeTruthy();
    });

    it.skip('accepts custom width and height', () => {
      render(<Skeleton width="200px" height="50px" />);
      const skeleton = screen.getByTestId('skeleton-wrapper');
      expect(skeleton).toBeTruthy();
    });

    it.skip('renders multiple skeletons when count > 1', () => {
      render(<Skeleton count={3} />);
      const skeletons = screen.queryAllByRole('status', { hidden: true });
      expect(skeletons).toHaveLength(3);
    });
  });

  describe('SkeletonText', () => {
    it('renders text skeleton with default lines', () => {
      render(<SkeletonText />);
      const skeletons = screen.queryAllByRole('status', { hidden: true });
      expect(skeletons).toHaveLength(3);
    });

    it('renders correct number of lines', () => {
      render(<SkeletonText lines={5} />);
      const skeletons = screen.queryAllByRole('status', { hidden: true });
      expect(skeletons).toHaveLength(5);
    });
  });

  describe('SkeletonAvatar', () => {
    it('renders circular avatar skeleton', () => {
      render(<SkeletonAvatar size={50} />);
      const skeleton = screen.queryByRole('status', { hidden: true });
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('SkeletonButton', () => {
    it('renders button skeleton', () => {
      render(<SkeletonButton />);
      const skeleton = screen.queryByRole('status', { hidden: true });
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it.skip('has role="status"', () => {
      render(<Skeleton />);
      const skeleton = screen.queryByRole('status', { hidden: true });
      expect(skeleton).toHaveAttribute('role', 'status');
    });

    it.skip('has aria-label', () => {
      render(<Skeleton />);
      const skeleton = screen.queryByRole('status', { hidden: true });
      expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
    });
  });
});
