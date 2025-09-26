import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center font-medium rounded-full";
    
    const variants = {
      default: "bg-slate-100 text-slate-800",
      primary: "bg-gradient-to-r from-primary/10 to-blue-100 text-primary border border-primary/20",
      secondary: "bg-slate-100 text-slate-600",
      success: "bg-gradient-to-r from-success/10 to-green-100 text-success border border-success/20",
      warning: "bg-gradient-to-r from-warning/10 to-amber-100 text-warning border border-warning/20",
      error: "bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20",
      high: "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-200",
      medium: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border border-amber-200",
      low: "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-200",
    };

    const sizes = {
      sm: "px-2 py-1 text-xs",
      md: "px-2.5 py-1.5 text-xs",
      lg: "px-3 py-2 text-sm",
    };

    return (
      <span
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;