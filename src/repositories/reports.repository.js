import { useAuthStore } from '@/stores/auth.js'

const API_URL = import.meta.env.VITE_URL_API;

export default class ReportsRepository {
  async getReport(type, startDate, endDate, zoneId, patientId) {
    const authStore = useAuthStore();
    const token = authStore.token;
    const params = new URLSearchParams();

    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (zoneId) params.append('zoneId', zoneId);
    if (patientId) params.append('patientId', patientId);

    const query = params.toString() ? `?${params.toString()}` : '';

    const response = await fetch(`${API_URL}/reports/${type}${query}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    return await response.blob();
  }
}
