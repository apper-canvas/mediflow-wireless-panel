import doctorsData from "@/services/mockData/doctors.json";

class DoctorService {
  constructor() {
    this.doctors = [...doctorsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.doctors];
  }

  async getById(id) {
    await this.delay(200);
    const doctor = this.doctors.find(d => d.Id === parseInt(id));
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return { ...doctor };
  }

  async create(doctorData) {
    await this.delay(400);
    const newDoctor = {
      Id: this.getNextId(),
      ...doctorData
    };
    this.doctors.push(newDoctor);
    return { ...newDoctor };
  }

  async update(id, doctorData) {
    await this.delay(350);
    const index = this.doctors.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    this.doctors[index] = { ...this.doctors[index], ...doctorData };
    return { ...this.doctors[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.doctors.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    const deletedDoctor = this.doctors.splice(index, 1)[0];
    return { ...deletedDoctor };
  }

  getNextId() {
    return Math.max(...this.doctors.map(d => d.Id)) + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const doctorService = new DoctorService();