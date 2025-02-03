import { defineStore } from 'pinia'
import PatientsRepository from "@/repositories/patients.repository.js";
import CallsRepository from "@/repositories/calls.repository.js";

export const useCounterStore = defineStore("counter", {
  state(){
    return{
      patients: [],
      calls: []
    }
  },
  getters: {
    getPatientById: (state) => (id) => state.patients.find((item) => item.id === id),
  },
  actions: {
    async loadCalls() {
      const repositoryModules = new CallsRepository();
      this.calls = await repositoryModules.getAllCalls();
    },
    async loadPatients() {
      const repositoryModules = new PatientsRepository();
      this.patients = await repositoryModules.getAllPatients();
    }
  }
});