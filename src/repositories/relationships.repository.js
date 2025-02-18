import { useAuthStore } from '@/stores/auth.js'

const server = import.meta.env.VITE_URL_API

export default class RelationshipsRepository {
  async getAllRelationships() {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/relationships", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return await response.json();
  }
}
