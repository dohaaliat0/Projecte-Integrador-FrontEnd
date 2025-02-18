import { useAuthStore } from "@/stores/auth.js";

const server = import.meta.env.VITE_URL_API;

export default class AlertsRepository {
  async getAllAlerts() {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/alerts", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });


    return await response.json();
  }

  async addAlert(alert) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/alerts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(alert)
    });



    return await response.json();
  }

  async getCallById(idAlert) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/alerts/" + idAlert, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });


    return await response.json();
  }

  async removeCall(idAlert) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/alerts/" + idAlert, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });


    return await response.json();
  }

  async changeCall(alert) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/alerts/" + alert.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(alert)
    });


    return await response.json();
  }
}
