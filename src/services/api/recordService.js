import recordsData from "@/services/mockData/records.json";

class RecordService {
  constructor() {
    this.records = [...recordsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.records];
  }

  async getById(id) {
    await this.delay(200);
    const record = this.records.find(r => r.Id === parseInt(id));
    if (!record) {
      throw new Error("Medical record not found");
    }
    return { ...record };
  }

  async getByPatientId(patientId) {
    await this.delay(250);
    return this.records.filter(r => r.patientId === patientId.toString()).map(r => ({ ...r }));
  }

  async create(recordData) {
    await this.delay(400);
    const newRecord = {
      Id: this.getNextId(),
      ...recordData,
      date: recordData.date || new Date().toISOString().split("T")[0]
    };
    this.records.push(newRecord);
    return { ...newRecord };
  }

  async update(id, recordData) {
    await this.delay(350);
    const index = this.records.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Medical record not found");
    }
    this.records[index] = { ...this.records[index], ...recordData };
    return { ...this.records[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.records.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Medical record not found");
    }
    const deletedRecord = this.records.splice(index, 1)[0];
    return { ...deletedRecord };
  }

  getNextId() {
    return Math.max(...this.records.map(r => r.Id)) + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const recordService = new RecordService();