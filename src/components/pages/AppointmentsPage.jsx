import React, { useState } from "react";
import AppointmentList from "@/components/organisms/AppointmentList";
import AppointmentForm from "@/components/organisms/AppointmentForm";

const AppointmentsPage = () => {
  const [view, setView] = useState("list"); // list, form
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleSelectAppointment = (appointment, edit = false) => {
    setSelectedAppointment(appointment);
    setIsEdit(edit);
    setView("form");
  };

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setIsEdit(false);
    setView("form");
  };

  const handleFormSuccess = () => {
    setView("list");
    setSelectedAppointment(null);
    setIsEdit(false);
  };

  const handleCancel = () => {
    setView("list");
    setSelectedAppointment(null);
    setIsEdit(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {view === "list" && (
        <AppointmentList
          onSelectAppointment={handleSelectAppointment}
          onAddAppointment={handleAddAppointment}
        />
      )}
      
      {view === "form" && (
        <AppointmentForm
          appointment={isEdit ? selectedAppointment : null}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;