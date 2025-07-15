/**
 * UI Component Type Definitions
 * Comprehensive types for shadcn/ui components used throughout the application
 */

import React from 'react';

// Base component props that extend HTML attributes
export interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

// Button component types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

// Input component types
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

// Textarea component types
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

// Select component types
export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

export interface SelectContentProps extends ComponentProps {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export interface SelectItemProps extends ComponentProps {
  value: string;
  disabled?: boolean;
}

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

// Badge component types
export interface BadgeProps extends ComponentProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

// Card component types
export interface CardProps extends ComponentProps {}
export interface CardContentProps extends ComponentProps {}
export interface CardHeaderProps extends ComponentProps {}
export interface CardTitleProps extends ComponentProps {}
export interface CardDescriptionProps extends ComponentProps {}
export interface CardFooterProps extends ComponentProps {}

// Dialog component types
export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface DialogTriggerProps extends ComponentProps {
  asChild?: boolean;
}

export interface DialogContentProps extends ComponentProps {
  className?: string;
}

export interface DialogHeaderProps extends ComponentProps {}
export interface DialogTitleProps extends ComponentProps {}
export interface DialogDescriptionProps extends ComponentProps {}
export interface DialogFooterProps extends ComponentProps {}

// Dropdown Menu component types
export interface DropdownMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface DropdownMenuTriggerProps extends ComponentProps {
  asChild?: boolean;
}

export interface DropdownMenuContentProps extends ComponentProps {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
}

export interface DropdownMenuItemProps extends ComponentProps {
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownMenuLabelProps extends ComponentProps {}
export interface DropdownMenuSeparatorProps extends ComponentProps {}

// Tabs component types
export interface TabsProps extends ComponentProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  orientation?: 'horizontal' | 'vertical';
}

export interface TabsListProps extends ComponentProps {}
export interface TabsTriggerProps extends ComponentProps {
  value: string;
  disabled?: boolean;
}
export interface TabsContentProps extends ComponentProps {
  value: string;
}

// Table component types
export interface TableProps extends ComponentProps {}
export interface TableHeaderProps extends ComponentProps {}
export interface TableBodyProps extends ComponentProps {}
export interface TableFooterProps extends ComponentProps {}
export interface TableRowProps extends ComponentProps {}
export interface TableHeadProps extends ComponentProps {}
export interface TableCellProps extends ComponentProps {}
export interface TableCaptionProps extends ComponentProps {}

// Form component types
export interface FormProps extends ComponentProps {}
export interface FormFieldProps extends ComponentProps {
  name: string;
  control?: any;
  render: ({ field }: { field: any }) => React.ReactNode;
}
export interface FormItemProps extends ComponentProps {}
export interface FormLabelProps extends ComponentProps {}
export interface FormControlProps extends ComponentProps {}
export interface FormDescriptionProps extends ComponentProps {}
export interface FormMessageProps extends ComponentProps {}

// Alert component types
export interface AlertProps extends ComponentProps {
  variant?: 'default' | 'destructive';
}
export interface AlertTitleProps extends ComponentProps {}
export interface AlertDescriptionProps extends ComponentProps {}

// Sheet component types
export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface SheetTriggerProps extends ComponentProps {
  asChild?: boolean;
}

export interface SheetContentProps extends ComponentProps {
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export interface SheetHeaderProps extends ComponentProps {}
export interface SheetTitleProps extends ComponentProps {}
export interface SheetDescriptionProps extends ComponentProps {}

// Tooltip component types
export interface TooltipProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface TooltipTriggerProps extends ComponentProps {
  asChild?: boolean;
}

export interface TooltipContentProps extends ComponentProps {
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
}

export interface TooltipProviderProps {
  delayDuration?: number;
  children: React.ReactNode;
}

// Separator component types
export interface SeparatorProps extends ComponentProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

// Accordion component types
export interface AccordionProps extends ComponentProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

export interface AccordionItemProps extends ComponentProps {
  value: string;
}

export interface AccordionTriggerProps extends ComponentProps {}
export interface AccordionContentProps extends ComponentProps {}

// Avatar component types
export interface AvatarProps extends ComponentProps {}
export interface AvatarImageProps extends ComponentProps {
  src?: string;
  alt?: string;
}
export interface AvatarFallbackProps extends ComponentProps {}

// Switch component types
export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

// Slider component types
export interface SliderProps extends ComponentProps {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
}

// Calendar component types
export interface CalendarProps extends ComponentProps {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | Date[] | { from: Date; to: Date } | undefined) => void;
  disabled?: boolean | ((date: Date) => boolean);
  showOutsideDays?: boolean;
  className?: string;
  classNames?: Record<string, string>;
}
