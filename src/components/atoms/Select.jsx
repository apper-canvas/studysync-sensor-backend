import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(
({ className, children, error, options, placeholder, filters, onFilterChange, onClearFilters, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200 appearance-none",
            error && "border-error focus:ring-error/20 focus:border-error",
            className
          )}
          ref={ref}
{...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options ? (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ApperIcon name="ChevronDown" size={16} className="text-slate-400" />
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;