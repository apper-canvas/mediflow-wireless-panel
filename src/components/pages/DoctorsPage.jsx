import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { doctorService } from "@/services/api/doctorService";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await doctorService.getAll();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (err) {
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doctor =>
        `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.phone.includes(searchTerm) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  }, [searchTerm, doctors]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDoctors} />;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="UserCheck" className="w-6 h-6" />
              Medical Staff
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchBar
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80"
              />
              <Button className="flex items-center gap-2">
                <ApperIcon name="UserPlus" className="w-4 h-4" />
                Add Doctor
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDoctors.length === 0 ? (
            <Empty
              title="No doctors found"
              description="No doctors match your search criteria or no doctors have been added yet."
              icon="UserCheck"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.Id}
                  className="bg-gradient-to-br from-white to-secondary-50 border border-secondary-200 rounded-xl p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                      <ApperIcon name="UserCheck" className="w-8 h-8 text-white" />
                    </div>
                    <Badge variant="success" className="text-xs">
                      Available
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-primary-600 font-medium">
                        {doctor.specialization}
                      </p>
                    </div>
                    
                    <div className="space-y-2 text-sm text-secondary-600">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Phone" className="w-4 h-4" />
                        <span>{doctor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Mail" className="w-4 h-4" />
                        <span>{doctor.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="DollarSign" className="w-4 h-4" />
                        <span>Consultation: ${doctor.consultationFee}</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-secondary-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-600">
                          {doctor.availability?.length || 0} slots available
                        </span>
                        <Button size="sm" className="flex items-center gap-1">
                          <ApperIcon name="Calendar" className="w-3 h-3" />
                          Book
                        </Button>
                      </div>
                    </div>
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

export default DoctorsPage;