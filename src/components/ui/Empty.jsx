import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  action,
  actionLabel = "Add Item",
  icon = "Inbox",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-secondary-500" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        {title}
      </h3>
      <p className="text-secondary-600 mb-6 max-w-md">
        {description}
      </p>
      {action && (
        <Button onClick={action} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;