<template>
  <nav class="menu">
    <RouterLink to="/patients" class="menu-item" :class="{ 'menu-item-active': $route.name === 'patients' }">
      <span class="menu-icon fas fa-user-injured"></span>
      <span class="menu-text">Pacientes</span>
    </RouterLink>

    <RouterLink to="/call-management" class="menu-item" :class="{ 'menu-item-active': $route.name === 'call-management' }">
      <span class="menu-icon fas fa-phone-alt"></span>
      <span class="menu-text">Llamadas</span>
    </RouterLink>

    <RouterLink to="/reports" class="menu-item" :class="{ 'menu-item-active': $route.name === 'reports' }">
      <span class="menu-icon fas fa-chart-bar"></span>
      <span class="menu-text">Reportes</span>
    </RouterLink>

    <RouterLink to="/about" class="menu-item" :class="{ 'menu-item-active': $route.name === 'about' }">
      <span class="menu-icon fas fa-info-circle"></span>
      <span class="menu-text">Acerca de</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.menu {
  display: flex;
  gap: 0.5rem;
  background-color: #ffffff;
  padding: 0.5rem;
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
