import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Props for the Table component.
 * @property {string} [className] - Additional class names for styling.
 * @property {...React.TableHTMLAttributes<HTMLTableElement>} [props] - Any other table attributes.
 */
export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {
  className?: string;
}

/**
 * Table container and table element. Wraps children in a scrollable div.
 * Provides a styled, scrollable table for data display.
 *
 * @example
 * <Table><TableHeader>...</TableHeader><TableBody>...</TableBody></Table>
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  function Table({ className, ...props }, ref) {
    return (
      <div
        data-slot="table-container"
        className="relative w-full overflow-x-auto"
      >
        <table
          ref={ref}
          data-slot="table"
          className={cn('w-full caption-bottom text-sm', className)}
          {...props}
        />
      </div>
    );
  }
);
Table.displayName = 'Table';

/**
 * Props for the TableHeader component.
 * @property {string} [className] - Additional class names for styling.
 * @property {...React.HTMLAttributes<HTMLTableSectionElement>} [props] - Any other thead attributes.
 */
export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

/**
 * Table header (thead).
 */
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(function TableHeader({ className, ...props }, ref) {
  return (
    <thead
      ref={ref}
      data-slot="table-header"
      className={cn('[&_tr]:border-b', className)}
      {...props}
    />
  );
});
TableHeader.displayName = 'TableHeader';

/**
 * Props for the TableBody component.
 * @property {string} [className] - Additional class names for styling.
 * @property {...React.HTMLAttributes<HTMLTableSectionElement>} [props] - Any other tbody attributes.
 */
export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

/**
 * Table body (tbody).
 */
export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(function TableBody({ className, ...props }, ref) {
  return (
    <tbody
      ref={ref}
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
});
TableBody.displayName = 'TableBody';

/**
 * Props for the TableFooter component.
 * @property {string} [className] - Additional class names for styling.
 * @property {...React.HTMLAttributes<HTMLTableSectionElement>} [props] - Any other tfoot attributes.
 */
export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

/**
 * Table footer (tfoot).
 */
export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(function TableFooter({ className, ...props }, ref) {
  return (
    <tfoot
      ref={ref}
      data-slot="table-footer"
      className={cn(
        'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  );
});
TableFooter.displayName = 'TableFooter';

/**
 * Props for the TableRow component.
 * @property {string} [className] - Additional class names for styling.
 * @property {...React.HTMLAttributes<HTMLTableRowElement>} [props] - Any other tr attributes.
 */
export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
}

/**
 * Table row (tr).
 */
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ className, ...props }, ref) {
    return (
      <tr
        ref={ref}
        data-slot="table-row"
        className={cn(
          'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
          className
        )}
        {...props}
      />
    );
  }
);
TableRow.displayName = 'TableRow';

/**
 * Props for the TableHead component.
 * @property {string} [className] - Additional class names for styling.
 * @property {...React.ThHTMLAttributes<HTMLTableCellElement>} [props] - Any other th attributes.
 */
export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

/**
 * Table header cell (th).
 */
export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  function TableHead({ className, ...props }, ref) {
    return (
      <th
        ref={ref}
        data-slot="table-head"
        className={cn(
          'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
          className
        )}
        {...props}
      />
    );
  }
);
TableHead.displayName = 'TableHead';

/**
 * Props for the TableCell component.
 * @property {string} [className] - Additional class names for styling.
 * @property {...React.TdHTMLAttributes<HTMLTableCellElement>} [props] - Any other td attributes.
 */
export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

/**
 * Table cell (td).
 */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ className, ...props }, ref) {
    return (
      <td
        ref={ref}
        data-slot="table-cell"
        className={cn(
          'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
          className
        )}
        {...props}
      />
    );
  }
);
TableCell.displayName = 'TableCell';

/**
 * Props for the TableCaption component.
 * @property {string} [className] - Additional class names for styling.
 * @property {...React.HTMLAttributes<HTMLElement>} [props] - Any other caption attributes.
 */
export interface TableCaptionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

/**
 * Table caption (caption).
 */
export const TableCaption = React.forwardRef<HTMLElement, TableCaptionProps>(
  function TableCaption({ className, ...props }, ref) {
    return (
      <caption
        ref={ref}
        data-slot="table-caption"
        className={cn('text-muted-foreground mt-4 text-sm', className)}
        {...props}
      />
    );
  }
);
TableCaption.displayName = 'TableCaption';

// Named exports for tree-shaking and editor support
