import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import HomePage from "@/components/pages/HomePage";
import PatientsPage from "@/components/pages/PatientsPage";
import AppointmentsPage from "@/components/pages/AppointmentsPage";
import DoctorsPage from "@/components/pages/DoctorsPage";
import RecordsPage from "@/components/pages/RecordsPage";
import BillingPage from "@/components/pages/BillingPage";
import InventoryPage from "@/components/pages/InventoryPage";
import ReportsPage from "@/components/pages/ReportsPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <Router>
      <div className="flex h-screen bg-secondary-50">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <div className="flex-1 flex flex-col lg:ml-64">
          <Header 
            onMenuClick={toggleSidebar}
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
          />
          
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/records" element={<RecordsPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </main>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;