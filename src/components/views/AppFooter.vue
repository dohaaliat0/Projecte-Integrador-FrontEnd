<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-logo">
        <h4>Gestión de Llamadas</h4>
        <p class="text-muted">Conectando profesionales y pacientes</p>
      </div>

      <div class="footer-links">
        <ul>
          <li><a href="#">Sobre Nosotros</a></li>
          <li><a href="#">Términos y Condiciones</a></li>
          <li><a href="#">Soporte</a></li>
        </ul>
      </div>

      <div class="footer-social">
        <a href="#" class="social-icon" target="_blank" title="Facebook">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="#" class="social-icon" target="_blank" title="Twitter">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="#" class="social-icon" target="_blank" title="LinkedIn">
          <i class="fab fa-linkedin-in"></i>
        </a>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 ConectaSalud. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script>
export default {}
</script>

<style scoped>
.footer {
  background-color: #2d2d2d;
  color: #f7f7fc;
  padding: 20px 0;
  font-size: 14px;
  font-family: 'Arial', sans-serif;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.footer-logo {
  flex: 1;
  text-align: left;
}

.footer-logo h4 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #fff;
}

.footer-logo p {
  color: #aaa;
}

.footer-links {
  flex: 1;
  text-align: center;
}

.footer-links ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}

.footer-links a:hover {
  color: #1d8f8b;
  transition: color 0.3s ease;
}

.footer-social {
  flex: 1;
  text-align: right;
}

.footer-social .social-icon {
  color: #fff;
  font-size: 18px;
  margin-left: 12px;
  transition: color 0.3s ease;
}

.footer-social .social-icon:hover {
  color: #1d8f8b;
}

.footer-bottom {
  text-align: center;
  margin-top: 10px;
  font-size: 12px;
  color: #ccc;
}

.footer-bottom p {
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-social {
    margin-top: 15px;
  }
}
</style>
