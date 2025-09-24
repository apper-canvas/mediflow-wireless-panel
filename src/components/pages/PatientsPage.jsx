import React, { useState } from "react";
import PatientList from "@/components/organisms/PatientList";
import PatientForm from "@/components/organisms/PatientForm";

const PatientsPage = () => {
  const [view, setView] = useState("list"); // list, form, detail
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleSelectPatient = (patient, edit = false) => {
    setSelectedPatient(patient);
    setIsEdit(edit);
    setView(edit ? "form" : "detail");
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsEdit(false);
    setView("form");
  };

  const handleFormSuccess = () => {
    setView("list");
    setSelectedPatient(null);
    setIsEdit(false);
  };

  const handleCancel = () => {
    setView("list");
    setSelectedPatient(null);
    setIsEdit(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {view === "list" && (
        <PatientList
          onSelectPatient={handleSelectPatient}
          onAddPatient={handleAddPatient}
        />
      )}
      
      {view === "form" && (
        <PatientForm
          patient={isEdit ? selectedPatient : null}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}

      {view === "detail" && selectedPatient && (
        <div className="max-w-4xl mx-auto">
          {/* Patient Detail View */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">
                {selectedPatient.firstName} {selectedPatient.lastName}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSelectPatient(selectedPatient, true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Edit Patient
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  Back to List
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-secondary-900 mb-3">Personal Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Date of Birth:</span> {selectedPatient.dateOfBirth}</p>
                  <p><span className="font-medium">Gender:</span> {selectedPatient.gender}</p>
                  <p><span className="font-medium">Phone:</span> {selectedPatient.phone}</p>
                  <p><span className="font-medium">Email:</span> {selectedPatient.email}</p>
                  <p><span className="font-medium">Address:</span> {selectedPatient.address}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-secondary-900 mb-3">Emergency Contact</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedPatient.emergencyContact?.name}</p>
                  <p><span className="font-medium">Phone:</span> {selectedPatient.emergencyContact?.phone}</p>
                  <p><span className="font-medium">Relationship:</span> {selectedPatient.emergencyContact?.relationship}</p>
                </div>
              </div>
              
              {(selectedPatient.bloodType || selectedPatient.allergies || selectedPatient.medications) && (
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-secondary-900 mb-3">Medical Information</h3>
                  <div className="space-y-2 text-sm">
                    {selectedPatient.bloodType && (
                      <p><span className="font-medium">Blood Type:</span> {selectedPatient.bloodType}</p>
                    )}
                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                      <p><span className="font-medium">Allergies:</span> {selectedPatient.allergies.join(", ")}</p>
                    )}
                    {selectedPatient.medications && selectedPatient.medications.length > 0 && (
                      <p><span className="font-medium">Medications:</span> {selectedPatient.medications.join(", ")}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsPage;