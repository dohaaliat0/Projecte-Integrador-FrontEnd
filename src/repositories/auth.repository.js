const server = import.meta.env.VITE_URL_API

export default class AuthRepository {
  async login(email, password) {
    const body = JSON.stringify({ email: email, password: password })
    const response = await fetch(server + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    })
    if (!response.ok) {
      throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    return await response.json()
  }
}
