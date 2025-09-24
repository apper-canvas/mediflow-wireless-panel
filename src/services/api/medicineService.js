import medicinesData from "@/services/mockData/medicines.json";

class MedicineService {
  constructor() {
    this.medicines = [...medicinesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.medicines];
  }

  async getById(id) {
    await this.delay(200);
    const medicine = this.medicines.find(m => m.Id === parseInt(id));
    if (!medicine) {
      throw new Error("Medicine not found");
    }
    return { ...medicine };
  }

  async getLowStock() {
    await this.delay(250);
    return this.medicines.filter(m => m.stock <= m.minThreshold).map(m => ({ ...m }));
  }

  async create(medicineData) {
    await this.delay(400);
    const newMedicine = {
      Id: this.getNextId(),
      ...medicineData
    };
    this.medicines.push(newMedicine);
    return { ...newMedicine };
  }

  async update(id, medicineData) {
    await this.delay(350);
    const index = this.medicines.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Medicine not found");
    }
    this.medicines[index] = { ...this.medicines[index], ...medicineData };
    return { ...this.medicines[index] };
  }

  async updateStock(id, quantity) {
    await this.delay(300);
    const index = this.medicines.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Medicine not found");
    }
    this.medicines[index].stock += quantity;
    if (this.medicines[index].stock < 0) {
      this.medicines[index].stock = 0;
    }
    return { ...this.medicines[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.medicines.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Medicine not found");
    }
    const deletedMedicine = this.medicines.splice(index, 1)[0];
    return { ...deletedMedicine };
  }

  getNextId() {
    return Math.max(...this.medicines.map(m => m.Id)) + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const medicineService = new MedicineService();