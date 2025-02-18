import { useAuthStore } from "@/stores/auth.js";
import { useMessagesStore } from "@/stores/messages";

const server = import.meta.env.VITE_URL_API;

export default class PatientsRepository {
  async getAllPatients(filter = "") {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/patients" + filter, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      // throw `Error ${response.status} de la BBDD: ${response.statusText}`;
      useMessagesStore().pushMessageAction({type: "error", message: `Error ${response.status} de la BBDD: ${response.statusText}`});
    }
    return await response.json();
  }

  async getPatientById(idPatient) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/patients/" + idPatient, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      // throw `Error ${response.status} de la BBDD: ${response.statusText}`;
      useMessagesStore().pushMessageAction({type: "error", message: `Error ${response.status} de la BBDD: ${response.statusText}`});
    }
    return await response.json();
  }

  async addPatient(patient) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(patient)
    });

    if (!response.ok) {
      // throw `Error ${response.status} de la BBDD: ${response.statusText}`;
      useMessagesStore().pushMessageAction({type: "error", message: `Error ${response.status} de la BBDD: ${response.statusText}`});
    }
    return await response.json();
  }

  async removePatient(idPatient) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/patients/" + idPatient, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      // throw `Error ${response.status} de la BBDD: ${response.statusText}`;
      useMessagesStore().pushMessageAction({type: "error", message: `Error ${response.status} de la BBDD: ${response.statusText}`});
    }
    return await response.json();
  }

  async changePatient(id, patient) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/patients/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(patient)
    });

    if (!response.ok) {
      // throw `Error ${response.status} de la BBDD: ${response.statusText}`;
      useMessagesStore().pushMessageAction({type: "error", message: `Error ${response.status} de la BBDD: ${response.statusText}`});
    }
    return await response.json();
  }
}
