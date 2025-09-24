import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import StatCard from "@/components/molecules/StatCard";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { patientService } from "@/services/api/patientService";
import { appointmentService } from "@/services/api/appointmentService";
import { doctorService } from "@/services/api/doctorService";
import { billService } from "@/services/api/billService";
import { medicineService } from "@/services/api/medicineService";
import { format } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todaysAppointments: 0,
    totalDoctors: 0,
    pendingBills: 0,
    lowStockMedicines: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [patients, appointments, doctors, bills, medicines] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        doctorService.getAll(),
        billService.getAll(),
        medicineService.getAll()
      ]);

      // Calculate stats
      const today = format(new Date(), "yyyy-MM-dd");
      const todaysAppointments = appointments.filter(apt => apt.date === today).length;
      const pendingBills = bills.filter(bill => bill.status === "pending").length;
      const lowStockMedicines = medicines.filter(medicine => 
        medicine.stock <= medicine.minThreshold
      ).length;

      setStats({
        totalPatients: patients.length,
        todaysAppointments,
        totalDoctors: doctors.length,
        pendingBills,
        lowStockMedicines
      });

      // Create recent activities (sample data based on actual records)
      const activities = [];
      
      // Recent patients
      patients.slice(-3).forEach(patient => {
        activities.push({
          id: `patient-${patient.Id}`,
          type: "patient",
          message: `New patient registered: ${patient.firstName} ${patient.lastName}`,
          time: "2 hours ago",
          icon: "UserPlus",
          color: "text-success-600"
        });
      });

      // Recent appointments
      appointments.filter(apt => apt.status === "scheduled").slice(-2).forEach(appointment => {
        const patient = patients.find(p => p.Id === parseInt(appointment.patientId));
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "Unknown";
        activities.push({
          id: `appointment-${appointment.Id}`,
          type: "appointment",
          message: `Appointment scheduled for ${patientName}`,
          time: "3 hours ago",
          icon: "Calendar",
          color: "text-primary-600"
        });
      });

      // Low stock alerts
      medicines.filter(m => m.stock <= m.minThreshold).slice(-2).forEach(medicine => {
        activities.push({
          id: `stock-${medicine.Id}`,
          type: "inventory",
          message: `Low stock alert: ${medicine.name} (${medicine.stock} remaining)`,
          time: "5 hours ago",
          icon: "AlertTriangle",
          color: "text-warning-600"
        });
      });

      setRecentActivities(activities.slice(0, 8));
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Dr. Admin</h1>
            <p className="text-primary-100">
              Here's what's happening at your hospital today
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <ApperIcon name="Activity" className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients.toString()}
          icon="Users"
          trend="+12% from last month"
          trendDirection="up"
          gradient="from-primary-500 to-primary-600"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todaysAppointments.toString()}
          icon="Calendar"
          trend="+5% from yesterday"
          trendDirection="up"
          gradient="from-accent-500 to-accent-600"
        />
        <StatCard
          title="Active Doctors"
          value={stats.totalDoctors.toString()}
          icon="UserCheck"
          trend="All available"
          trendDirection="up"
          gradient="from-success-500 to-success-600"
        />
        <StatCard
          title="Pending Bills"
          value={stats.pendingBills.toString()}
          icon="CreditCard"
          trend="-8% from last week"
          trendDirection="down"
          gradient="from-warning-500 to-warning-600"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockMedicines.toString()}
          icon="Package"
          trend={stats.lowStockMedicines > 0 ? "Needs attention" : "All good"}
          trendDirection={stats.lowStockMedicines > 0 ? "down" : "up"}
          gradient="from-error-500 to-error-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Activity" className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name={activity.icon} className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-secondary-900">{activity.message}</p>
                    <p className="text-xs text-secondary-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="TrendingUp" className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-secondary-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors">
                  <ApperIcon name="UserPlus" className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-medium text-secondary-900">Add Patient</h3>
                <p className="text-sm text-secondary-600">Register new patient</p>
              </div>
              <div className="p-4 border border-secondary-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent-200 transition-colors">
                  <ApperIcon name="CalendarPlus" className="w-6 h-6 text-accent-600" />
                </div>
                <h3 className="font-medium text-secondary-900">Book Appointment</h3>
                <p className="text-sm text-secondary-600">Schedule new appointment</p>
              </div>
              <div className="p-4 border border-secondary-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-success-200 transition-colors">
                  <ApperIcon name="FileText" className="w-6 h-6 text-success-600" />
                </div>
                <h3 className="font-medium text-secondary-900">Medical Records</h3>
                <p className="text-sm text-secondary-600">View patient records</p>
              </div>
              <div className="p-4 border border-secondary-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-warning-200 transition-colors">
                  <ApperIcon name="Package" className="w-6 h-6 text-warning-600" />
                </div>
                <h3 className="font-medium text-secondary-900">Inventory</h3>
                <p className="text-sm text-secondary-600">Manage medicines</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;