import { useAuthStore } from '@/stores/auth.js'

const API_URL = import.meta.env.VITE_URL_API;

export default class ReportsRepository {
  async getReport(type, startDate, endDate) {
    const authStore = useAuthStore();
    const token = authStore.token;
    let query = ''
    if (startDate && endDate) {
      query += `?startDate=${startDate}&endDate=${endDate}`
    } else {
      if (endDate) {
        query += `?startDate=${startDate}`
      }
      if (startDate) {
        query += `?endDate=${endDate}`
      }
    }

    const response = await fetch(`${API_URL}/reports/${type}${query}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    return await response.blob();
  }
}
