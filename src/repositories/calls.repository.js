const server = import.meta.env.VITE_URL_API

export default class CallsRepository {
  async getAllCalls() {
    const response = await fetch(server + '/calls')
    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    return await response.json()
  }

  async getCallById(idCall) {
    const response = await fetch(server + '/calls/' + idCall)
    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    return await response.json()
  }

  async addCall(call) {
    const response = await fetch(server + '/calls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(call)
    })
    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    return await response.json()
  }

  async removeCall(idCall) {
    const response = await fetch(server + '/calls/' + idCall, { method: 'DELETE' })
    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    return await response.json()
  }

  async changeCall(call) {
    const response = await fetch(server + '/calls/' + call.id, {
      method: 'PUT',
      body: JSON.stringify(call),
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
