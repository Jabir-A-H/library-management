import * as React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
// Style utility moved to separate file for Fast Refresh compatibility
import { navigationMenuTriggerStyle } from './navigation-menu-style';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Root navigation menu component. Wraps Radix NavigationMenu.Root.
 *
 * @param {object} props - React props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} props.children - Menu content
 * @param {boolean} [props.viewport=true] - Whether to render the viewport
 */
/**
 * Root navigation menu component. Wraps Radix NavigationMenu.Root.
 */
interface NavigationMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  viewport?: boolean;
}
export const NavigationMenu = React.forwardRef<
  HTMLDivElement,
  NavigationMenuProps
>(function NavigationMenu(
  { className, children, viewport = true, ...props },
  ref
) {
  // Only pass valid props to Radix Root
  const { style, id, role, tabIndex, ...rest } = props;
  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
        className
      )}
      style={style}
      id={id}
      role={role}
      tabIndex={tabIndex}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
});
NavigationMenu.displayName = 'NavigationMenu';

/**
 * List container for navigation menu items. Wraps Radix NavigationMenu.List.
 */
/**
 * List container for navigation menu items. Wraps Radix NavigationMenu.List.
 */
export const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(function NavigationMenuList({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.List
      ref={ref}
      data-slot="navigation-menu-list"
      className={cn(
        'group flex flex-1 list-none items-center justify-center gap-1',
        className
      )}
      {...props}
    />
  );
});
NavigationMenuList.displayName = 'NavigationMenuList';

/**
 * Single navigation menu item. Wraps Radix NavigationMenu.Item.
 */
/**
 * Single navigation menu item. Wraps Radix NavigationMenu.Item.
 */
export const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(function NavigationMenuItem({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Item
      ref={ref}
      data-slot="navigation-menu-item"
      className={cn('relative', className)}
      {...props}
    />
  );
});
NavigationMenuItem.displayName = 'NavigationMenuItem';

/**
 * Trigger for opening a navigation menu dropdown. Wraps Radix NavigationMenu.Trigger.
 * Adds a chevron icon by default.
 */
/**
 * Trigger for opening a navigation menu dropdown. Wraps Radix NavigationMenu.Trigger.
 * Adds a chevron icon by default.
 */
export const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function NavigationMenuTrigger({ className, children, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), 'group', className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
});
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

/**
 * Dropdown content for a navigation menu item. Wraps Radix NavigationMenu.Content.
 */
/**
 * Dropdown content for a navigation menu item. Wraps Radix NavigationMenu.Content.
 */
export const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function NavigationMenuContent({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      data-slot="navigation-menu-content"
      className={cn(
        'data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto',
        'group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none',
        className
      )}
      {...props}
    />
  );
});
NavigationMenuContent.displayName = 'NavigationMenuContent';

/**
 * Viewport for navigation menu dropdowns. Wraps Radix NavigationMenu.Viewport.
 * Should be rendered once, usually by the root NavigationMenu.
 */
/**
 * Viewport for navigation menu dropdowns. Wraps Radix NavigationMenu.Viewport.
 * Should be rendered once, usually by the root NavigationMenu.
 */
export const NavigationMenuViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function NavigationMenuViewport({ className, ...props }, ref) {
  return (
    <div
      className={cn(
        'absolute top-full left-0 isolate z-50 flex justify-center'
      )}
    >
      <NavigationMenuPrimitive.Viewport
        ref={ref}
        data-slot="navigation-menu-viewport"
        className={cn(
          'origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]',
          className
        )}
        {...props}
      />
    </div>
  );
});
NavigationMenuViewport.displayName = 'NavigationMenuViewport';

/**
 * Link for navigation menu items. Wraps Radix NavigationMenu.Link.
 */
/**
 * Link for navigation menu items. Wraps Radix NavigationMenu.Link.
 */
export const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(function NavigationMenuLink(
  { className, children, href, target, rel, ...rest },
  ref
) {
  return (
    <NavigationMenuPrimitive.Link
      ref={ref}
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      href={href}
      target={target}
      rel={rel}
    >
      {children}
    </NavigationMenuPrimitive.Link>
  );
});
NavigationMenuLink.displayName = 'NavigationMenuLink';

/**
 * Indicator for the active navigation menu item. Wraps Radix NavigationMenu.Indicator.
 */
/**
 * Indicator for the active navigation menu item. Wraps Radix NavigationMenu.Indicator.
 */
export const NavigationMenuIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function NavigationMenuIndicator({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Indicator
      ref={ref}
      data-slot="navigation-menu-indicator"
      className={cn(
        'data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
});
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

// For tree-shaking and named imports
export default NavigationMenu;
