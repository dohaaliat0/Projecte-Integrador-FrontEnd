<template>
  <div class="card h-100">
    <div class="card-header bg-primary text-white" style="border-radius: 0.75rem 0.75rem 0 0">
      <h5 class="card-title mb-0">Añadir Nueva Llamada</h5>
    </div>
    <div class="card-body">
      <form @submit.prevent="submitCall">
        <div class="form-group">
          <label for="callType">Tipo de Llamada</label>
          <select v-model="callType" class="form-control" id="callType" required>
            <option value="incoming">Entrante</option>
            <option value="outgoing">Saliente</option>
          </select>
        </div>

        <div class="form-group">
          <label for="patientId">Paciente</label>
          <SearchableSelect
            v-model="call.patientId"
            :options="patients"
            placeholder="Seleccionar paciente"
            multiple
          />
        </div>

        <div class="form-group">
          <label for="patientId">Operador</label>
          <SearchableSelect
            v-model="call.operatorId"
            :options="operators"
            placeholder="Seleccionar operador"
            multiple
          />
        </div>

        <div class="form-group">
          <label for="dateTime">Fecha y Hora</label>
          <input
            v-model="call.dateTime"
            type="datetime-local"
            class="form-control"
            id="dateTime"
            required
          />
        </div>

        <div v-if="callType === 'incoming'" class="form-group">
          <label for="incomingCallType">Tipo de Llamada Entrante</label>
          <select
            v-model="call.incomingCall.type"
            class="form-control"
            id="incomingCallType"
            required
          >
            <option v-for="type in incomingCallTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <div v-if="callType === 'incoming'" class="form-group">
          <label for="emergencyLevel">Nivel de Emergencia</label>
          <select
            v-model="call.incomingCall.emergencyLevel"
            class="form-control"
            id="emergencyLevel"
            required
          >
            <option v-for="level in [1, 2, 3, 4, 5]" :key="level" :value="level">
              {{ level }}
            </option>
          </select>
        </div>

        <div v-if="callType === 'outgoing'" class="form-group">
          <label for="outgoingCallType">Tipo de Llamada Saliente</label>
          <select
            v-model="call.outgoingCall.type"
            class="form-control"
            id="outgoingCallType"
            required
          >
            <option v-for="type in outgoingCallTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <div v-if="callType === 'outgoing'" class="form-group">
          <label for="alertId">Alerta (opcional)</label>
          <SearchableSelect
            v-model="call.outgoingCall.alertId"
            :options="alerts"
            placeholder="Seleccionar alerta"
            multiple
          />
        </div>

        <div class="form-group">
          <label for="details">Detalles de la Llamada</label>
          <textarea
            v-model="call.details"
            class="form-control"
            id="details"
            rows="3"
            required
          ></textarea>
        </div>

        <div v-if="errors.length" class="alert alert-danger">
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>

        <button type="submit" class="btn btn-primary btn-block mt-4" :disabled="isSubmitting">
          {{ isSubmitting ? 'Guardando...' : 'Guardar Llamada' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useCounterStore } from '@/stores/index.js'
import { IncomingCallsType, OutgoingCallsType } from '../enums/callTypes.js'
import CallsRepository from '@/repositories/calls.repository.js'
import SearchableSelect from '@/components/utils/SearchableSelect.vue'

export default {
  components: { SearchableSelect },
  data() {
    return {
      callType: 'incoming',
      call: {
        patientId: '',
        operatorId: '',
        dateTime: '',
        details: '',
        incomingCall: {
          type: '',
          emergencyLevel: 1
        },
        outgoingCall: {
          type: '',
          alertId: null
        }
      },
      errors: [],
      isSubmitting: false,
      incomingCallTypes: IncomingCallsType.values(),
      outgoingCallTypes: OutgoingCallsType.values()
    }
  },
  computed: {
    ...mapState(useCounterStore, ['patients', 'operators', 'calls', 'alerts'])
  },
  methods: {
    ...mapActions(useCounterStore, ['loadPatients', 'loadOperators', 'loadAlerts']),
    async submitCall() {
      this.errors = []
      this.isSubmitting = true

      try {
        const callData = {
          patientId: this.call.patientId,
          operatorId: this.call.operatorId,
          dateTime: this.call.dateTime,
          details: this.call.details
        }

        if (this.callType === 'incoming') {
          callData.incomingCall = this.call.incomingCall
        } else {
          callData.outgoingCall = this.call.outgoingCall
        }

        const callsRepository = new CallsRepository()
        const response = await callsRepository.addCall(callData)
        this.calls.push(response.data)
        this.resetForm()
      } catch (error) {
        console.error('Error creating call:', error)
      } finally {
        this.isSubmitting = false
      }
    },
    resetForm() {
      this.callType = 'incoming'
      this.call = {
        patientId: '',
        operatorId: '',
        dateTime: '',
        details: '',
        incomingCall: {
          type: '',
          emergencyLevel: 1
        },
        outgoingCall: {
          type: '',
          alertId: null
        }
      }
      this.errors = []
    }
  },
  async mounted() {
    try {
      if (this.patients.length === 0) {
        await this.loadPatients()
      }
      if (this.alerts.length === 0) {
        await this.loadAlerts()
      }
      if (this.operators.length === 0) {
        await this.loadOperators()
      }
    } catch (error) {
      console.error('Error loading patients:', error)
    }
  }
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.75rem;
  background: #ffffff;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card-header {
  border-radius: 0.75rem 0.75rem 0 0;
  padding: 1rem 1.5rem;
}

.form-control {
  border-radius: 0.25rem;
  border: 1px solid #ced4da;
  padding: 0.5rem 0.75rem;
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
  color: #344767;
}

@media (max-width: 768px) {
  .card-body {
    padding: 1.25rem;
  }
}
</style>