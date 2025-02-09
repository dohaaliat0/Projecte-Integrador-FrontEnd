<template>
  <nav class="menu">
    <template v-if="isAuthenticated">
      <RouterLink
        to="/patients"
        class="menu-item"
        :class="{ 'menu-item-active': $route.name === 'patients' }"
      >
        <span class="menu-icon fas fa-user-injured"></span>
        <span class="menu-text">Pacientes</span>
      </RouterLink>

      <RouterLink
        to="/calls"
        class="menu-item"
        :class="{ 'menu-item-active': $route.name === 'calls' }"
      >
        <span class="menu-icon fas fa-phone-alt"></span>
        <span class="menu-text">Llamadas</span>
      </RouterLink>

      <RouterLink
        to="/alerts"
        class="menu-item"
        :class="{ 'menu-item-active': $route.name === 'alerts' }"
      >
        <span class="menu-icon fas fa-exclamation-triangle"></span>
        <span class="menu-text">Alertas</span>
      </RouterLink>

      <RouterLink
        to="/calendar"
        class="menu-item"
        :class="{ 'menu-item-active': $route.name === 'calendar' }"
      >
        <span class="menu-icon fas fa-calendar-alt"></span>
        <span class="menu-text">Calendario</span>
      </RouterLink>

      <RouterLink
        to="/reports"
        class="menu-item"
        :class="{ 'menu-item-active': $route.name === 'reports' }"
      >
        <span class="menu-icon fas fa-chart-bar"></span>
        <span class="menu-text">Reportes</span>
      </RouterLink>

      <RouterLink
        to="/about"
        class="menu-item"
        :class="{ 'menu-item-active': $route.name === 'about' }"
      >
        <span class="menu-icon fas fa-info-circle"></span>
        <span class="menu-text">Acerca de</span>
      </RouterLink>

      <div class="user-menu" ref="userMenu">
        <button @click="isUserMenuOpen = !isUserMenuOpen" class="user-icon" :title="user.name">
          {{ user.name.length > 0 ? user.name.charAt(0).toUpperCase() : '#' }}
        </button>
        <div v-show="isUserMenuOpen" class="user-dropdown">
          <RouterLink to="/settings" class="dropdown-item">
            <span class="fas fa-cog"></span>
            Configuración
          </RouterLink>
          <button @click="logoutAndRedirect" class="dropdown-item">
            <span class="fas fa-sign-out-alt"></span>
            Cerrar sesión
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <button @click="$router.push('/login')" class="login-button">
        <span class="fas fa-user"></span>
        <span class="login-text">Iniciar sesión / Registrarse</span>
      </button>
    </template>
  </nav>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { mapActions, mapState } from 'pinia'

export default {
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated', 'isLoginModalVisible', 'user'])
  },
  setup() {
    const isUserMenuOpen = ref(false)

    return {
      isUserMenuOpen
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['logout', 'initializeAuth']),
    logoutAndRedirect() {
      this.logout()
      this.$router.push('/login')
    }
  },
  mounted() {
    this.initializeAuth()
  }
}
</script>

<style scoped>
.menu {
  display: flex;
  background-color: #ffffff;
  padding: 0.5rem;
  align-items: center;
  justify-content: flex-end;
}

.menu-item {
  display: flex;
  align-items: center;
  color: #6c757d;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: #f8f9fa;
  color: #3498db;
  transform: translateY(-2px);
}

.menu-item-active {
  background-color: #e9ecef;
  color: #3498db;
  font-weight: 600;
}

.menu-icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
}

.menu-text {
  font-size: 0.95rem;
}

.login-button {
  background-color: #3498db;
  border: none;
  color: #ffffff;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-button .fas {
  margin-right: 0.5rem;
}

.user-menu {
  position: relative;
  margin-left: auto;
}

.user-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 150px;
  font-size: 0.85rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-item .fas {
  margin-right: 0.4rem;
  font-size: 0.9rem;
}

.modal-content h2 {
  margin-bottom: 20px;
}

.modal-content form {
  display: flex;
  flex-direction: column;
}

.modal-content input {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-content button {
  padding: 8px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .menu {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    justify-content: space-around;
    border-radius: 0;
    z-index: 1000;
  }

  .menu-item {
    flex-direction: column;
    padding: 0.5rem;
    flex: 1;
    text-align: center;
  }

  .menu-icon {
    margin-right: 0;
    margin-bottom: 0.25rem;
    font-size: 1.3rem;
  }

  .menu-text {
    font-size: 0.75rem;
  }

  .menu-item:hover {
    transform: none;
  }

  .login-button {
    width: 100%;
    height: auto;
    border-radius: 8px;
    padding: 0.5rem;
  }

  .login-button {
    flex-direction: row;
    justify-content: center;
  }

  .login-button .fas {
    margin-right: 0.5rem;
  }

  .login-text {
    font-size: 0.95rem;
  }

  .user-menu {
    width: auto;
  }

  .user-icon {
    margin: 0;
  }

  .user-dropdown {
    position: fixed;
    top: auto;
    bottom: 100%;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 8px 8px 0 0;
  }
}

@media (min-width: 769px) {
  .menu-item {
    position: relative;
    overflow: hidden;
  }

  .menu-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: #3498db;
    transition: all 0.3s ease;
  }

  .menu-item:hover::after,
  .menu-item-active::after {
    width: 100%;
    left: 0;
  }
}
</style>
