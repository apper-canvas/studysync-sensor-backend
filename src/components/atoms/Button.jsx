import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(
  ({ className, variant = "primary", size = "md", icon, children, disabled, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-primary/50 transform hover:scale-[1.02]",
      secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm hover:shadow-md focus:ring-slate-200",
      outline: "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
      ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
      danger: "bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-error/50 transform hover:scale-[1.02]",
      success: "bg-gradient-to-r from-success to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl focus:ring-success/50 transform hover:scale-[1.02]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5",
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {icon && <ApperIcon name={icon} size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;