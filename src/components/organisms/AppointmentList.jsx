import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const AppointmentList = ({ onSelectAppointment, onAddAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll()
      ]);
      
      setAppointments(appointmentsData);
      setFilteredAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = appointments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(appointment => {
        const patient = patients.find(p => p.Id === parseInt(appointment.patientId));
        const doctor = doctors.find(d => d.Id === parseInt(appointment.doctorId));
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "";
        const doctorName = doctor ? `${doctor.firstName} ${doctor.lastName}` : "";
        
        return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, appointments, patients, doctors]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const appointment = appointments.find(a => a.Id === appointmentId);
      await appointmentService.update(appointmentId, { ...appointment, status: newStatus });
      toast.success(`Appointment ${newStatus} successfully`);
      loadData();
    } catch (error) {
      toast.error("Failed to update appointment status");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await appointmentService.delete(appointmentId);
      toast.success("Appointment cancelled successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === parseInt(patientId));
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.Id === parseInt(doctorId));
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Unknown Doctor";
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "scheduled": return "default";
      case "confirmed": return "success";
      case "completed": return "secondary";
      case "cancelled": return "error";
      default: return "default";
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Calendar" className="w-6 h-6" />
            Appointments
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button onClick={onAddAppointment} className="flex items-center gap-2">
              <ApperIcon name="CalendarPlus" className="w-4 h-4" />
              Book Appointment
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAppointments.length === 0 ? (
          <Empty
            title="No appointments found"
            description="Start by booking your first appointment or try adjusting your search criteria."
            action={onAddAppointment}
            actionLabel="Book Appointment"
            icon="Calendar"
          />
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.Id}
                className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:shadow-md hover:border-primary-300 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center">
                    <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">
                      {getPatientName(appointment.patientId)}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-secondary-600">
                      <span className="flex items-center gap-1">
                        <ApperIcon name="UserCheck" className="w-3 h-3" />
{getDoctorName(appointment.doctorId)}
                      </span>
                      <div className="flex items-center text-sm text-secondary-600">
                        <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                        {appointment.date && !isNaN(new Date(appointment.date)) ? format(new Date(appointment.date), "MMM dd, yyyy") : "Invalid date"}
                      </div>
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Clock" className="w-3 h-3" />
                        {appointment.time}
                      </span>
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-secondary-600 mt-1 max-w-md truncate">
                        {appointment.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getStatusVariant(appointment.status)} className="text-xs capitalize">
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {appointment.status === "scheduled" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(appointment.Id, "confirmed")}
                      className="flex items-center gap-1 text-success-600 border-success-600 hover:bg-success-50"
                    >
                      <ApperIcon name="Check" className="w-3 h-3" />
                      <span className="hidden sm:inline">Confirm</span>
                    </Button>
                  )}
                  {appointment.status === "confirmed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(appointment.Id, "completed")}
                      className="flex items-center gap-1 text-primary-600 border-primary-600 hover:bg-primary-50"
                    >
                      <ApperIcon name="CheckCircle" className="w-3 h-3" />
                      <span className="hidden sm:inline">Complete</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectAppointment(appointment, true)}
                    className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                  >
                    <ApperIcon name="Edit" className="w-3 h-3" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAppointment(appointment.Id)}
                    className="flex items-center gap-1 text-error-600 hover:text-error-700"
                  >
                    <ApperIcon name="Trash2" className="w-3 h-3" />
                    <span className="hidden sm:inline">Cancel</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentList;