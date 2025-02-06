<template>
  <div class="card h-100">
          <div class="card-header bg-primary text-white" style="border-radius: 0.75rem 0.75rem 0 0">
            <h5 class="card-title mb-0">Añadir Nueva Llamada</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitCall">
              <div class="form-group">
                <label for="callType">Tipo de Llamada</label>
                <select v-model="call.incoming" class="form-control" id="callType" required>
                  <option :value="true">Entrante</option>
                  <option :value="false">Saliente</option>
                </select>
              </div>

              <div class="form-group">
                <label for="patientId">Paciente</label>
                <select v-model="call.patientId" class="form-control" id="patientId" required>
                  <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                    {{ patient.fullName }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="operatorId">Operador</label>
                <select v-model="call.operatorId" class="form-control" id="operatorId">
                  <option value="">Sin operador asignado</option>
                  <option v-for="operator in operators" :key="operator.id" :value="operator.id">
                    {{ operator.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="dateTime">Fecha y Hora</label>
                <input v-model="call.dateTime" type="datetime-local" class="form-control" id="dateTime" required>
              </div>

              <div class="form-group" v-if="call.incoming !== null">
                <label for="callSubtype">Subtipo de Llamada</label>
                <select v-model="call.subtype" class="form-control" id="callSubtype" required>
                  <option v-if="call.incoming" value="INFORMATION">Información</option>
                  <option v-if="call.incoming" value="EMERGENCY">Emergencia</option>
                  <option v-if="call.incoming" value="FOLLOW_UP">Seguimiento</option>
                  <option v-if="!call.incoming" value="SCHEDULED">Programada</option>
                  <option v-if="!call.incoming" value="ALERT_RESPONSE">Respuesta a Alerta</option>
                </select>
              </div>

              <div class="form-group" v-if="!call.incoming && call.subtype === 'ALERT_RESPONSE'">
                <label for="alertId">ID de Alerta</label>
                <input v-model="call.alertId" type="number" class="form-control" id="alertId">
              </div>

              <div class="form-group">
                <label for="details">Detalles de la Llamada</label>
                <textarea v-model="call.details" class="form-control" id="details" rows="3"></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-block mt-4">Guardar Llamada</button>
            </form>
          </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useCounterStore } from '@/stores/index.js';

export default {
  data() {
    return {
      call: {
        incoming: null,
        patientId: '',
        operatorId: '',
        dateTime: '',
        subtype: '',
        alertId: null,
        details: ''
      }
    };
  },
  computed: {
    ...mapState(useCounterStore, ['patients', 'operators'])
  },
  methods: {
    ...mapActions(useCounterStore, ['loadPatients']),
    submitCall() {
      console.log('Call data:', this.call);
      this.resetForm();
    },
    resetForm() {
      this.call = {
        incoming: null,
        patientId: '',
        operatorId: '',
        dateTime: '',
        subtype: '',
        alertId: null,
        details: ''
      };
    }
  },
  async mounted() {
    try {
      this.isLoading = true
      if (this.patients.length === 0) {
        await this.loadPatients()
      }
      if (this.patients.length === 0) {
        await this.loadPatients()
      }
    } catch (error) {
      console.error('Error al cargar los pacientes:', error)
    } finally {
      this.isLoading = false
    }
  },
};
</script>

<style scoped>
.card {
  border-radius: 0.75rem 0.75rem 0 0;
  transition: all 0.3s ease-in-out;
}
.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.card-header {
  border-radius: 0.75rem 0.75rem 0 0;
  padding: 1rem 1.5rem;
}

.form-control {
  border-radius: 0.25rem;
}

.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: all 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.card {
  border: none;
  border-radius: 0.75rem;
  background: #ffffff;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: all 0.2s ease;
}

@media (max-width: 768px) {
  .card-body {
    padding: 1.25rem;
  }
}
</style>