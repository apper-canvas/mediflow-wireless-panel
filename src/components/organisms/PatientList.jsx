import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { patientService } from "@/services/api/patientService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const PatientList = ({ onSelectPatient, onAddPatient }) => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError("Failed to load patients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  const handleDeletePatient = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) {
      return;
    }

    try {
      await patientService.delete(patientId);
      toast.success("Patient deleted successfully");
      loadPatients();
    } catch (error) {
      toast.error("Failed to delete patient");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPatients} />;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Users" className="w-6 h-6" />
            Patient Directory
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
            <Button onClick={onAddPatient} className="flex items-center gap-2">
              <ApperIcon name="UserPlus" className="w-4 h-4" />
              Add Patient
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredPatients.length === 0 ? (
          <Empty
            title="No patients found"
            description="Start by registering your first patient or try adjusting your search criteria."
            action={onAddPatient}
            actionLabel="Add Patient"
            icon="Users"
          />
        ) : (
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.Id}
                className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:shadow-md hover:border-primary-300 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-secondary-600">
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Phone" className="w-3 h-3" />
                        {patient.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Mail" className="w-3 h-3" />
                        {patient.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Calendar" className="w-3 h-3" />
                        Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {patient.gender}
                      </Badge>
                      {patient.bloodType && (
                        <Badge variant="error" className="text-xs">
                          {patient.bloodType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectPatient(patient)}
                    className="flex items-center gap-1"
                  >
                    <ApperIcon name="Eye" className="w-3 h-3" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectPatient(patient, true)}
                    className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                  >
                    <ApperIcon name="Edit" className="w-3 h-3" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePatient(patient.Id)}
                    className="flex items-center gap-1 text-error-600 hover:text-error-700"
                  >
                    <ApperIcon name="Trash2" className="w-3 h-3" />
                    <span className="hidden sm:inline">Delete</span>
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

export default PatientList;