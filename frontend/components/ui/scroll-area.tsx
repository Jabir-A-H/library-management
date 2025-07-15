'use client';

import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '@/lib/utils';

/**
 * Scroll area root component. Wraps Radix ScrollArea.Root and Viewport.
 *
 * @param {object} props - React props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} props.children - Scrollable content
 * @returns {JSX.Element}
 */

/**
 * Props for ScrollArea component.
 */
export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Scroll area root component. Wraps Radix ScrollArea.Root and Viewport.
 *
 * @param {ScrollAreaProps} props - Scroll area props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} props.children - Scrollable content
 * @returns {JSX.Element}
 */
export const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(function ScrollArea({ className, children, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-slot="scroll-area"
      className={cn('relative', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = 'ScrollArea';

/**
 * Scrollbar for the scroll area. Wraps Radix ScrollArea.Scrollbar and Thumb.
 *
 * @param {object} props - React props
 * @param {string} [props.className] - Additional class names
 * @param {"vertical"|"horizontal"} [props.orientation="vertical"] - Scrollbar orientation
 * @returns {JSX.Element}
 */

/**
 * Props for ScrollBar component.
 */
export interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar> {
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Scrollbar for the scroll area. Wraps Radix ScrollArea.Scrollbar and Thumb.
 *
 * @param {ScrollBarProps} props - Scrollbar props
 * @param {string} [props.className] - Additional class names
 * @param {"vertical"|"horizontal"} [props.orientation="vertical"] - Scrollbar orientation
 * @returns {JSX.Element}
 */
export const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  ScrollBarProps
>(function ScrollBar({ className, orientation = 'vertical', ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      ref={ref}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        'flex touch-none p-px transition-colors select-none',
        orientation === 'vertical' &&
          'h-full w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' &&
          'h-2.5 flex-col border-t border-t-transparent',
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
});
ScrollBar.displayName = 'ScrollBar';

// Named exports for tree-shaking and editor support
