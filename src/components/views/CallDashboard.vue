<template>
  <div class="dashboard-container">
    <div class="row g-3">
      <div :class="selectedCall || showAddCall ? 'col-xl-8' : 'col-xl-12'">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Llamadas</h5>
            <div class="header-actions">
              <button @click="toggleAddCall" class="btn btn-primary btn-sm" style="background-color: white; border-color: white; color: white">
                <i class="fas fa-plus" style="color: #007bff; background-color: white"></i>
              </button>
            </div>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                <tr>
                  <th class="ps-4">#</th>
                  <th>Tipo de Llamada</th>
                  <th>Paciente</th>
                  <th>Fecha y Hora</th>
                  <th>Operador</th>
                  <th class="text-center">Tipo</th>
                </tr>
                </thead>
                <tbody>
                <tr
                  v-for="call in calls"
                  :key="call.id"
                  @click="selectCall(call)"
                  class="call-row"
                >
                  <td class="ps-4">{{ call.id }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <i :class="['fas', 'fa-phone-alt', call.incoming ? 'text-primary' : 'text-danger', 'me-2']" style="margin-right: 5px"></i>
                      {{ call.incoming ? 'Entrante' : 'Saliente' }}
                    </div>
                  </td>
                  <td>{{ call.patient.fullName }}</td>
                  <td>{{ formatDateTime(call.dateTime) }}</td>
                  <td>
                    <div class="d-flex align-items-center" v-if="call.operator">
                      <div class="rounded-circle me-2"
                           style="width: 32px; height: 32px; background-color: #007bff; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; margin-right: 5px;">
                        {{ call.operator.name.charAt(0).toUpperCase() }}
                      </div>
                      {{ call.operator.name }}
                    </div>
                    <span v-else>-</span>
                  </td>
                  <td class="text-center">
                    <span
                      class="badge rounded-pill"
                      :class="getCallTypeBadgeClass(call)"
                    >
                      {{ getCallTypeLabel(call) }}
                    </span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-4" v-if="selectedCall">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Detalles de Llamada</h5>
            <button @click="selectedCall = null" class="btn btn-sm btn-link" style="color: red; font-size: 1.2rem">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="text-center mb-4" v-if="selectedCall.operator">
              <img
                src="/assets/user-icon.webp"
                class="rounded-circle mb-3 shadow-sm"
                width="80"
                height="80"
                alt="Operador"
              >
              <h6 class="mb-0">{{ selectedCall.operator.name }}</h6>
              <small class="text-muted">Operador</small>
            </div>

            <div class="details-section">
              <h6 class="details-title">Información de la Llamada</h6>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">ID de Llamada</span>
                  <span class="detail-value">#{{ selectedCall.id }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Tipo</span>
                  <span class="detail-value">{{ selectedCall.incoming ? 'Entrante' : 'Saliente' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Paciente</span>
                  <span class="detail-value">{{ selectedCall.patient.fullName }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Fecha y Hora</span>
                  <span class="detail-value">{{ formatDateTime(selectedCall.dateTime) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Tipo Específico</span>
                  <span
                    class="badge rounded-pill"
                    :class="getCallTypeBadgeClass(selectedCall)"
                  >
                    {{ getCallTypeLabel(selectedCall) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="details-section mt-4">
              <h6 class="details-title">Detalles</h6>
              <p class="text-muted mb-0">{{ selectedCall.details || 'Sin detalles' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-4" v-if="showAddCall">
        <AddCall @call-added="handleCallAdded" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCounterStore } from "@/stores/index.js";
import AddCall from './AddCall.vue';

export default {
  components: {
    AddCall
  },
  computed: {
    ...mapState(useCounterStore, ["calls"]),
  },
  data() {
    return {
      selectedCall: null,
      showAddCall: false
    };
  },
  async mounted() {
    if (this.calls.length === 0) {
      await this.loadCalls()
    }
  },
  methods: {
    ...mapActions(useCounterStore, ["loadCalls"]),
    selectCall(call) {
      this.selectedCall = call;
      this.showAddCall = false;
    },
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString();
    },
    getCallTypeBadgeClass(call) {
      if (call.incoming) {
        return {
          'bg-info': call.incomingCall.type === 'INFORMATION',
          'bg-warning': call.incomingCall.type === 'EMERGENCY',
          'bg-success': call.incomingCall.type === 'FOLLOW_UP'
        };
      } else {
        return {
          'bg-primary': call.outgoingCall.type === 'SCHEDULED',
          'bg-danger': call.outgoingCall.type === 'ALERT_RESPONSE'
        };
      }
    },
    getCallTypeLabel(call) {
      if (call.incoming) {
        switch (call.incomingCall.type) {
          case 'INFORMATION': return 'Información';
          case 'EMERGENCY': return 'Emergencia';
          case 'FOLLOW_UP': return 'Seguimiento';
          default: return 'Desconocido';
        }
      } else {
        switch (call.outgoingCall.type) {
          case 'SCHEDULED': return 'Programada';
          case 'ALERT_RESPONSE': return 'Respuesta a Alerta';
          default: return 'Desconocido';
        }
      }
    },
    toggleAddCall() {
      this.showAddCall = !this.showAddCall;
      this.selectedCall = null;
    },
    handleCallAdded() {
      this.showAddCall = false;
      this.loadCalls();
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 1.5rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  border-radius: 0.75rem;
  background: #ffffff;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
}

.card-title {
  color: #344767;
  font-weight: 600;
}

.table {
  margin-bottom: 0;
}

.table th {
  font-weight: 600;
  color: #344767;
  border-bottom-width: 1px;
  padding: 1rem;
}

.table td {
  padding: 1rem;
  vertical-align: middle;
}

.call-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.call-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.badge {
  padding: 0.5em 1em;
  font-weight: 500;
}

.details-section {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.25rem;
}

.details-title {
  color: #344767;
  font-weight: 600;
  margin-bottom: 1rem;
}

.details-grid {
  display: grid;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  color: #6c757d;
  font-size: 0.875rem;
}

.detail-value {
  font-weight: 500;
  color: #344767;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .card-header {
    padding: 1rem;
  }

  .table td,
  .table th {
    padding: 0.75rem;
  }
}

.table-responsive::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.col-xl-4 {
  animation: fadeIn 0.3s ease-out;
}
</style>