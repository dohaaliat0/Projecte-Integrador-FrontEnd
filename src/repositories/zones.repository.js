import { useAuthStore } from '@/stores/auth.js'

const server = import.meta.env.VITE_URL_API

export default class ZonesRepository {
  async getAllZones() {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/zones", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });



    return await response.json();
  }
}
