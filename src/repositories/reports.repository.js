const server = import.meta.env.VITE_URL_API;

export default class ReportsRepository {
  async generateReport(reportType, params) {
    const url = new URL(`${server}/reports/generate/${reportType}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw `Error ${response.status} al generar el informe: ${response.statusText}`;
    }

    return await response.blob();
  }
}