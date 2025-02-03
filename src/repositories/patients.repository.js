const server = import.meta.env.VITE_URL_API

export default class PatientsRepository {
  async getAllPatients() {
    const response = await fetch(server + '/patients')
    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    return await response.json()
  }

  async getPatientById(idPatient) {
    const response = await fetch(server + '/patients?id=' + idPatient)
    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    return await response.json()
  }

  async addPatient(patient) {
    const response = await fetch(server + '/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient)
    })
    return response.json()
  }

  async removePatient(idPatient) {
    const response = await fetch(server + '/patients/' + idPatient, { method: 'DELETE' })
    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    return await response.json()
  }

  async changePatient(patient) {
    const response = await fetch(server + '/patients/' + patient.id, {
      method: 'PUT',
      body: JSON.stringify(patient),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    return await response.json()
  }
}
