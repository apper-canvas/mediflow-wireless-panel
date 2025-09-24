import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow hover:from-primary-700 hover:to-primary-800 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 hover:from-secondary-200 hover:to-secondary-300 transform hover:scale-[1.02] active:scale-[0.98]",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 transform hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-secondary-700 hover:bg-secondary-100 transform hover:scale-[1.02] active:scale-[0.98]",
    success: "bg-gradient-to-r from-success-600 to-success-700 text-white shadow hover:from-success-700 hover:to-success-800 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
    warning: "bg-gradient-to-r from-warning-600 to-warning-700 text-white shadow hover:from-warning-700 hover:to-warning-800 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
    error: "bg-gradient-to-r from-error-600 to-error-700 text-white shadow hover:from-error-700 hover:to-error-800 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;