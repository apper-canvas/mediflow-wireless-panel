import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { doctorService } from "@/services/api/doctorService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const DoctorsPage = () => {
const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

const handleAddDoctor = () => {
    setShowModal(true);
  };

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
<Button onClick={handleAddDoctor} className="flex items-center gap-2">
                <ApperIcon name="UserPlus" className="w-4 h-4" />
                Add Doctor
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
{showModal && <DoctorModal />}
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

  function DoctorModal() {
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      specialization: "",
      phone: "",
      email: "",
      consultationFee: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const doctorData = {
          ...formData,
          consultationFee: parseFloat(formData.consultationFee) || 0
        };
        
        await doctorService.create(doctorData);
        toast.success("Doctor added successfully!");
        setShowModal(false);
        loadDoctors();
      } catch (err) {
        toast.error("Failed to add doctor. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-secondary-900">Add New Doctor</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-secondary-500 hover:text-secondary-700"
                disabled={isSubmitting}
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Specialization *
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Consultation Fee
                </label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-md hover:bg-secondary-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Doctor"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default DoctorsPage;