import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Skeleton loading placeholder component.
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} [children] - Children are not rendered, but included for HTMLDivElement compatibility.
 * @property {...React.HTMLAttributes<HTMLDivElement>} [props] - Any other div attributes.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Skeleton loading placeholder component.
 * Provides a pulsing animated placeholder for loading UI elements.
 *
 * @example
 * <Skeleton className="h-8 w-32" />
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="skeleton"
        className={cn('bg-accent animate-pulse rounded-md', className)}
        aria-busy="true"
        aria-label="Loading..."
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';
