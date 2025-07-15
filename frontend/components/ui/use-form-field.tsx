import * as React from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

/**
 * Context value for the current form field.
 */
export interface FormFieldContextValue {
  name: string;
}

/**
 * Context for the current form field (provided by <FormField />).
 * Provides the field name for useFormField.
 */
export const FormFieldContext = React.createContext<
  FormFieldContextValue | undefined
>(undefined);

/**
 * Context value for the current form item.
 */
export interface FormItemContextValue {
  id: string;
}

/**
 * Context for the current form item (provided by <FormItem />).
 * Provides the item id for useFormField.
 */
export const FormItemContext = React.createContext<
  FormItemContextValue | undefined
>(undefined);

/**
 * Return value for useFormField hook.
 */
export interface UseFormFieldResult {
  id?: string;
  name: string;
  formItemId?: string;
  formDescriptionId?: string;
  formMessageId?: string;
  isTouched?: boolean;
  isDirty?: boolean;
  invalid?: boolean;
  error?: any;
}

/**
 * Custom hook to access field and item context, field state, and accessibility IDs.
 * Throws if not used within a <FormField>.
 *
 * @returns {UseFormFieldResult} Form field state and accessibility IDs.
 * @throws Error if not used within a <FormField>.
 */
export function useFormField(): UseFormFieldResult {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  if (!fieldContext) {
    throw new Error(
      'useFormField must be used within a <FormField> component.'
    );
  }
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  const id = itemContext?.id;
  return {
    id,
    name: fieldContext.name,
    formItemId: id ? `${id}-form-item` : undefined,
    formDescriptionId: id ? `${id}-form-item-description` : undefined,
    formMessageId: id ? `${id}-form-item-message` : undefined,
    ...fieldState,
  };
}
