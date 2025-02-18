import { useAuthStore } from '@/stores/auth.js'

const server = import.meta.env.VITE_URL_API

export default class LanguagesRepository {
  async getAllLanguages() {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`;
    }

    return await response.json();
  }
}
