import billsData from "@/services/mockData/bills.json";

class BillService {
  constructor() {
    this.bills = [...billsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.bills];
  }

  async getById(id) {
    await this.delay(200);
    const bill = this.bills.find(b => b.Id === parseInt(id));
    if (!bill) {
      throw new Error("Bill not found");
    }
    return { ...bill };
  }

  async getByPatientId(patientId) {
    await this.delay(250);
    return this.bills.filter(b => b.patientId === patientId.toString()).map(b => ({ ...b }));
  }

  async create(billData) {
    await this.delay(400);
    const newBill = {
      Id: this.getNextId(),
      ...billData,
      date: billData.date || new Date().toISOString().split("T")[0],
      status: billData.status || "pending"
    };
    this.bills.push(newBill);
    return { ...newBill };
  }

  async update(id, billData) {
    await this.delay(350);
    const index = this.bills.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bill not found");
    }
    this.bills[index] = { ...this.bills[index], ...billData };
    return { ...this.bills[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.bills.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bill not found");
    }
    const deletedBill = this.bills.splice(index, 1)[0];
    return { ...deletedBill };
  }

  getNextId() {
    return Math.max(...this.bills.map(b => b.Id)) + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const billService = new BillService();