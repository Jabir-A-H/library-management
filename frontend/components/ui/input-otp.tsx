'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * InputOTP component. Main OTP input field using input-otp library.
 */
type InputOTPProps = {
  className?: string;
  containerClassName?: string;
  maxLength: number;
  children?: React.ReactNode;
  [key: string]: any;
};
const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  function InputOTP(
    { className, containerClassName, maxLength, children, ...props },
    ref
  ) {
    return (
      <OTPInput
        ref={ref}
        data-slot="input-otp"
        containerClassName={cn(
          'flex items-center gap-2 has-disabled:opacity-50',
          containerClassName
        )}
        className={cn('disabled:cursor-not-allowed', className)}
        maxLength={maxLength}
        {...props}
      >
        {children}
      </OTPInput>
    );
  }
);

/**
 * InputOTPGroup component. Container for grouping OTP slots.
 */
const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function InputOTPGroup({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="input-otp-group"
      className={cn('flex items-center', className)}
      {...props}
    />
  );
});

/**
 * InputOTPSlot component. Renders a single OTP slot with caret and active state.
 */
interface InputOTPSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}
const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  function InputOTPSlot({ index, className, ...props }, ref) {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } =
      inputOTPContext?.slots[index] ?? {};
    return (
      <div
        ref={ref}
        data-slot="input-otp-slot"
        data-active={isActive}
        className={cn(
          'data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]',
          className
        )}
        {...props}
      >
        {char}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
          </div>
        )}
      </div>
    );
  }
);

/**
 * InputOTPSeparator component. Renders a separator (icon) between OTP slots.
 */
const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function InputOTPSeparator(props, ref) {
  return (
    <div ref={ref} data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
});

InputOTP.displayName = 'InputOTP';
InputOTPGroup.displayName = 'InputOTPGroup';
InputOTPSlot.displayName = 'InputOTPSlot';
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
