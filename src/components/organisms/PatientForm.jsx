import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { patientService } from "@/services/api/patientService";

const PatientForm = ({ patient, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: patient?.firstName || "",
    lastName: patient?.lastName || "",
    dateOfBirth: patient?.dateOfBirth || "",
    gender: patient?.gender || "",
    phone: patient?.phone || "",
    email: patient?.email || "",
    address: patient?.address || "",
    emergencyContact: {
      name: patient?.emergencyContact?.name || "",
      phone: patient?.emergencyContact?.phone || "",
      relationship: patient?.emergencyContact?.relationship || ""
    },
    bloodType: patient?.bloodType || "",
    allergies: patient?.allergies?.join(", ") || "",
    medications: patient?.medications?.join(", ") || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    
    // Emergency contact validation
    if (!formData.emergencyContact.name.trim()) {
      newErrors["emergencyContact.name"] = "Emergency contact name is required";
    }
    if (!formData.emergencyContact.phone.trim()) {
      newErrors["emergencyContact.phone"] = "Emergency contact phone is required";
    }
    if (!formData.emergencyContact.relationship.trim()) {
      newErrors["emergencyContact.relationship"] = "Relationship is required";
    }

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
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
      const patientData = {
        ...formData,
        allergies: formData.allergies ? formData.allergies.split(",").map(a => a.trim()).filter(a => a) : [],
        medications: formData.medications ? formData.medications.split(",").map(m => m.trim()).filter(m => m) : []
      };

      if (patient?.Id) {
        await patientService.update(patient.Id, patientData);
        toast.success("Patient updated successfully");
      } else {
        await patientService.create(patientData);
        toast.success("Patient registered successfully");
      }
      
      onSuccess();
    } catch (error) {
      toast.error("Failed to save patient information");
    } finally {
      setIsSubmitting(false);
    }
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ];

  const bloodTypeOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" }
  ];

  const relationshipOptions = [
    { value: "spouse", label: "Spouse" },
    { value: "parent", label: "Parent" },
    { value: "child", label: "Child" },
    { value: "sibling", label: "Sibling" },
    { value: "friend", label: "Friend" },
    { value: "other", label: "Other" }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name={patient ? "UserCheck" : "UserPlus"} className="w-6 h-6" />
          {patient ? "Edit Patient" : "Register New Patient"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-4 flex items-center gap-2">
              <ApperIcon name="User" className="w-5 h-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                error={errors.firstName}
                placeholder="Enter first name"
              />
              <FormField
                label="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                error={errors.lastName}
                placeholder="Enter last name"
              />
              <FormField
                label="Date of Birth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                error={errors.dateOfBirth}
              />
              <FormField
                label="Gender"
                type="select"
                required
                options={genderOptions}
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                error={errors.gender}
              />
              <FormField
                label="Phone Number"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                error={errors.phone}
                placeholder="Enter phone number"
              />
              <FormField
                label="Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
                placeholder="Enter email address"
              />
            </div>
            <div className="mt-4">
              <FormField
                label="Address"
                type="textarea"
                required
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                error={errors.address}
                placeholder="Enter full address"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Phone" className="w-5 h-5" />
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Contact Name"
                required
                value={formData.emergencyContact.name}
                onChange={(e) => handleInputChange("emergencyContact.name", e.target.value)}
                error={errors["emergencyContact.name"]}
                placeholder="Enter contact name"
              />
              <FormField
                label="Contact Phone"
                type="tel"
                required
                value={formData.emergencyContact.phone}
                onChange={(e) => handleInputChange("emergencyContact.phone", e.target.value)}
                error={errors["emergencyContact.phone"]}
                placeholder="Enter contact phone"
              />
              <FormField
                label="Relationship"
                type="select"
                required
                options={relationshipOptions}
                value={formData.emergencyContact.relationship}
                onChange={(e) => handleInputChange("emergencyContact.relationship", e.target.value)}
                error={errors["emergencyContact.relationship"]}
              />
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Heart" className="w-5 h-5" />
              Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Blood Type"
                type="select"
                options={bloodTypeOptions}
                value={formData.bloodType}
                onChange={(e) => handleInputChange("bloodType", e.target.value)}
                error={errors.bloodType}
              />
              <FormField
                label="Allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                error={errors.allergies}
                placeholder="Enter allergies (comma-separated)"
              />
              <FormField
                label="Current Medications"
                value={formData.medications}
                onChange={(e) => handleInputChange("medications", e.target.value)}
                error={errors.medications}
                placeholder="Enter medications (comma-separated)"
              />
            </div>
          </div>

          {/* Form Actions */}
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
              {patient ? "Update Patient" : "Register Patient"}
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

export default PatientForm;