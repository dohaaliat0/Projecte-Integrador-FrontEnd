<template>
  <div class="login-wrapper">
    <form class="form" @submit.prevent="loginSumit">
      <div class="flex-column">
        <label>Email</label>
      </div>
      <div class="inputForm">
        <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
          <g id="Layer_3" data-name="Layer 3">
            <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
          </g>
        </svg>
        <input
            type="text"
            class="input"
            placeholder="Ingresa tu email"
            v-model="email"
            required
        />
      </div>

      <div class="flex-column">
        <label>Contraseña</label>
      </div>
      <div class="inputForm">
        <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
          <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
          <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
        </svg>
        <input
            :type="showPassword ? 'text' : 'password'"
            class="input"
            placeholder="Ingresa tu contraseña"
            v-model="password"
            required
        />
        <span class="toggle-password" tabindex="0" @click="alternarContrasena">
          <svg v-if="!showPassword" viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
          </svg>
          <svg v-else viewBox="0 0 640 512" height="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M320 400c-75.1 0-136-60.9-136-136 0-20.6 5-39.9 13.8-56.6l-42.2-33.1C137.6 203.2 128 230.3 128 256c0 106 86 192 192 192 25.7 0 52.8-9.6 75.7-26.2l-42.3-33.2C359.9 395 340.6 400 320 400zm-320-144c0 36.1 43.3 84.4 124.6 128.5l-40.1 31.5C57.2 354.3 0 312.8 0 256 0 200.3 54.5 152.2 129.6 111.3l39.6 31.1C99.4 171.1 64 207.4 64 256zm531.4 119.6C582.6 423.3 640 381.7 640 320c0-55.7-54.5-104.8-129.6-145.7l-39.6 31.1c34.5 22.2 69.1 61.6 69.1 114.6 0 17.4-2.8 33.8-8 49.6l40.1 31.5zM320 112c55.7 0 104 54.5 104 120 0 18.5-4.1 35.9-11.1 51.1l-40.3-31.6C377 243.1 384 230.3 384 216c0-44.2-35.8-80-80-80-14.3 0-27.1 4.7-37.6 12.4l-40.3-31.6C284.1 116 300.5 112 320 112z"/>
          </svg>
        </span>
      </div>

      <div class="flex-row">
        <span class="span" @click="recuperarContrasena">¿Olvidaste tu contraseña?</span>
      </div>

      <button class="button-submit" type="submit">Iniciar Sesión</button>

      <p class="p">
        ¿No tienes cuenta?
        <span class="span" @click="signup">Regístrate</span>
      </p>
      <p class="p line">O con</p>

      <div class="flex-row">
        <button type="button" class="btn google" @click="loginConGoogle">
          <svg version="1.1" width="20" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
               xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
               viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
            <path style="fill:#FBBB00;"
                  d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
              c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
              C103.821,274.792,107.225,292.797,113.47,309.408z">
            </path>
            <path style="fill:#518EF8;"
                  d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
              c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
              c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z">
            </path>
            <path style="fill:#28B446;"
                  d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
              c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
              c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z">
            </path>
            <path style="fill:#F14336;"
                  d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
              c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
              C318.115,0,375.068,22.126,419.404,58.936z">
            </path>
          </svg>
          Google
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth.js'

export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false
    };
  },
  methods: {
    ...mapActions(useAuthStore, ['login']),
    async loginSumit() {
      const response = await this.login(this.email, this.password)
      if (response) {
        this.$router.push('/patients')
      } else {
        alert('Error al inciar sesion')
      }
    },
    alternarContrasena() {
      this.showPassword = !this.showPassword;
    },
    recuperarContrasena() {
      console.log("Recuperar contraseña");
    },
    signup() {
      console.log("Ir a registro");
    },
    loginConGoogle() {
      console.log("Iniciar sesión con Google");
    }
  }
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 50px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  padding: 30px;
  width: 450px;
  border-radius: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

::placeholder {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.form button {
  align-self: flex-end;
}

.flex-column > label {
  color: #151717;
  font-weight: 600;
}

.inputForm {
  border: 1.5px solid #ecedec;
  border-radius: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  transition: 0.2s ease-in-out;
}

.input {
  margin-left: 10px;
  border-radius: 10px;
  border: none;
  width: 85%;
  height: 100%;
}

.input:focus {
  outline: none;
}

.inputForm:focus-within {
  border: 1.5px solid #2d79f3;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.flex-row > div > label {
  font-size: 14px;
  color: black;
  font-weight: 400;
}

.span {
  font-size: 14px;
  margin-left: 5px;
  color: #2d79f3;
  font-weight: 500;
  cursor: pointer;
}

.button-submit {
  margin: 20px 0 10px 0;
  background-color: #151717;
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
  height: 50px;
  width: 100%;
  cursor: pointer;
}

.button-submit:hover {
  background-color: #252727;
}

.p {
  text-align: center;
  color: black;
  font-size: 14px;
  margin: 5px 0;
}

.btn {
  margin-top: 10px;
  width: 100%;
  height: 50px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  gap: 10px;
  border: 1px solid #ededef;
  background-color: white;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}

.btn:hover {
  border: 1px solid #2d79f3;
}

.toggle-password {
  margin-left: auto;
  cursor: pointer;
  outline: none;
}
</style>
