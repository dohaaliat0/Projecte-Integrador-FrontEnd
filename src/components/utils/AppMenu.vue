<template>
  <nav class="menu">
    <ul>
      <li>
        <RouterLink :to="{ name: 'patients' }" class="menu-item">Pacientes</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'call-management' }" class="menu-item">Gestión de llamadas</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'Login' }" class="menu-item">Login</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'about' }" class="menu-item">Acerca de...</RouterLink>
      </li>
    </ul>
  </nav>
  <RouterView />
</template>

<style scoped>
.menu {
  background: linear-gradient(90deg, #1e1e1e, #444);
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

ul {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 10px 20px;
  position: relative;
  transition: all 0.3s ease;
  text-decoration: none;
}

.menu-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0%;
  height: 3px;
  background: #fff;
  transition: width 0.3s ease, left 0.3s ease;
}

.menu-item:hover {
  color: #2d79f3;
  transform: translateY(-3px);
}

.menu-item:hover::after {
  width: 100%;
  left: 0;
}

.menu-item:focus {
  outline: none;
  color: #2d79f3;
}
</style>
<script setup lang="ts">
</script>