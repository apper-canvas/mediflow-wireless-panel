class MedicineService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'medicine_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "min_threshold_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "expiry_date_c"}}
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
      console.error("Error fetching medicines:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "min_threshold_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "expiry_date_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching medicine ${id}:`, error);
      throw error;
    }
  }

  async getLowStock() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "min_threshold_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "expiry_date_c"}}
        ],
        whereGroups: [{
          "operator": "AND",
          "subGroups": [{
            "conditions": [{
              "fieldName": "stock_c",
              "operator": "LessThanOrEqualTo",
              "values": ["min_threshold_c"]
            }],
            "operator": "AND"
          }]
        }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching low stock medicines:", error);
      throw error;
    }
  }

  async create(medicineData) {
    try {
      const params = {
        records: [{
          Name: medicineData.name || medicineData.Name,
          name_c: medicineData.name,
          category_c: medicineData.category,
          stock_c: parseInt(medicineData.stock),
          min_threshold_c: parseInt(medicineData.minThreshold || medicineData.min_threshold_c),
          price_c: parseFloat(medicineData.price),
          expiry_date_c: medicineData.expiryDate || medicineData.expiry_date_c
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
          throw new Error("Failed to create medicine record");
        }
        
        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating medicine:", error);
      throw error;
    }
  }

  async update(id, medicineData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: medicineData.name || medicineData.Name,
          name_c: medicineData.name,
          category_c: medicineData.category,
          stock_c: parseInt(medicineData.stock),
          min_threshold_c: parseInt(medicineData.minThreshold || medicineData.min_threshold_c),
          price_c: parseFloat(medicineData.price),
          expiry_date_c: medicineData.expiryDate || medicineData.expiry_date_c
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
          throw new Error("Failed to update medicine record");
        }
        
        return successful[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating medicine:", error);
      throw error;
    }
  }

  async updateStock(id, quantity) {
    try {
      // First get current record
      const current = await this.getById(id);
      const newStock = Math.max(0, (current.stock_c || 0) + quantity);
      
      const params = {
        records: [{
          Id: parseInt(id),
          stock_c: newStock
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.results?.[0]?.data || response.data;
    } catch (error) {
      console.error("Error updating medicine stock:", error);
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
          throw new Error("Failed to delete medicine record");
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting medicine:", error);
      throw error;
    }
  }
}

export const medicineService = new MedicineService();

export const medicineService = new MedicineService();