class BillService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'bill_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "services_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "paid_at_c"}},
          {"field": {"name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
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
      console.error("Error fetching bills:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "services_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "paid_at_c"}},
          {"field": {"name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching bill ${id}:`, error);
      throw error;
    }
  }

  async getByPatientId(patientId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "services_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "paid_at_c"}},
          {"field": {"name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
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
      console.error(`Error fetching bills for patient ${patientId}:`, error);
      throw error;
    }
  }

  async create(billData) {
    try {
      const params = {
        records: [{
          Name: `Bill #${Date.now()}`,
          services_c: billData.services,
          total_amount_c: parseFloat(billData.totalAmount),
          status_c: billData.status || "pending",
          date_c: billData.date || new Date().toISOString().split("T")[0],
          patient_id_c: parseInt(billData.patientId),
          paid_at_c: billData.paidAt || null
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
          throw new Error("Failed to create bill");
        }
        
        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating bill:", error);
      throw error;
    }
  }

  async update(id, billData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: billData.Name || `Bill #${id}`,
          services_c: billData.services,
          total_amount_c: parseFloat(billData.totalAmount),
          status_c: billData.status,
          date_c: billData.date,
          patient_id_c: parseInt(billData.patientId),
          paid_at_c: billData.paidAt
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
          throw new Error("Failed to update bill");
        }
        
        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating bill:", error);
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
          throw new Error("Failed to delete bill");
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting bill:", error);
      throw error;
    }
  }
}

export const billService = new BillService();

export const billService = new BillService();