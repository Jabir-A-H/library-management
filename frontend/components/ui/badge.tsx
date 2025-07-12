
import * as React from "react";
import { cn } from "@/lib/utils";
import { badgeVariants } from "./badge-variants";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

/**
 * Badge component for displaying status or labels.
 * Uses <span> for semantic correctness and accessibility.
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span 
        ref={ref}
        className={cn(badgeVariants({ variant }), className)} 
        {...props} 
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, type BadgeProps };
