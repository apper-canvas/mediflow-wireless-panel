import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error-600" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-secondary-600 mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2">
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;