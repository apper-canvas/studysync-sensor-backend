import { forwardRef, useEffect } from "react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Modal = forwardRef(
  ({ className, children, isOpen, onClose, title, size = "md", ...props }, ref) => {
    const sizes = {
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
    };

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
      };
    }, [isOpen]);

    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === "Escape" && isOpen) {
          onClose?.();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                className={cn(
                  "relative w-full bg-white rounded-xl shadow-xl",
                  "border border-slate-200 max-h-[90vh] overflow-auto",
                  sizes[size],
                  className
                )}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                ref={ref}
                {...props}
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                <div className="p-6">{children}</div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

Modal.displayName = "Modal";

export default Modal;