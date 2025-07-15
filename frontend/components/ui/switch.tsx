'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

/**
 * Props for the Switch component.
 * @property {string} [className] - Additional class names for styling.
 * @property {string} [aria-label] - Accessible label for the switch.
 * @property {...SwitchPrimitive.SwitchProps} [props] - Any other Radix switch props.
 */
export interface SwitchProps extends SwitchPrimitive.SwitchProps {
  className?: string;
  'aria-label'?: string;
}

/**
 * Switch component. Wraps Radix Switch.Root and Switch.Thumb.
 * Provides a customizable, accessible toggle switch for forms and controls.
 *
 * @example
 * <Switch checked={isOn} onCheckedChange={setIsOn} aria-label="Enable notifications" />
 */
export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(function Switch({ className, ...props }, ref) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
  );
});
Switch.displayName = 'Switch';
