"use client";
import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"


/**
 * Context for sharing toggle group variant and size.
 * @type {React.Context<{size: string, variant: string}>}
 */
const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
});


/**
 * Toggle group root. Wraps Radix ToggleGroup.Root and provides context for variant/size.
 *
 * @param {object} props - React props
 * @param {string} [props.className] - Additional class names
 * @param {string} [props.variant] - Toggle variant
 * @param {string} [props.size] - Toggle size
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export const ToggleGroup = React.forwardRef(function ToggleGroup(
  { className, variant = "default", size = "default", children, ...props },
  ref
) {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
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
ToggleGroup.displayName = "ToggleGroup";


/**
 * Toggle group item. Wraps Radix ToggleGroup.Item and consumes context for variant/size.
 *
 * @param {object} props - React props
 * @param {string} [props.className] - Additional class names
 * @param {string} [props.variant] - Toggle variant (overrides context)
 * @param {string} [props.size] - Toggle size (overrides context)
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export const ToggleGroupItem = React.forwardRef(function ToggleGroupItem(
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
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";


// Named exports for tree-shaking and editor support
