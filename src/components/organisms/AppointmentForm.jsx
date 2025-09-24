import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";

const AppointmentForm = ({ appointment, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: appointment?.patientId || "",
    doctorId: appointment?.doctorId || "",
    date: appointment?.date || "",
    time: appointment?.time || "",
    notes: appointment?.notes || ""
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsData, doctorsData] = await Promise.all([
          patientService.getAll(),
          doctorService.getAll()
        ]);
        setPatients(patientsData);
        setDoctors(doctorsData);
      } catch (error) {
        toast.error("Failed to load patients and doctors");
      }
    };

    loadData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientId) newErrors.patientId = "Please select a patient";
    if (!formData.doctorId) newErrors.doctorId = "Please select a doctor";
    if (!formData.date) newErrors.date = "Please select a date";
    if (!formData.time) newErrors.time = "Please select a time";

    // Validate date is not in the past
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = "Appointment date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const appointmentData = {
        ...formData,
        status: appointment?.status || "scheduled"
      };

      if (appointment?.Id) {
        await appointmentService.update(appointment.Id, appointmentData);
        toast.success("Appointment updated successfully");
      } else {
        await appointmentService.create(appointmentData);
        toast.success("Appointment booked successfully");
      }
      
      onSuccess();
    } catch (error) {
      toast.error("Failed to save appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const patientOptions = patients.map(patient => ({
    value: patient.Id.toString(),
    label: `${patient.firstName} ${patient.lastName} - ${patient.phone}`
  }));

  const doctorOptions = doctors.map(doctor => ({
    value: doctor.Id.toString(),
    label: `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialization}`
  }));

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  const timeOptions = timeSlots.map(time => ({
    value: time,
    label: time
  }));

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name={appointment ? "Calendar" : "CalendarPlus"} className="w-6 h-6" />
          {appointment ? "Edit Appointment" : "Book New Appointment"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Patient"
              type="select"
              required
              options={patientOptions}
              value={formData.patientId}
              onChange={(e) => handleInputChange("patientId", e.target.value)}
              error={errors.patientId}
            />
            <FormField
              label="Doctor"
              type="select"
              required
              options={doctorOptions}
              value={formData.doctorId}
              onChange={(e) => handleInputChange("doctorId", e.target.value)}
              error={errors.doctorId}
            />
            <FormField
              label="Date"
              type="date"
              required
              min={today}
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              error={errors.date}
            />
            <FormField
              label="Time"
              type="select"
              required
              options={timeOptions}
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              error={errors.time}
            />
          </div>
          
          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            error={errors.notes}
            placeholder="Additional notes for the appointment..."
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-secondary-200">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
              ) : (
                <ApperIcon name="Save" className="w-4 h-4" />
              )}
              {appointment ? "Update Appointment" : "Book Appointment"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <ApperIcon name="X" className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;