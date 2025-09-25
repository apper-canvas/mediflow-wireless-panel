import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useContext } from "react";
import { AuthContext } from "../../App";
import { useSelector } from "react-redux";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuClick, searchValue, onSearchChange }) => {
  return (
    <header className="bg-white/95 backdrop-blur-lg border-b border-secondary-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 transition-colors lg:hidden"
        >
          <ApperIcon name="Menu" className="w-5 h-5" />
        </button>
        
        <div className="hidden sm:block">
          <SearchBar
            placeholder="Search patients, doctors, appointments..."
            value={searchValue}
            onChange={onSearchChange}
            className="w-80"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors">
          <ApperIcon name="Bell" className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-3 border-l border-secondary-200">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-secondary-900">Dr. Admin</p>
            <p className="text-xs text-secondary-500">Administrator</p>
</div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-secondary-700">
              Welcome back!
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const { logout } = useContext(AuthContext);
                logout();
              }}
            >
              <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;