class AppointmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'appointment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error);
      throw error;
    }
  }

  async create(appointmentData) {
    try {
      const params = {
        records: [{
          Name: `Appointment - ${appointmentData.date} ${appointmentData.time}`,
          date_c: appointmentData.date,
          time_c: appointmentData.time,
          status_c: appointmentData.status || "scheduled",
          notes_c: appointmentData.notes,
          created_at_c: new Date().toISOString().split("T")[0],
          patient_id_c: parseInt(appointmentData.patientId),
          doctor_id_c: parseInt(appointmentData.doctorId)
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
          throw new Error("Failed to create appointment");
        }
        
        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  }

  async update(id, appointmentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Appointment - ${appointmentData.date} ${appointmentData.time}`,
          date_c: appointmentData.date,
          time_c: appointmentData.time,
          status_c: appointmentData.status,
          notes_c: appointmentData.notes,
          patient_id_c: parseInt(appointmentData.patientId),
          doctor_id_c: parseInt(appointmentData.doctorId)
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
          throw new Error("Failed to update appointment");
        }
        
        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating appointment:", error);
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
          throw new Error("Failed to delete appointment");
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();

export const appointmentService = new AppointmentService();