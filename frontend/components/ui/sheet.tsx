import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Root sheet component. Wraps Radix Dialog.Root.
 */

/**
 * Props for Sheet component.
 */
export interface SheetProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root> {}

/**
 * Root sheet component. Wraps Radix Dialog.Root.
 *
 * @param {SheetProps} props - Sheet props
 * @returns {JSX.Element}
 */

export function Sheet(
  props: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root>
) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

/**
 * Sheet trigger button. Wraps Radix Dialog.Trigger.
 */

/**
 * Props for SheetTrigger component.
 */
export interface SheetTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger> {}

/**
 * Sheet trigger button. Wraps Radix Dialog.Trigger.
 *
 * @param {SheetTriggerProps} props - Trigger props
 * @returns {JSX.Element}
 */
export const SheetTrigger = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Trigger>,
  SheetTriggerProps
>(function SheetTrigger(props, ref) {
  return (
    <SheetPrimitive.Trigger ref={ref} data-slot="sheet-trigger" {...props} />
  );
});
SheetTrigger.displayName = 'SheetTrigger';

/**
 * Sheet close button. Wraps Radix Dialog.Close.
 */

/**
 * Props for SheetClose component.
 */
export interface SheetCloseProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Close> {}

/**
 * Sheet close button. Wraps Radix Dialog.Close.
 *
 * @param {SheetCloseProps} props - Close props
 * @returns {JSX.Element}
 */
export const SheetClose = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Close>,
  SheetCloseProps
>(function SheetClose(props, ref) {
  return <SheetPrimitive.Close ref={ref} data-slot="sheet-close" {...props} />;
});
SheetClose.displayName = 'SheetClose';

/**
 * Sheet portal. Wraps Radix Dialog.Portal.
 */

/**
 * Props for SheetPortal component.
 */
export interface SheetPortalProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Portal> {}

/**
 * Sheet portal. Wraps Radix Dialog.Portal.
 *
 * @param {SheetPortalProps} props - Portal props
 * @returns {JSX.Element}
 */

export function SheetPortal(
  props: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Portal>
) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

/**
 * Sheet overlay. Wraps Radix Dialog.Overlay.
 */

/**
 * Props for SheetOverlay component.
 */
export interface SheetOverlayProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> {
  className?: string;
}

/**
 * Sheet overlay. Wraps Radix Dialog.Overlay.
 *
 * @param {SheetOverlayProps} props - Overlay props
 * @returns {JSX.Element}
 */
export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  SheetOverlayProps
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Overlay
      ref={ref}
      data-slot="sheet-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className
      )}
      {...props}
    />
  );
});
SheetOverlay.displayName = 'SheetOverlay';

/**
 * Sheet content. Wraps Radix Dialog.Content, includes overlay and close button.
 */

/**
 * Props for SheetContent component.
 */
export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  className?: string;
  children?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Sheet content. Wraps Radix Dialog.Content, includes overlay and close button.
 *
 * @param {SheetContentProps} props - Content props
 * @returns {JSX.Element}
 */
export const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(function SheetContent(
  { className, children, side = 'right', ...props },
  ref
) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        data-slot="sheet-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
          side === 'right' &&
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
          side === 'left' &&
            'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
          side === 'top' &&
            'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
          side === 'bottom' &&
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = 'SheetContent';

/**
 * Sheet header container.
 */

/**
 * Props for SheetHeader component.
 */
export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Sheet header container.
 *
 * @param {SheetHeaderProps} props - Header props
 * @returns {JSX.Element}
 */
export const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(
  function SheetHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="sheet-header"
        className={cn('flex flex-col gap-1.5 p-4', className)}
        {...props}
      />
    );
  }
);
SheetHeader.displayName = 'SheetHeader';

/**
 * Sheet footer container.
 */

/**
 * Props for SheetFooter component.
 */
export interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Sheet footer container.
 *
 * @param {SheetFooterProps} props - Footer props
 * @returns {JSX.Element}
 */
export const SheetFooter = React.forwardRef<HTMLDivElement, SheetFooterProps>(
  function SheetFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="sheet-footer"
        className={cn('mt-auto flex flex-col gap-2 p-4', className)}
        {...props}
      />
    );
  }
);
SheetFooter.displayName = 'SheetFooter';

/**
 * Sheet title. Wraps Radix Dialog.Title.
 */

/**
 * Props for SheetTitle component.
 */
export interface SheetTitleProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title> {
  className?: string;
}

/**
 * Sheet title. Wraps Radix Dialog.Title.
 *
 * @param {SheetTitleProps} props - Title props
 * @returns {JSX.Element}
 */
export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  SheetTitleProps
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Title
      ref={ref}
      data-slot="sheet-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  );
});
SheetTitle.displayName = 'SheetTitle';

/**
 * Sheet description. Wraps Radix Dialog.Description.
 */

/**
 * Props for SheetDescription component.
 */
export interface SheetDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description> {
  className?: string;
}

/**
 * Sheet description. Wraps Radix Dialog.Description.
 *
 * @param {SheetDescriptionProps} props - Description props
 * @returns {JSX.Element}
 */
export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  SheetDescriptionProps
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Description
      ref={ref}
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
});
SheetDescription.displayName = 'SheetDescription';
