import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-secondary-200 p-6">
              <div className="space-y-3">
                <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                <div className="h-8 bg-secondary-100 rounded"></div>
                <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <div className="space-y-4">
            <div className="h-6 bg-secondary-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-secondary-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-secondary-200 rounded w-1/3"></div>
                    <div className="h-3 bg-secondary-100 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-secondary-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;