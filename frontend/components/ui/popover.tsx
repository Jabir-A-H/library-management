"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"


/**
 * Popover root component. Wraps Radix Popover.Root.
 *
 * @param {object} props - React props
 * @returns {JSX.Element}
 */
export const Popover = React.forwardRef(function Popover(props, ref) {
  return <PopoverPrimitive.Root ref={ref} data-slot="popover" {...props} />;
});
Popover.displayName = "Popover";

/**
 * Popover trigger component. Wraps Radix Popover.Trigger.
 *
 * @param {object} props - React props
 * @returns {JSX.Element}
 */
export const PopoverTrigger = React.forwardRef(function PopoverTrigger(props, ref) {
  return <PopoverPrimitive.Trigger ref={ref} data-slot="popover-trigger" {...props} />;
});
PopoverTrigger.displayName = "PopoverTrigger";

/**
 * Popover content component. Wraps Radix Popover.Content inside a Portal.
 *
 * @param {object} props - React props
 * @param {string} [props.className] - Additional class names
 * @param {string} [props.align="center"] - Alignment of the popover
 * @param {number} [props.sideOffset=4] - Offset from the trigger
 * @returns {JSX.Element}
 */
export const PopoverContent = React.forwardRef(function PopoverContent(
  { className, align = "center", sideOffset = 4, ...props },
  ref
) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-[--radix-popover-content-transform-origin] rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = "PopoverContent";

/**
 * Popover anchor component. Wraps Radix Popover.Anchor.
 *
 * @param {object} props - React props
 * @returns {JSX.Element}
 */
export const PopoverAnchor = React.forwardRef(function PopoverAnchor(props, ref) {
  return <PopoverPrimitive.Anchor ref={ref} data-slot="popover-anchor" {...props} />;
});
PopoverAnchor.displayName = "PopoverAnchor";
