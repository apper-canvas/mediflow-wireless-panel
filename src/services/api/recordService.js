class RecordService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'record_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "treatment_c"}},
          {"field": {"Name": "prescription_c"}},
          {"field": {"Name": "notes_c"}},
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
      console.error("Error fetching records:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "treatment_c"}},
          {"field": {"Name": "prescription_c"}},
          {"field": {"Name": "notes_c"}},
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
      console.error(`Error fetching record ${id}:`, error);
      throw error;
    }
  }

  async getByPatientId(patientId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "treatment_c"}},
          {"field": {"Name": "prescription_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [{"FieldName": "patient_id_c", "Operator": "EqualTo", "Values": [parseInt(patientId)]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching records for patient ${patientId}:`, error);
      throw error;
    }
  }

  async create(recordData) {
    try {
      const params = {
        records: [{
          Name: recordData.diagnosis || `Record for ${recordData.patientId}`,
          date_c: recordData.date || new Date().toISOString().split("T")[0],
          diagnosis_c: recordData.diagnosis,
          treatment_c: recordData.treatment,
          prescription_c: recordData.prescription,
          notes_c: recordData.notes,
          patient_id_c: parseInt(recordData.patientId),
          doctor_id_c: parseInt(recordData.doctorId)
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
          throw new Error("Failed to create medical record");
        }
        
        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating record:", error);
      throw error;
    }
  }

  async update(id, recordData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: recordData.diagnosis || recordData.Name,
          date_c: recordData.date,
          diagnosis_c: recordData.diagnosis,
          treatment_c: recordData.treatment,
          prescription_c: recordData.prescription,
          notes_c: recordData.notes,
          patient_id_c: parseInt(recordData.patientId),
          doctor_id_c: parseInt(recordData.doctorId)
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
          throw new Error("Failed to update medical record");
        }
        
        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating record:", error);
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
          throw new Error("Failed to delete medical record");
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting record:", error);
      throw error;
    }
  }
}

export const recordService = new RecordService();