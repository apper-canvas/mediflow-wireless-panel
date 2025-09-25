class PatientService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'patient_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "medications_c"}},
          {"field": {"Name": "registration_date_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "medications_c"}},
          {"field": {"Name": "registration_date_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error);
      throw error;
    }
  }

  async create(patientData) {
    try {
      const params = {
        records: [{
          Name: `${patientData.firstName} ${patientData.lastName}`,
          first_name_c: patientData.firstName,
          last_name_c: patientData.lastName,
          date_of_birth_c: patientData.dateOfBirth,
          gender_c: patientData.gender,
          phone_c: patientData.phone,
          email_c: patientData.email,
          address_c: patientData.address,
          emergency_contact_name_c: patientData.emergencyContact?.name,
          emergency_contact_phone_c: patientData.emergencyContact?.phone,
          emergency_contact_relationship_c: patientData.emergencyContact?.relationship,
          blood_type_c: patientData.bloodType,
          allergies_c: Array.isArray(patientData.allergies) ? patientData.allergies.join(", ") : patientData.allergies,
          medications_c: Array.isArray(patientData.medications) ? patientData.medications.join(", ") : patientData.medications,
          registration_date_c: new Date().toISOString().split("T")[0]
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          throw new Error("Failed to create patient record");
        }
        
        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  }

  async update(id, patientData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${patientData.firstName} ${patientData.lastName}`,
          first_name_c: patientData.firstName,
          last_name_c: patientData.lastName,
          date_of_birth_c: patientData.dateOfBirth,
          gender_c: patientData.gender,
          phone_c: patientData.phone,
          email_c: patientData.email,
          address_c: patientData.address,
          emergency_contact_name_c: patientData.emergencyContact?.name,
          emergency_contact_phone_c: patientData.emergencyContact?.phone,
          emergency_contact_relationship_c: patientData.emergencyContact?.relationship,
          blood_type_c: patientData.bloodType,
          allergies_c: Array.isArray(patientData.allergies) ? patientData.allergies.join(", ") : patientData.allergies,
          medications_c: Array.isArray(patientData.medications) ? patientData.medications.join(", ") : patientData.medications,
          registration_date_c: patientData.registrationDate || patientData.registration_date_c
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          throw new Error("Failed to update patient record");
        }
        
        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          throw new Error("Failed to delete patient record");
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw error;
    }
  }
}

export const patientService = new PatientService();