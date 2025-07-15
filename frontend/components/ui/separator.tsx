'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

/**
 * Separator component. Wraps Radix Separator.Root.
 *
 * @param {object} props - React props
 * @param {string} [props.className] - Additional class names
 * @param {"horizontal"|"vertical"} [props.orientation="horizontal"] - Separator orientation
 * @param {boolean} [props.decorative=true] - If true, hides from assistive tech
 * @returns {JSX.Element}
 */

/**
 * Props for Separator component.
 */
export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

/**
 * Separator component. Wraps Radix Separator.Root.
 *
 * @param {SeparatorProps} props - Separator props
 * @param {string} [props.className] - Additional class names
 * @param {"horizontal"|"vertical"} [props.orientation="horizontal"] - Separator orientation
 * @param {boolean} [props.decorative=true] - If true, hides from assistive tech
 * @returns {JSX.Element}
 */
export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(function Separator(
  { className, orientation = 'horizontal', decorative = true, ...props },
  ref
) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className
      )}
      {...props}
    />
  );
});
Separator.displayName = 'Separator';
