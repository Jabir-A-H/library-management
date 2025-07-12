
import * as React from "react";
import { useFormContext, useFormState } from "react-hook-form";

/**
 * Context for the current form field (provided by <FormField />).
 * @type {React.Context<{ name: string } | undefined>}
 */
export const FormFieldContext = React.createContext(undefined);

/**
 * Context for the current form item (provided by <FormItem />).
 * @type {React.Context<{ id: string } | undefined>}
 */
export const FormItemContext = React.createContext(undefined);

/**
 * Custom hook to access field and item context, field state, and accessibility IDs.
 * Throws if not used within a <FormField>.
 */
export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
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
