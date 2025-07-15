'use client';
import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import { cn } from '@/lib/utils';
import { toggleVariants } from '@/components/ui/toggle';

/**
 * Context for sharing toggle group variant and size.
 * @type {React.Context<{size: string, variant: string}>}
 */
const ToggleGroupContext = React.createContext({
  size: 'default',
  variant: 'default',
});

/**
 * Props for the ToggleGroup component.
 * @property {string} [className] - Additional class names for styling.
 * @property {string} [variant] - Toggle variant.
 * @property {string} [size] - Toggle size.
 * @property {React.ReactNode} children - Child toggle items.
 * @property {...ToggleGroupPrimitive.ToggleGroupProps} [props] - Any other Radix toggle group props.
 */
export interface ToggleGroupProps
  extends ToggleGroupPrimitive.ToggleGroupProps {
  className?: string;
  variant?: string;
  size?: string;
  children: React.ReactNode;
}

/**
 * Toggle group root. Wraps Radix ToggleGroup.Root and provides context for variant/size.
 * Provides a customizable, accessible group of toggle buttons.
 *
 * @example
 * <ToggleGroup variant="outline" size="sm"><ToggleGroupItem value="a" /></ToggleGroup>
 */
export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(function ToggleGroup(
  { className, variant = 'default', size = 'default', children, ...props },
  ref
) {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        'group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs',
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});
ToggleGroup.displayName = 'ToggleGroup';

/**
 * Props for the ToggleGroupItem component.
 * @property {string} [className] - Additional class names for styling.
 * @property {string} [variant] - Toggle variant (overrides context).
 * @property {string} [size] - Toggle size (overrides context).
 * @property {React.ReactNode} children - Content of the toggle item.
 * @property {...ToggleGroupPrimitive.ToggleGroupItemProps} [props] - Any other Radix toggle group item props.
 */
export interface ToggleGroupItemProps
  extends ToggleGroupPrimitive.ToggleGroupItemProps {
  className?: string;
  variant?: string;
  size?: string;
  children: React.ReactNode;
}

/**
 * Toggle group item. Wraps Radix ToggleGroup.Item and consumes context for variant/size.
 * Provides a customizable, accessible toggle button within a group.
 *
 * @example
 * <ToggleGroupItem value="a">A</ToggleGroupItem>
 */
export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(function ToggleGroupItem(
  { className, children, variant, size, ...props },
  ref
) {
  const context = React.useContext(ToggleGroupContext);
  const resolvedVariant = variant || context.variant;
  const resolvedSize = size || context.size;
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      className={cn(
        toggleVariants({
          variant: resolvedVariant,
          size: resolvedSize,
        }),
        'min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l',
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
ToggleGroupItem.displayName = 'ToggleGroupItem';

// Named exports for tree-shaking and editor support
