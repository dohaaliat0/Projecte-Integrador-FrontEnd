import { useAuthStore } from "@/stores/auth.js";

const server = import.meta.env.VITE_URL_API;

export default class OperatorsRepository {
  async getAllOperators() {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/operators", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });


    return await response.json();
  }

  async getOperatorById(idPatient) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/operators/" + idPatient, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });


    return await response.json();
  }
}
