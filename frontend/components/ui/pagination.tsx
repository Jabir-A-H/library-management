import * as React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

/**
 * Root pagination navigation container.
 *
 * @param {object} props - React props
 * @param {string} [props.className] - Additional class names
 * @returns {JSX.Element}
 */
/**
 * Root pagination navigation container.
 */
export const Pagination = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(function Pagination({ className, ...props }, ref) {
  return (
    <nav
      ref={ref}
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
});
Pagination.displayName = 'Pagination';

/**
 * Container for pagination items (ul).
 */
/**
 * Container for pagination items (ul).
 */
export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(function PaginationContent({ className, ...props }, ref) {
  return (
    <ul
      ref={ref}
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
});
PaginationContent.displayName = 'PaginationContent';

/**
 * Single pagination item (li).
 */
/**
 * Single pagination item (li).
 */
export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(function PaginationItem(props, ref) {
  return <li ref={ref} data-slot="pagination-item" {...props} />;
});
PaginationItem.displayName = 'PaginationItem';

/**
 * Pagination link (page number or navigation arrow).
 *
 * @param {object} props
 * @param {boolean} [props.isActive] - If true, highlights as current page
 * @param {string} [props.size] - Button size (default: "icon")
 */
/**
 * Pagination link (page number or navigation arrow).
 */
interface PaginationLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
  size?: 'default' | 'icon';
}
export const PaginationLink = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps
>(function PaginationLink(
  { className, isActive, size = 'icon', ...props },
  ref
) {
  return (
    <a
      ref={ref}
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        className
      )}
      {...props}
    />
  );
});
PaginationLink.displayName = 'PaginationLink';

/**
 * Pagination previous button (left arrow).
 */
/**
 * Pagination previous button (left arrow).
 */
export const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps
>(function PaginationPrevious({ className, ...props }, ref) {
  return (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
});
PaginationPrevious.displayName = 'PaginationPrevious';

/**
 * Pagination next button (right arrow).
 */
/**
 * Pagination next button (right arrow).
 */
export const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps
>(function PaginationNext({ className, ...props }, ref) {
  return (
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
});
PaginationNext.displayName = 'PaginationNext';

/**
 * Pagination ellipsis ("...").
 */
/**
 * Pagination ellipsis ("...").
 */
export const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(function PaginationEllipsis({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
});
PaginationEllipsis.displayName = 'PaginationEllipsis';

// Named exports for tree-shaking and editor support
// (default export not provided)
