import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { patientService } from "@/services/api/patientService";
import { appointmentService } from "@/services/api/appointmentService";
import { billService } from "@/services/api/billService";
import { medicineService } from "@/services/api/medicineService";
import { format, subDays, subMonths } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";

const ReportsPage = () => {
  const [reportData, setReportData] = useState({
    patients: [],
    appointments: [],
    bills: [],
    medicines: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [patients, appointments, bills, medicines] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        billService.getAll(),
        medicineService.getAll()
      ]);

      setReportData({ patients, appointments, bills, medicines });
    } catch (err) {
      setError("Failed to load report data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const getDateRange = () => {
    const now = new Date();
    switch (selectedTimeframe) {
      case "week":
        return { start: subDays(now, 7), end: now };
      case "month":
        return { start: subMonths(now, 1), end: now };
      case "quarter":
        return { start: subMonths(now, 3), end: now };
      case "year":
        return { start: subMonths(now, 12), end: now };
      default:
        return { start: subMonths(now, 1), end: now };
    }
  };

const getFilteredData = (data, dateField) => {
    const { start, end } = getDateRange();
    return data.filter(item => {
      if (!item[dateField] || isNaN(new Date(item[dateField]))) return false;
      const itemDate = new Date(item[dateField]);
      return itemDate >= start && itemDate <= end;
    });
  };

  const generatePatientReport = () => {
    const filtered = getFilteredData(reportData.patients, "registrationDate");
    return {
      total: reportData.patients.length,
      newPatients: filtered.length,
      byGender: {
        male: reportData.patients.filter(p => p.gender === "male").length,
        female: reportData.patients.filter(p => p.gender === "female").length,
        other: reportData.patients.filter(p => p.gender === "other").length
},
      byAgeGroup: {
        "0-18": reportData.patients.filter(p => {
          if (!p.dateOfBirth || isNaN(new Date(p.dateOfBirth))) return false;
          const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
          return age <= 18;
        }).length,
        "19-35": reportData.patients.filter(p => {
          if (!p.dateOfBirth || isNaN(new Date(p.dateOfBirth))) return false;
          const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
          return age >= 19 && age <= 35;
        }).length,
        "36-60": reportData.patients.filter(p => {
          if (!p.dateOfBirth || isNaN(new Date(p.dateOfBirth))) return false;
          const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
          return age >= 36 && age <= 60;
        }).length,
        "60+": reportData.patients.filter(p => {
          if (!p.dateOfBirth || isNaN(new Date(p.dateOfBirth))) return false;
          const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
return age > 60;
        }).length
      }
    };
  };

  const generateAppointmentReport = () => {
    const filtered = getFilteredData(reportData.appointments, "date");
    return {
      total: reportData.appointments.length,
      period: filtered.length,
      byStatus: {
        scheduled: reportData.appointments.filter(a => a.status === "scheduled").length,
        confirmed: reportData.appointments.filter(a => a.status === "confirmed").length,
        completed: reportData.appointments.filter(a => a.status === "completed").length,
        cancelled: reportData.appointments.filter(a => a.status === "cancelled").length
      },
      completionRate: reportData.appointments.length > 0 
        ? Math.round((reportData.appointments.filter(a => a.status === "completed").length / reportData.appointments.length) * 100)
        : 0
    };
  };

  const generateFinancialReport = () => {
    const filtered = getFilteredData(reportData.bills, "date");
    const totalRevenue = reportData.bills.filter(b => b.status === "paid").reduce((sum, b) => sum + b.totalAmount, 0);
    const periodRevenue = filtered.filter(b => b.status === "paid").reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingAmount = reportData.bills.filter(b => b.status === "pending").reduce((sum, b) => sum + b.totalAmount, 0);
    
    return {
      totalRevenue,
      periodRevenue,
      pendingAmount,
      totalBills: reportData.bills.length,
      paidBills: reportData.bills.filter(b => b.status === "paid").length,
      pendingBills: reportData.bills.filter(b => b.status === "pending").length,
      collectionRate: reportData.bills.length > 0
        ? Math.round((reportData.bills.filter(b => b.status === "paid").length / reportData.bills.length) * 100)
        : 0
    };
  };

  const generateInventoryReport = () => {
    const totalValue = reportData.medicines.reduce((sum, m) => sum + (m.stock * m.price), 0);
    const lowStock = reportData.medicines.filter(m => m.stock <= m.minThreshold);
    const outOfStock = reportData.medicines.filter(m => m.stock === 0);
    const expiringSoon = reportData.medicines.filter(m => {
if (!m.expiryDate || isNaN(new Date(m.expiryDate))) return false;
      const expiry = new Date(m.expiryDate);
      const thirtyDaysFromNow = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
      return expiry <= thirtyDaysFromNow;
    });

    return {
      totalItems: reportData.medicines.length,
      totalValue,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      expiringSoonCount: expiringSoon.length,
      categories: [...new Set(reportData.medicines.map(m => m.category))].length
    };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadReportData} />;

  const patientReport = generatePatientReport();
  const appointmentReport = generateAppointmentReport();
  const financialReport = generateFinancialReport();
  const inventoryReport = generateInventoryReport();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-secondary-900">Hospital Reports</h1>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <Button className="flex items-center gap-2">
            <ApperIcon name="Download" className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Patient Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Users" className="w-5 h-5" />
            Patient Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{patientReport.total}</div>
              <div className="text-sm text-secondary-600">Total Patients</div>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-2xl font-bold text-success-600">{patientReport.newPatients}</div>
              <div className="text-sm text-secondary-600">New This Period</div>
            </div>
            <div className="text-center p-4 bg-accent-50 rounded-lg">
              <div className="text-2xl font-bold text-accent-600">{patientReport.byGender.male}</div>
              <div className="text-sm text-secondary-600">Male Patients</div>
            </div>
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <div className="text-2xl font-bold text-secondary-600">{patientReport.byGender.female}</div>
              <div className="text-sm text-secondary-600">Female Patients</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Calendar" className="w-5 h-5" />
            Appointment Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{appointmentReport.total}</div>
              <div className="text-sm text-secondary-600">Total Appointments</div>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <div className="text-2xl font-bold text-warning-600">{appointmentReport.byStatus.scheduled}</div>
              <div className="text-sm text-secondary-600">Scheduled</div>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-2xl font-bold text-success-600">{appointmentReport.byStatus.completed}</div>
              <div className="text-sm text-secondary-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-error-50 rounded-lg">
              <div className="text-2xl font-bold text-error-600">{appointmentReport.byStatus.cancelled}</div>
              <div className="text-sm text-secondary-600">Cancelled</div>
            </div>
            <div className="text-center p-4 bg-accent-50 rounded-lg">
              <div className="text-2xl font-bold text-accent-600">{appointmentReport.completionRate}%</div>
              <div className="text-sm text-secondary-600">Completion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="DollarSign" className="w-5 h-5" />
            Financial Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-2xl font-bold text-success-600">${financialReport.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-secondary-600">Total Revenue</div>
            </div>
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">${financialReport.periodRevenue.toLocaleString()}</div>
              <div className="text-sm text-secondary-600">Period Revenue</div>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <div className="text-2xl font-bold text-warning-600">${financialReport.pendingAmount.toLocaleString()}</div>
              <div className="text-sm text-secondary-600">Pending Amount</div>
            </div>
            <div className="text-center p-4 bg-accent-50 rounded-lg">
              <div className="text-2xl font-bold text-accent-600">{financialReport.collectionRate}%</div>
              <div className="text-sm text-secondary-600">Collection Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Package" className="w-5 h-5" />
            Inventory Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{inventoryReport.totalItems}</div>
              <div className="text-sm text-secondary-600">Total Items</div>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-2xl font-bold text-success-600">${inventoryReport.totalValue.toLocaleString()}</div>
              <div className="text-sm text-secondary-600">Total Value</div>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <div className="text-2xl font-bold text-warning-600">{inventoryReport.lowStockCount}</div>
              <div className="text-sm text-secondary-600">Low Stock Items</div>
            </div>
            <div className="text-center p-4 bg-error-50 rounded-lg">
              <div className="text-2xl font-bold text-error-600">{inventoryReport.expiringSoonCount}</div>
              <div className="text-sm text-secondary-600">Expiring Soon</div>
            </div>
          </div>
        </CardContent>
      </Card>
</div>
);
};

export default ReportsPage;