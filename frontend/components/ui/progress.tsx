import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

/**
 * Progress bar component. Wraps Radix Progress.Root and Progress.Indicator.
 *
 * @param {object} props - React props
 * @param {string} [props.className] - Additional class names
 * @param {number} [props.value] - Progress value (0-100)
 * @returns {JSX.Element}
 */

/**
 * Progress bar component. Wraps Radix Progress.Root and Progress.Indicator.
 *
 * @param {object} props - React props
 * @param {string} [props.className] - Additional class names
 * @param {number} [props.value] - Progress value (0-100)
 * @returns {JSX.Element}
 */
export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  className?: string;
}
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  function Progress({ className, value = 0, ...props }, ref) {
    return (
      <ProgressPrimitive.Root
        ref={ref}
        data-slot="progress"
        className={cn(
          'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
          className
        )}
        value={value}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="bg-primary h-full w-full flex-1 transition-all"
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  }
);
Progress.displayName = 'Progress';
