import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "rounded-lg bg-white border border-slate-200 shadow-sm",
          "transition-all duration-200 hover:shadow-md",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

const CardContent = forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("p-6 pt-0", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

const CardFooter = forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("flex items-center p-6 pt-0", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

const CardTitle = forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        className={cn("font-semibold leading-none tracking-tight text-slate-900", className)}
        ref={ref}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = "CardTitle";

export { Card, CardHeader, CardContent, CardFooter, CardTitle };