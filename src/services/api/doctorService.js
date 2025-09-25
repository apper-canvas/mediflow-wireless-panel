class DoctorService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'doctor_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "availability_c"}},
          {"field": {"Name": "consultation_fee_c"}}
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
      console.error("Error fetching doctors:", error);
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
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "availability_c"}},
          {"field": {"Name": "consultation_fee_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching doctor ${id}:`, error);
      throw error;
    }
  }

  async create(doctorData) {
    try {
      const params = {
        records: [{
          Name: `Dr. ${doctorData.firstName} ${doctorData.lastName}`,
          first_name_c: doctorData.firstName,
          last_name_c: doctorData.lastName,
          specialization_c: doctorData.specialization,
          phone_c: doctorData.phone,
          email_c: doctorData.email,
          availability_c: doctorData.availability,
          consultation_fee_c: parseFloat(doctorData.consultationFee)
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
          throw new Error("Failed to create doctor record");
        }
        
        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating doctor:", error);
      throw error;
    }
  }

  async update(id, doctorData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Dr. ${doctorData.firstName} ${doctorData.lastName}`,
          first_name_c: doctorData.firstName,
          last_name_c: doctorData.lastName,
          specialization_c: doctorData.specialization,
          phone_c: doctorData.phone,
          email_c: doctorData.email,
          availability_c: doctorData.availability,
          consultation_fee_c: parseFloat(doctorData.consultationFee)
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
          throw new Error("Failed to update doctor record");
        }
        
        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating doctor:", error);
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
          throw new Error("Failed to delete doctor record");
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting doctor:", error);
      throw error;
    }
  }
}

export const doctorService = new DoctorService();
export const doctorService = new DoctorService();