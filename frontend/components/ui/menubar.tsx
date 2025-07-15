import * as React from 'react';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Menubar root component. Provides the main menubar container.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */

/**
 * Menubar root component. Provides the main menubar container.
 */
const Menubar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function Menubar({ className, ...props }, ref) {
  // Only pass className and data-slot to Radix Root
  return (
    <MenubarPrimitive.Root
      ref={ref}
      data-slot="menubar"
      className={cn(
        'bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs',
        className
      )}
    />
  );
});
Menubar.displayName = 'Menubar';

/**
 * MenubarMenu component. Container for a menu in the menubar.
 */
const MenubarMenu = (props: React.HTMLAttributes<HTMLDivElement>) => {
  // Only pass data-slot
  return <MenubarPrimitive.Menu data-slot="menubar-menu" />;
};
MenubarMenu.displayName = 'MenubarMenu';

/**
 * MenubarGroup component. Groups items within a menu.
 */
const MenubarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function MenubarGroup(props, ref) {
  return <MenubarPrimitive.Group ref={ref} data-slot="menubar-group" />;
});
MenubarGroup.displayName = 'MenubarGroup';

const MenubarPortal = MenubarPrimitive.Portal;

/**
 * MenubarRadioGroup component. Groups radio items within a menu.
 */
const MenubarRadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function MenubarRadioGroup(props, ref) {
  return (
    <MenubarPrimitive.RadioGroup ref={ref} data-slot="menubar-radio-group" />
  );
});
MenubarRadioGroup.displayName = 'MenubarRadioGroup';

/**
 * MenubarTrigger component. Trigger to open a menu.
 */
const MenubarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function MenubarTrigger({ className, ...props }, ref) {
  return (
    <MenubarPrimitive.Trigger
      ref={ref}
      data-slot="menubar-trigger"
      className={cn(
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none',
        className
      )}
      {...props}
    />
  );
});
MenubarTrigger.displayName = 'MenubarTrigger';

/**
 * MenubarContent component. Content area for a menu.
 */
interface MenubarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  sideOffset?: number;
}
const MenubarContent = React.forwardRef<HTMLDivElement, MenubarContentProps>(
  function MenubarContent(
    { className, align = 'start', alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) {
    return (
      <MenubarPortal>
        <MenubarPrimitive.Content
          ref={ref}
          data-slot="menubar-content"
          align={align}
          alignOffset={alignOffset}
          sideOffset={sideOffset}
          className={cn(
            'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md',
            className
          )}
          {...props}
        />
      </MenubarPortal>
    );
  }
);
MenubarContent.displayName = 'MenubarContent';

/**
 * MenubarItem component. Menu item in the menubar.
 */
interface MenubarItemProps {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  className?: string;
  onSelect?: (event: Event) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}
const MenubarItem = React.forwardRef<HTMLDivElement, MenubarItemProps>(
  function MenubarItem(
    { className, inset, variant = 'default', onSelect, disabled, children },
    ref
  ) {
    return (
      <MenubarPrimitive.Item
        ref={ref}
        data-slot="menubar-item"
        data-inset={inset}
        data-variant={variant}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        onSelect={onSelect}
        disabled={disabled}
      >
        {children}
      </MenubarPrimitive.Item>
    );
  }
);
MenubarItem.displayName = 'MenubarItem';

/**
 * MenubarCheckboxItem component. Checkbox item in the menubar.
 */
interface MenubarCheckboxItemProps {
  checked?: boolean;
  onSelect?: (event: Event) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}
const MenubarCheckboxItem = React.forwardRef<
  HTMLDivElement,
  MenubarCheckboxItemProps
>(function MenubarCheckboxItem(
  { className, children, checked, onSelect, disabled },
  ref
) {
  return (
    <MenubarPrimitive.CheckboxItem
      ref={ref}
      data-slot="menubar-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      onSelect={onSelect}
      disabled={disabled}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
});
MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

/**
 * MenubarRadioItem component. Radio item in the menubar.
 */
interface MenubarRadioItemProps {
  value: string;
  className?: string;
  onSelect?: (event: Event) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}
const MenubarRadioItem = React.forwardRef<
  HTMLDivElement,
  MenubarRadioItemProps
>(function MenubarRadioItem(
  { value, className, children, onSelect, disabled },
  ref
) {
  return (
    <MenubarPrimitive.RadioItem
      ref={ref}
      data-slot="menubar-radio-item"
      value={value}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onSelect={onSelect}
      disabled={disabled}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
});
MenubarRadioItem.displayName = 'MenubarRadioItem';

/**
 * MenubarLabel component. Label for a menu or group.
 */
interface MenubarLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}
const MenubarLabel = React.forwardRef<HTMLDivElement, MenubarLabelProps>(
  function MenubarLabel({ className, inset, ...props }, ref) {
    return (
      <MenubarPrimitive.Label
        ref={ref}
        data-slot="menubar-label"
        data-inset={inset}
        className={cn(
          'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
          className
        )}
        {...props}
      />
    );
  }
);
MenubarLabel.displayName = 'MenubarLabel';

/**
 * MenubarSeparator component. Separator line between items.
 */
const MenubarSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function MenubarSeparator({ className, ...props }, ref) {
  return (
    <MenubarPrimitive.Separator
      ref={ref}
      data-slot="menubar-separator"
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
});
MenubarSeparator.displayName = 'MenubarSeparator';

/**
 * MenubarShortcut component. Shortcut text for a menu item.
 */
const MenubarShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(function MenubarShortcut({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      data-slot="menubar-shortcut"
      className={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        className
      )}
      {...props}
    />
  );
});
MenubarShortcut.displayName = 'MenubarShortcut';

/**
 * MenubarSub component. Submenu container.
 */
const MenubarSub = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" />;
};
MenubarSub.displayName = 'MenubarSub';

/**
 * MenubarSubTrigger component. Trigger for submenu.
 */
interface MenubarSubTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
  children?: React.ReactNode;
}
const MenubarSubTrigger = React.forwardRef<
  HTMLDivElement,
  MenubarSubTriggerProps
>(function MenubarSubTrigger({ className, inset, children, ...props }, ref) {
  return (
    <MenubarPrimitive.SubTrigger
      ref={ref}
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[inset]:pl-8',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </MenubarPrimitive.SubTrigger>
  );
});
MenubarSubTrigger.displayName = 'MenubarSubTrigger';

/**
 * MenubarSubContent component. Content area for submenu.
 */
const MenubarSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function MenubarSubContent({ className, ...props }, ref) {
  return (
    <MenubarPrimitive.SubContent
      ref={ref}
      data-slot="menubar-sub-content"
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
        className
      )}
      {...props}
    />
  );
});
MenubarSubContent.displayName = 'MenubarSubContent';

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
