import { useAuthStore } from "@/stores/auth.js";

const server = import.meta.env.VITE_URL_API;

export default class CallsRepository {
  async getAllCalls() {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/calls", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`;
    }

    return await response.json();
  }

  async getAllCallsByPatient(idPatient) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/patients/" + idPatient + "/calls", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`;
    }

    return await response.json();
  }

  async addCall(call) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/calls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(call)
    });

    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`;
    }

    return await response.json();
  }

  async getCallById(idCall) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/calls/" + idCall, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`;
    }

    return await response.json();
  }

  async removeCall(idCall) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/calls/" + idCall, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`;
    }

    return await response.json();
  }

  async changeCall(call) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/calls/" + call.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(call)
    });

    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`;
    }

    return await response.json();
  }

  async getCallByAlertId(idAlert) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/calls/alerts/" + idAlert, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok || response.success === false ) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`;
    }
    return await response.json();
  }
}
