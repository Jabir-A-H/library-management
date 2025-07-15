import * as React from 'react';
import { GripVerticalIcon } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/lib/utils';

/**
 * Root container for a group of resizable panels. Wraps react-resizable-panels PanelGroup.
 *
 * @param {object} props - React props
 * @param {string} [props.className] - Additional class names
 * @returns {JSX.Element}
 */

/**
 * Props for ResizablePanelGroup component.
 */
export interface ResizablePanelGroupProps
  extends React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelGroup> {
  className?: string;
}

/**
 * Root container for a group of resizable panels. Wraps react-resizable-panels PanelGroup.
 *
 * @param {ResizablePanelGroupProps} props - Panel group props
 * @param {string} [props.className] - Additional class names
 * @returns {JSX.Element}
 */
export const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelGroup>,
  ResizablePanelGroupProps
>(function ResizablePanelGroup({ className, ...props }, ref) {
  return (
    <ResizablePrimitive.PanelGroup
      ref={ref}
      data-slot="resizable-panel-group"
      className={cn(
        'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
        className
      )}
      {...props}
    />
  );
});
ResizablePanelGroup.displayName = 'ResizablePanelGroup';

/**
 * Single resizable panel. Wraps react-resizable-panels Panel.
 *
 * @param {object} props - React props
 * @returns {JSX.Element}
 */

/**
 * Props for ResizablePanel component.
 */
export interface ResizablePanelProps
  extends React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Panel> {}

/**
 * Single resizable panel. Wraps react-resizable-panels Panel.
 *
 * @param {ResizablePanelProps} props - Panel props
 * @returns {JSX.Element}
 */
export const ResizablePanel = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.Panel>,
  ResizablePanelProps
>(function ResizablePanel(props, ref) {
  return (
    <ResizablePrimitive.Panel
      ref={ref}
      data-slot="resizable-panel"
      {...props}
    />
  );
});
ResizablePanel.displayName = 'ResizablePanel';

/**
 * Handle for resizing panels. Wraps react-resizable-panels PanelResizeHandle.
 *
 * @param {object} props - React props
 * @param {boolean} [props.withHandle] - If true, shows a visible handle icon
 * @param {string} [props.className] - Additional class names
 * @returns {JSX.Element}
 */

/**
 * Props for ResizableHandle component.
 */
export interface ResizableHandleProps
  extends React.ComponentPropsWithoutRef<
    typeof ResizablePrimitive.PanelResizeHandle
  > {
  withHandle?: boolean;
  className?: string;
}

/**
 * Handle for resizing panels. Wraps react-resizable-panels PanelResizeHandle.
 *
 * @param {ResizableHandleProps} props - Resize handle props
 * @param {boolean} [props.withHandle] - If true, shows a visible handle icon
 * @param {string} [props.className] - Additional class names
 * @returns {JSX.Element}
 */
export const ResizableHandle = React.forwardRef<never, ResizableHandleProps>(
  function ResizableHandle({ withHandle, className, ...props }, _ref) {
    return (
      <ResizablePrimitive.PanelResizeHandle
        data-slot="resizable-handle"
        className={cn(
          'bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',
          className
        )}
        {...props}
      >
        {withHandle && (
          <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
            <GripVerticalIcon className="size-2.5" />
          </div>
        )}
      </ResizablePrimitive.PanelResizeHandle>
    );
  }
);
ResizableHandle.displayName = 'ResizableHandle';

// Named exports for tree-shaking and editor support
