<template>
  <div class="dashboard-container">
    <div class="row g-3">
      <div :class="selectedCall ? 'col-xl-8' : 'col-xl-12'">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Llamadas</h5>
            <div class="header-actions">
              <button class="btn btn-primary btn-sm">
                <i class="fas fa-plus me-2" style="margin-right: 5px"></i>Nueva Llamada
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
                  <th>Fecha</th>
                  <th>Teleoperador</th>
                  <th class="text-center">Estado</th>
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
                      <i class="fas fa-phone-alt text-primary me-2" style="margin-right: 5px"></i>
                      {{ call.tipo }}
                    </div>
                  </td>
                  <td>{{ call.paciente }}</td>
                  <td>{{ call.fecha }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="rounded-circle me-2"
                           style="width: 32px; height: 32px; background-color: #007bff; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; margin-right: 5px;">
                        {{ call.paciente.charAt(0).toUpperCase() }}
                      </div>
                      {{ call.paciente }}
                    </div>
                  </td>
                  <td class="text-center">
                      <span
                          class="badge rounded-pill"
                          :class="call.estado === 'Completada' ? 'bg-success' : 'bg-warning'"
                      >
                        {{ call.estado }}
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
            <div class="text-center mb-4">
              <img
                  src="/assets/user-icon.webp"
                  class="rounded-circle mb-3 shadow-sm"
                  width="80"
                  height="80"
                  alt="Teleoperador"
              >
              <h6 class="mb-0">{{ selectedCall.teleoperador }}</h6>
              <small class="text-muted">Teleoperador</small>
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
                  <span class="detail-value">{{ selectedCall.tipo }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Paciente</span>
                  <span class="detail-value">{{ selectedCall.paciente }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Fecha</span>
                  <span class="detail-value">{{ selectedCall.fecha }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Estado</span>
                  <span
                      class="badge rounded-pill"
                      :class="selectedCall.estado === 'Completada' ? 'bg-success' : 'bg-warning'"
                  >
                    {{ selectedCall.estado }}
                  </span>
                </div>
              </div>
            </div>

            <div class="details-section mt-4">
              <h6 class="details-title">Descripción</h6>
              <p class="text-muted mb-0">{{ selectedCall.descripcion }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCounterStore } from "@/stores/index.js";

export default {
  computed: {
    ...mapState(useCounterStore, ["calls"]),
  },
  data() {
    return {
      selectedCall: null
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