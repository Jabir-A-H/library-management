import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

/**
 * Tooltip provider for context and delay. Wraps Radix Tooltip.Provider.
 *
 * @param {object} props - React props
 * @param {number} [props.delayDuration=0] - Delay before showing tooltip
 * @returns {JSX.Element}
 */

/**
 * Props for the TooltipProvider component.
 * @property {number} [delayDuration=0] - Delay before showing tooltip.
 * @property {...TooltipPrimitive.TooltipProviderProps} [props] - Any other provider props.
 */
export interface TooltipProviderProps
  extends TooltipPrimitive.TooltipProviderProps {
  delayDuration?: number;
}

/**
 * Tooltip provider for context and delay. Wraps Radix Tooltip.Provider.
 * Provides context for tooltips and controls delay duration.
 *
 * @example
 * <TooltipProvider delayDuration={200}><Tooltip ... /></TooltipProvider>
 */
const TooltipProvider = ({
  delayDuration = 0,
  ...props
}: TooltipProviderProps) => (
  <TooltipPrimitive.Provider
    data-slot="tooltip-provider"
    delayDuration={delayDuration}
    {...props}
  />
);
TooltipProvider.displayName = 'TooltipProvider';

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

/**
 * Props for the Tooltip component.
 * @property {...TooltipPrimitive.TooltipProps} [props] - Any other tooltip props.
 */
export interface TooltipProps extends TooltipPrimitive.TooltipProps {}

/**
 * Tooltip root. Wraps Radix Tooltip.Root. Use TooltipProvider at a higher level for context.
 * Provides a root for tooltip logic and state.
 *
 * @example
 * <Tooltip><TooltipTrigger ... /><TooltipContent ... /></Tooltip>
 */
const Tooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Root>,
  TooltipProps
>(function Tooltip(props, ref) {
  return <TooltipPrimitive.Root data-slot="tooltip" ref={ref} {...props} />;
});
Tooltip.displayName = 'Tooltip';

/**
 * Tooltip trigger. Wraps Radix Tooltip.Trigger.
 *
 * @param {object} props - React props
 * @returns {JSX.Element}
 */

/**
 * Props for the TooltipTrigger component.
 * @property {...TooltipPrimitive.TooltipTriggerProps} [props] - Any other trigger props.
 */
export interface TooltipTriggerProps
  extends TooltipPrimitive.TooltipTriggerProps {}

/**
 * Tooltip trigger. Wraps Radix Tooltip.Trigger.
 * Provides a trigger for showing the tooltip.
 *
 * @example
 * <TooltipTrigger asChild><button>Hover me</button></TooltipTrigger>
 */
const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  TooltipTriggerProps
>(function TooltipTrigger(props, ref) {
  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      data-slot="tooltip-trigger"
      {...props}
    />
  );
});
TooltipTrigger.displayName = 'TooltipTrigger';

/**
 * Tooltip content. Wraps Radix Tooltip.Content and Arrow inside a Portal.
 *
 * @param {object} props - React props
 * @param {string} [props.className] - Additional class names
 * @param {number} [props.sideOffset=0] - Offset from trigger
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */

/**
 * Props for the TooltipContent component.
 * @property {string} [className] - Additional class names for styling.
 * @property {number} [sideOffset=0] - Offset from trigger.
 * @property {React.ReactNode} children - Tooltip content.
 * @property {...TooltipPrimitive.TooltipContentProps} [props] - Any other content props.
 */
export interface TooltipContentProps
  extends TooltipPrimitive.TooltipContentProps {
  className?: string;
  sideOffset?: number;
  children: React.ReactNode;
}

/**
 * Tooltip content. Wraps Radix Tooltip.Content and Arrow inside a Portal.
 * Provides the content and arrow for the tooltip.
 *
 * @example
 * <TooltipContent sideOffset={8}>Tooltip text</TooltipContent>
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(function TooltipContent(
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
          'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-[--radix-tooltip-content-transform-origin] rounded-md px-3 py-1.5 text-xs text-balance',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
