import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection = "up",
  className,
  gradient = "from-primary-500 to-primary-600"
}) => {
  const trendColor = trendDirection === "up" ? "text-success-600" : "text-error-600";
  const trendIcon = trendDirection === "up" ? "TrendingUp" : "TrendingDown";

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-secondary-600 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-secondary-900 to-secondary-700 bg-clip-text text-transparent">
              {value}
            </p>
            {trend && (
              <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
                <ApperIcon name={trendIcon} className="w-3 h-3" />
                <span>{trend}</span>
              </div>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center", gradient)}>
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;