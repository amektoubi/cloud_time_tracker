/**
 * @fileoverview Loading skeleton component
 * @module components/Skeleton
 */

import React from 'react';

interface ISkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
  count?: number;
}

/**
 * Skeleton component for displaying loading placeholders
 *
 * @accessibility
 * - Uses role="status" and aria-label to indicate loading state
 * - Uses aria-hidden="true" to hide from screen readers
 * - Supports reduced motion preferences
 */
const Skeleton: React.FC<ISkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height = '1rem',
  className = '',
  animation = 'pulse',
  count = 1,
}) => {
  const baseStyles: React.CSSProperties = {
    width,
    height,
    display: 'inline-block',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    text: {
      borderRadius: '4px',
      marginBottom: '0.5rem',
    },
    circular: {
      borderRadius: '50%',
    },
    rectangular: {
      borderRadius: '0',
    },
    rounded: {
      borderRadius: '8px',
    },
  };

  const animationStyles: Record<string, React.CSSProperties> = {
    pulse: {
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-pulse 1.5s ease-in-out infinite',
    },
    wave: {
      background: 'linear-gradient(90deg, #f0f0f0 0%, #e8e8e8 50%, #f0f0f0 100%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-wave 1.6s linear infinite',
    },
    none: {},
  };

  const style = {
    ...baseStyles,
    ...variantStyles[variant],
    ...animationStyles[animation],
  };

  // Generate keyframes for animations
  if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes skeleton-pulse {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      @keyframes skeleton-wave {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      @media (prefers-reduced-motion: reduce) {
        .skeleton-animation {
          animation: none !important;
        }
      }
    `;
    if (!document.head.querySelector('#skeleton-styles')) {
      styleSheet.id = 'skeleton-styles';
      document.head.appendChild(styleSheet);
    }
  }

  const skeletons = Array.from({ length: count }, (_, index) => (
    <span
      key={index}
      data-testid="skeleton-wrapper"
      className={`skeleton ${className}`}
      style={style}
      role="status"
      aria-label="Loading content"
      aria-hidden="true"
    />
  ));

  if (count === 1) {
    return skeletons[0];
  }

  return <>{skeletons}</>;
};

// Pre-defined skeleton components for common use cases

export const SkeletonText: React.FC<{ lines?: number; width?: string }> = ({
  lines = 3,
  width = '100%',
}) => {
  return (
    <div style={{ width }}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? '60%' : '100%'}
          variant="text"
          animation="pulse"
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="card skeleton-card">
      <Skeleton height="200px" variant="rounded" animation="pulse" />
      <div className="card-body">
        <Skeleton width="60%" height="24px" variant="text" animation="pulse" />
        <SkeletonText lines={3} />
      </div>
    </div>
  );
};

export const SkeletonTableRow: React.FC<{ columns?: number }> = ({ columns = 5 }) => {
  return (
    <tr>
      {Array.from({ length: columns }, (_, index) => (
        <td key={index}>
          <Skeleton
            width={index === 0 ? '150px' : '100px'}
            height="20px"
            variant="text"
            animation="pulse"
          />
        </td>
      ))}
    </tr>
  );
};

export const SkeletonList: React.FC<{ items?: number }> = ({ items = 5 }) => {
  return (
    <div className="skeleton-list">
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="skeleton-list-item" style={{ marginBottom: '1rem' }}>
          <Skeleton width="100%" height="60px" variant="rounded" animation="pulse" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return <Skeleton width={size} height={size} variant="circular" animation="pulse" />;
};

export const SkeletonButton: React.FC = () => {
  return <Skeleton width="120px" height="40px" variant="rounded" animation="pulse" />;
};

export const SkeletonInput: React.FC = () => {
  return <Skeleton width="100%" height="40px" variant="rounded" animation="pulse" />;
};

export default Skeleton;
