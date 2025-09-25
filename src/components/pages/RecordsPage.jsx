import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { recordService } from "@/services/api/recordService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import { format } from "date-fns";

const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [recordsData, patientsData, doctorsData] = await Promise.all([
        recordService.getAll(),
        patientService.getAll(),
        doctorService.getAll()
      ]);
      
      setRecords(recordsData);
      setFilteredRecords(recordsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError("Failed to load medical records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(record => {
        const patient = patients.find(p => p.Id === parseInt(record.patientId));
        const doctor = doctors.find(d => d.Id === parseInt(record.doctorId));
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "";
        const doctorName = doctor ? `${doctor.firstName} ${doctor.lastName}` : "";
        
        return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
               record.treatment.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredRecords(filtered);
    }
  }, [searchTerm, records, patients, doctors]);

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === parseInt(patientId));
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.Id === parseInt(doctorId));
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Unknown Doctor";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="FileText" className="w-6 h-6" />
              Medical Records
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchBar
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80"
              />
              <Button className="flex items-center gap-2">
                <ApperIcon name="FilePlus" className="w-4 h-4" />
                Add Record
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <Empty
              title="No medical records found"
              description="Start by creating your first medical record or try adjusting your search criteria."
              icon="FileText"
            />
          ) : (
            <div className="space-y-6">
              {filteredRecords.map((record) => (
                <div
                  key={record.Id}
                  className="bg-gradient-to-br from-white to-secondary-50 border border-secondary-200 rounded-xl p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-success-500 to-accent-500 rounded-full flex items-center justify-center">
                        <ApperIcon name="FileText" className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {getPatientName(record.patientId)}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-secondary-600">
                          <span className="flex items-center gap-1">
                            <ApperIcon name="UserCheck" className="w-3 h-3" />
                            {getDoctorName(record.doctorId)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ApperIcon name="Calendar" className="w-3 h-3" />
{record.date && !isNaN(new Date(record.date)) ? format(new Date(record.date), "MMM dd, yyyy") : "Invalid date"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <ApperIcon name="Eye" className="w-3 h-3" />
                        View
                      </Button>
                      <Button size="sm" variant="ghost" className="flex items-center gap-1 text-primary-600">
                        <ApperIcon name="Edit" className="w-3 h-3" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2 flex items-center gap-2">
                        <ApperIcon name="Stethoscope" className="w-4 h-4" />
                        Diagnosis
                      </h4>
                      <p className="text-secondary-700 text-sm bg-white p-3 rounded-lg border border-secondary-200">
                        {record.diagnosis}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2 flex items-center gap-2">
                        <ApperIcon name="Heart" className="w-4 h-4" />
                        Treatment
                      </h4>
                      <p className="text-secondary-700 text-sm bg-white p-3 rounded-lg border border-secondary-200">
                        {record.treatment}
                      </p>
                    </div>

                    {record.prescription && record.prescription.length > 0 && (
                      <div className="lg:col-span-2">
                        <h4 className="font-medium text-secondary-900 mb-2 flex items-center gap-2">
                          <ApperIcon name="Pill" className="w-4 h-4" />
                          Prescription
                        </h4>
                        <div className="bg-white p-3 rounded-lg border border-secondary-200">
                          <div className="flex flex-wrap gap-2">
                            {record.prescription.map((med, index) => (
                              <Badge key={index} variant="default" className="text-xs">
                                {med}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {record.notes && (
                      <div className="lg:col-span-2">
                        <h4 className="font-medium text-secondary-900 mb-2 flex items-center gap-2">
                          <ApperIcon name="MessageSquare" className="w-4 h-4" />
                          Notes
                        </h4>
                        <p className="text-secondary-700 text-sm bg-white p-3 rounded-lg border border-secondary-200">
                          {record.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordsPage;