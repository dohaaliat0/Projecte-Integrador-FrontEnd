<template>
  <section class="about-section" id="about">
    <div class="container">
      <div class="row">
        <div class="col-md-6 about-content">
          <h2 class="display-4">Acerca de Nosotros</h2>
          <p class="lead">
            En <strong>ConectaSalud</strong>, nos dedicamos a mejorar la comunicación entre los pacientes y los profesionales de la salud mediante un sistema eficiente de gestión de llamadas. Nuestro objetivo es proporcionar una plataforma fácil de usar que garantice la satisfacción tanto de pacientes como de teleoperadores.
          </p>
          <p class="text-muted">
            Nuestra misión es hacer que la salud esté al alcance de todos, conectando a las personas de manera segura y eficaz. La tecnología juega un papel clave en nuestros esfuerzos por transformar la forma en que interactuamos con los servicios de salud.
          </p>
        </div>

        <div class="col-md-6 about-image">
          <img src="/assets/about.webp" alt="Sobre Nosotros" class="img-fluid rounded shadow-lg">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {}
</script>

<style scoped>
.about-section {
  padding: 60px 0;
  background-color: #f7f7fc;
}

.about-content {
  text-align: left;
  padding-right: 30px;
}

.about-content h2 {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

.about-content p {
  font-size: 18px;
  line-height: 1.6;
  color: #555;
}

.about-content .lead {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
}

.about-content .text-muted {
  color: #888;
}

.about-image {
  text-align: center;
  padding-left: 30px;
}

.about-image img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .about-section {
    padding: 40px 0;
  }

  .about-content {
    text-align: center;
    padding-right: 0;
  }

  .about-image {
    padding-left: 0;
    margin-top: 20px;
  }
}
</style>
