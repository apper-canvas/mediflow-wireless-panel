import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  type = "input", 
  options = [], 
  className,
  required,
  ...props 
}) => {
  const renderInput = () => {
    if (type === "select") {
      return (
        <Select
          className={cn(error && "border-error-500 focus:border-error-500 focus:ring-error-500/20")}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }

    if (type === "textarea") {
      return (
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            error && "border-error-500 focus:border-error-500 focus:ring-error-500/20"
          )}
          {...props}
        />
      );
    }

    return (
      <Input
        type={type}
        className={cn(error && "border-error-500 focus:border-error-500 focus:ring-error-500/20")}
        {...props}
      />
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="block">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </Label>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;