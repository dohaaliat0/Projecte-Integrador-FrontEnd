<template>
  <div class="container" style="margin-top: 20px">
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Cargando...</span>
      </div>
      <p>Cargando información del paciente...</p>
    </div>

    <div v-else class="team-single">
      <div class="row">
        <div class="col-lg-4 col-md-5 xs-margin-30px-bottom">
          <div class="team-single-img text-center">
            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Paciente" />
          </div>
          <div class="bg-light-gray padding-30px-all text-center">
            <h4 class="font-size24">{{ patient.fullName }}</h4>
          </div>
          <div class="mt-4 d-flex justify-content-center gap-3">
            <button @click="$router.push('/calls/patient/' + patient.id + '/type/incomingCall')" class="btn btn-action btn-edit">
              <i class="fas fa-phone me-2" style="margin-right: 3px"></i>
              Entrantes
            </button>
            <button @click="$router.push('/calls/patient/' + patient.id + '/type/outgoingCall')" class="btn btn-action btn-delete">
              <i class="fas fa-phone me-2" style="margin-right: 3px"></i>
              Salientes
            </button>
          </div>
        </div>

        <div class="col-lg-8 col-md-7">
          <div class="team-single-text padding-50px-left">
            <h4 class="font-size38">{{ patient.fullName }}</h4>
            <p>{{ patient.personalFamilySituation }}</p>
            <div class="contact-info-section margin-40px-tb">
              <ul class="list-style9">
                <li v-if="patient.birthDate">
                  <div class="row">
                    <div class="col-md-5 col-5">
                      <i class="fas fa-birthday-cake text-orange" style="margin-right: 5px"></i>
                      <strong class="text-orange">Fecha de Nacimiento:</strong>
                    </div>
                    <div class="col-md-7 col-7">
                      <p>{{ patient.birthDate }}</p>
                    </div>
                  </div>
                </li>
                <li v-if="patient.dni">
                  <div class="row">
                    <div class="col-md-5 col-5">
                      <i class="fas fa-id-card text-yellow" style="margin-right: 5px"></i>
                      <strong class="text-yellow">DNI:</strong>
                    </div>
                    <div class="col-md-7 col-7">
                      <p>{{ patient.dni }}</p>
                    </div>
                  </div>
                </li>
                <li v-if="patient.healthCardNumber">
                  <div class="row">
                    <div class="col-md-5 col-5">
                      <i class="fas fa-credit-card text-cyan" style="margin-right: 5px"></i>
                      <strong class="text-cyan">Tarjeta Sanitaria:</strong>
                    </div>
                    <div class="col-md-7 col-7">
                      <p>{{ patient.healthCardNumber }}</p>
                    </div>
                  </div>
                </li>
                <li v-if="patient.phone">
                  <div class="row">
                    <div class="col-md-5 col-5">
                      <i class="fas fa-phone text-blue" style="margin-right: 5px"></i>
                      <strong class="text-blue">Teléfono:</strong>
                    </div>
                    <div class="col-md-7 col-7">
                      <p>{{ patient.phone }}</p>
                    </div>
                  </div>
                </li>
                <li v-if="patient.email">
                  <div class="row">
                    <div class="col-md-5 col-5">
                      <i class="fas fa-envelope text-pink" style="margin-right: 5px"></i>
                      <strong class="text-pink">Email:</strong>
                    </div>
                    <div class="col-md-7 col-7">
                      <p>{{ patient.email }}</p>
                    </div>
                  </div>
                </li>
                <li v-if="patient.fullAddress">
                  <div class="row">
                    <div class="col-md-5 col-5">
                      <i class="fas fa-map-marker-alt text-green" style="margin-right: 5px"></i>
                      <strong class="text-green">Dirección:</strong>
                    </div>
                    <div class="col-md-7 col-7">
                      <p>{{ patient.fullAddress }}</p>
                    </div>
                  </div>
                </li>
                <li v-if="patient.healthSituation">
                  <div class="row">
                    <div class="col-md-5 col-5">
                      <i class="fas fa-heartbeat text-lightred" style="margin-right: 5px"></i>
                      <strong class="text-lightred">Situación Sanitaria:</strong>
                    </div>
                    <div class="col-md-7 col-7">
                      <p>{{ patient.healthSituation }}</p>
                    </div>
                  </div>
                </li>
                <li v-if="patient.housingSituation">
                  <div class="row">
                    <div class="col-md-5 col-5">
                      <i class="fas fa-home text-brown" style="margin-right: 5px"></i>
                      <strong class="text-brown">Situación Habitacional:</strong>
                    </div>
                    <div class="col-md-7 col-7">
                      <p>{{ patient.housingSituation }}</p>
                    </div>
                  </div>
                </li>
                <li v-if="patient.personalAutonomy">
                  <div class="row">
                    <div class="col-md-5 col-5">
                      <i class="fas fa-wheelchair text-purple" style="margin-right: 5px"></i>
                      <strong class="text-purple">Autonomía Personal:</strong>
                    </div>
                    <div class="col-md-7 col-7">
                      <p>{{ patient.personalAutonomy }}</p>
                    </div>
                  </div>
                </li>
                <li v-if="patient.economicSituation">
                  <div class="row">
                    <div class="col-md-5 col-5">
                      <i class="fas fa-money-bill-wave text-green" style="margin-right: 5px"></i>
                      <strong class="text-green">Situación Económica:</strong>
                    </div>
                    <div class="col-md-7 col-7">
                      <p>{{ patient.economicSituation }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div v-if="patient.contactPersons && patient.contactPersons.length" style="margin-bottom: 50px">
              <h5 class="font-size24">Personas de Contacto</h5>
              <ul class="list-group">
                <li v-for="contact in patient.contactPersons" :key="contact.id" class="list-group-item">
                  <strong>{{ contact.firstName }} {{ contact.lastName }}</strong> - {{ contact.relationship }} - 📞 {{ contact.phone }}
                </li>
              </ul>
            </div>

            <div v-if="patient.contactPersons && patient.contactPersons.length" style="margin-bottom: 50px">
              <h5 class="font-size24">Idiomas</h5>
              <ul class="list-group">
                <li v-for="language in patient.languages" :key="language.id" class="list-group-item">
                  <strong>{{ language.name }}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PatientsRepository from "@/repositories/patients.repository.js";
import { useMessagesStore } from "@/stores/messages";

export default {
  props: ['id'],
  data() {
    return {
      patient: {},
      isLoading: true
    }
  },
  async mounted() {
    if (this.id) {
      const repositoryPatients = new PatientsRepository()
      const response = await repositoryPatients.getPatientById(this.id);
      if(!response.success){
        useMessagesStore().pushMessageAction({
          type: 'error',
          message: response.message ?? 'Error al obtener la información del paciente'
        });
      }

      if (response.data.id) {
        this.isLoading = false
        this.patient = response.data;
      } else {
        this.$router.push('/patients');
      }
    } else {
      this.$router.push('/patients');
    }
  }
}
</script>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css';
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css';

body {
  font-size: 16px;
  color: #6f6f6f;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0.8px;
  margin-top: 20px;
}
.font-size38 {
  font-size: 38px;
}
.list-style9 {
  list-style: none;
  padding: 0;
}
.list-style9 li {
  padding-bottom: 15px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
}
.list-style9 li:last-child {
  border-bottom: none;
}
.text-orange {
  color: #e95601;
}
.text-green {
  color: #5bbd2a;
}
.text-yellow {
  color: #f0d001;
}
.text-purple {
  color: #9d60ff;
}
.text-pink {
  color: #ff48a4;
}
.text-lightred {
  color: #ff5722;
}
.btn-edit {
  color: #42af20;
}

.btn-delete {
  color: #dc3545;
}

.btn-action:hover {
  background-color: #e9ecef;
}

.btn-edit:hover {
  color: #328519;
}

.btn-delete:hover {
  color: #b02a37;
}
</style>
