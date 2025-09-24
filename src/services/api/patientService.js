import patientsData from "@/services/mockData/patients.json";

class PatientService {
  constructor() {
    this.patients = [...patientsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.patients];
  }

  async getById(id) {
    await this.delay(200);
    const patient = this.patients.find(p => p.Id === parseInt(id));
    if (!patient) {
      throw new Error("Patient not found");
    }
    return { ...patient };
  }

  async create(patientData) {
    await this.delay(400);
    const newPatient = {
      Id: this.getNextId(),
      ...patientData,
      registrationDate: new Date().toISOString().split("T")[0]
    };
    this.patients.push(newPatient);
    return { ...newPatient };
  }

  async update(id, patientData) {
    await this.delay(350);
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    this.patients[index] = { ...this.patients[index], ...patientData };
    return { ...this.patients[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    const deletedPatient = this.patients.splice(index, 1)[0];
    return { ...deletedPatient };
  }

  getNextId() {
    return Math.max(...this.patients.map(p => p.Id)) + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const patientService = new PatientService();