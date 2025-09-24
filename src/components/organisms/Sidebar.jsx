import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard", current: true },
    { name: "Patients", href: "/patients", icon: "Users", current: false },
    { name: "Appointments", href: "/appointments", icon: "Calendar", current: false },
    { name: "Doctors", href: "/doctors", icon: "UserCheck", current: false },
    { name: "Medical Records", href: "/records", icon: "FileText", current: false },
    { name: "Billing", href: "/billing", icon: "CreditCard", current: false },
    { name: "Inventory", href: "/inventory", icon: "Package", current: false },
    { name: "Reports", href: "/reports", icon: "BarChart3", current: false },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-lg border-r border-secondary-200 transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Activity" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">
                MediFlow
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 border-l-4 border-primary-600"
                      : "text-secondary-600 hover:text-primary-700 hover:bg-secondary-50"
                  )
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64 bg-white/95 backdrop-blur-lg border-r border-secondary-200">
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-secondary-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Activity" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">
                MediFlow
              </span>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 border-l-4 border-primary-600"
                      : "text-secondary-600 hover:text-primary-700 hover:bg-secondary-50"
                  )
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;