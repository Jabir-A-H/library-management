import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Variants for the Label component.
 * @type {import("class-variance-authority").VariantProps}
 */
const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

/**
 * Label component for form fields, using Radix UI's LabelPrimitive.
 * Forwards refs and supports custom class names.
 *
 * @param {object} props - Label props
 * @param {string} [props.className] - Additional class names
 * @param {React.Ref<HTMLLabelElement>} ref - Ref for the label element
 * @returns {JSX.Element}
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(function Label({ className, ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
  );
});
Label.displayName = LabelPrimitive.Root.displayName || 'Label';

export { Label };
