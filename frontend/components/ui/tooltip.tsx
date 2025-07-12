import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"


/**
 * Tooltip provider for context and delay. Wraps Radix Tooltip.Provider.
 *
 * @param {object} props - React props
 * @param {number} [props.delayDuration=0] - Delay before showing tooltip
 * @returns {JSX.Element}
 */

const TooltipProvider = ({ delayDuration = 0, ...props }) => (
  <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
);
TooltipProvider.displayName = "TooltipProvider";


/**
 * Tooltip root. Wraps Radix Tooltip.Root and auto-injects TooltipProvider.
 *
 * @param {object} props - React props
 * @returns {JSX.Element}
 */

/**
 * Tooltip root. Wraps Radix Tooltip.Root. Use TooltipProvider at a higher level for context.
 *
 * @param {object} props - React props
 * @returns {JSX.Element}
 */
const Tooltip = React.forwardRef(function Tooltip(props, ref) {
  return (
    <TooltipPrimitive.Root data-slot="tooltip" ref={ref} {...props} />
  );
});
Tooltip.displayName = "Tooltip";


/**
 * Tooltip trigger. Wraps Radix Tooltip.Trigger.
 *
 * @param {object} props - React props
 * @returns {JSX.Element}
 */

const TooltipTrigger = React.forwardRef(function TooltipTrigger(
  props,
  ref
) {
  return <TooltipPrimitive.Trigger ref={ref} data-slot="tooltip-trigger" {...props} />;
});
TooltipTrigger.displayName = "TooltipTrigger";


/**
 * Tooltip content. Wraps Radix Tooltip.Content and Arrow inside a Portal.
 *
 * @param {object} props - React props
 * @param {string} [props.className] - Additional class names
 * @param {number} [props.sideOffset=0] - Offset from trigger
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
const TooltipContent = React.forwardRef(function TooltipContent(
  { className, sideOffset = 0, children, ...props },
  ref
) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-[--radix-tooltip-content-transform-origin] rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
