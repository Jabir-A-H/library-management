import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Controller, FormProvider, ControllerProps } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  useFormField,
  FormFieldContext,
  FormItemContext,
} from './use-form-field';
import type { ComponentProps } from '@/types/ui';

/**
 * Form root provider. Use as the main container for form context.
 */
const Form = FormProvider;

/**
 * FormField component. Provides context for a single form field and renders Controller.
 */
interface FormFieldProps extends ControllerProps {
  name: string;
}
const FormField: React.FC<FormFieldProps> = (props) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};
FormField.displayName = 'FormField';

/**
 * FormItem component. Container for a form field item.
 */
const FormItem = React.forwardRef<HTMLDivElement, ComponentProps>(
  function FormItem({ className, ...props }, ref) {
    const id = React.useId();
    return (
      <FormItemContext.Provider value={{ id }}>
        <div
          ref={ref}
          data-slot="form-item"
          className={cn('grid gap-2', className)}
          {...props}
        />
      </FormItemContext.Provider>
    );
  }
);
FormItem.displayName = 'FormItem';

/**
 * FormLabel component. Label for a form field, shows error state.
 */
const FormLabel = React.forwardRef<HTMLLabelElement, ComponentProps>(
  function FormLabel({ className, ...props }, ref) {
    const { error, formItemId } = useFormField();
    return (
      <Label
        ref={ref}
        data-slot="form-label"
        data-error={!!error}
        className={cn('data-[error=true]:text-destructive', className)}
        htmlFor={formItemId}
        {...props}
      />
    );
  }
);
FormLabel.displayName = 'FormLabel';

/**
 * FormControl component. Renders the input/control for a form field.
 */
const FormControl = React.forwardRef<HTMLElement, ComponentProps>(
  function FormControl(props, ref) {
    const { error, formItemId, formDescriptionId, formMessageId } =
      useFormField();
    return (
      <Slot
        ref={ref}
        data-slot="form-control"
        id={formItemId}
        aria-describedby={
          !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
FormControl.displayName = 'FormControl';

/**
 * FormDescription component. Description/help text for a form field.
 */
const FormDescription = React.forwardRef<HTMLParagraphElement, ComponentProps>(
  function FormDescription({ className, ...props }, ref) {
    const { formDescriptionId } = useFormField();
    return (
      <p
        ref={ref}
        data-slot="form-description"
        id={formDescriptionId}
        className={cn('text-muted-foreground text-sm', className)}
        {...props}
      />
    );
  }
);
FormDescription.displayName = 'FormDescription';

/**
 * FormMessage component. Shows error or message for a form field.
 */
interface FormMessageProps extends ComponentProps {
  children?: React.ReactNode;
}
const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  function FormMessage({ className, children, ...props }, ref) {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message ?? '') : children;
    if (!body) {
      return null;
    }
    return (
      <p
        ref={ref}
        data-slot="form-message"
        id={formMessageId}
        className={cn('text-destructive text-sm', className)}
        {...props}
      >
        {body}
      </p>
    );
  }
);
FormMessage.displayName = 'FormMessage';

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
