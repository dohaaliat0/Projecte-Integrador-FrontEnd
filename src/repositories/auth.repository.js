const server = import.meta.env.VITE_URL_API
const origin = import.meta.env.VITE_ORIGIN_URL

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

  async loginWithGoogle() {
    const width = 500
    const height = 600
    const left = screen.width / 2 - width / 2
    const top = screen.height / 2 - height / 2

     window.open(
      server + '/login/google',
      'Iniciar sesión con Google',
      `width=${width},height=${height},top=${top},left=${left}`
    )

    return new Promise((resolve, reject) => {
      // const checkPopup = setInterval(() => {
      //   if (!authWindow || authWindow.closed) {
      //     clearInterval(checkPopup)
      //     reject(new Error('Popup cerrado'))
      //   }
      // }, 500)
  
      window.addEventListener('message', (event) => {
        console.log(event.origin + ' ' + origin)
        if (event.origin !== origin) return
        console.log('message')
        // clearInterval(checkPopup)
        if (event.data.token) {
          resolve(event.data)
        } else {
          reject(new Error('No se recibió el token'))
        }
      })
    })
  }
}
