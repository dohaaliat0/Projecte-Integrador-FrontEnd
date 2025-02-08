<template>
  <div class="dashboard-container">
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Cargando...</span>
      </div>
      <p>Cargando llamadas...</p>
    </div>

    <div v-else>
      <div v-if="!idPatient" class="row justify-content-center mb-5">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card-body">
            <div class="input-group input-group-lg">
              <div class="input-group-prepend">
                <span class="input-group-text bg-white border-right-0">
                  <i class="fas fa-search text-primary"></i>
                </span>
              </div>
              <input
                v-model="searchTerm"
                type="text"
                class="form-control border-left-0 pl-0"
                placeholder="Buscar llamadas por nombre de pacientes"
                style="border-left: none; box-shadow: none;"
              >
              <button
                @click="toggleAddCall"
                class="btn btn-light ml-3 add-call-btn"
                title="Añadir Llamada"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div :class="selectedCall || showAddCall ? 'col-xl-8' : 'col-xl-12'">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Llamadas</h5>
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
                    v-for="call in paginatedCalls"
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

              <div v-if="selectedCall.outgoingCall && selectedCall.outgoingCall.alert" class="details-section mt-4">
                <h6 class="details-title">Información de Alerta</h6>
                <div class="details-grid">
                  <div class="detail-item">
                    <span class="detail-label">ID de Alerta</span>
                    <span class="detail-value">#{{ selectedCall.outgoingCall.alert.id }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Tipo de Alerta</span>
                    <span class="detail-value">{{ selectedCall.outgoingCall.alert.type }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Fecha de Alerta</span>
                    <span class="detail-value">{{ formatDateTime(selectedCall.outgoingCall.alert.date) }}</span>
                  </div>
                </div>
                <div class="detail-item description-item mt-3">
                  <span class="detail-label">Descripción</span>
                  <div class="detail-value description-value">
                    <p>
                      {{ selectedCall.outgoingCall.alert.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-4" v-if="showAddCall">
          <AddCall @call-added="handleCallAdded" />
        </div>
      </div>

      <div v-if="!isLoading && filteredPatients.length === 0" class="text-center mt-5">
        <div class="text-muted">
          <i class="fas fa-search fa-3x mb-3"></i>
          <h4>No se encontraron pacientes</h4>
          <p>Intenta con otros términos de búsqueda</p>
        </div>
      </div>

      <div class="pagination-container mt-4">
        <nav class="pagination" role="navigation" aria-label="pagination">
          <button
            class="pagination-button"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            aria-label="Previous page"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <button
            v-for="pageNumber in getDisplayedPageNumbers()"
            :key="pageNumber"
            @click="changePage(pageNumber)"
            :class="['pagination-button', { 'is-current': pageNumber === currentPage }]"
            :aria-label="`Page ${pageNumber}`"
            :aria-current="pageNumber === currentPage ? 'page' : undefined"
          >
            {{ pageNumber }}
          </button>

          <button
            v-if="showEllipsisEnd()"
            class="pagination-ellipsis"
            disabled
          >
            <span>&hellip;</span>
          </button>

          <button
            class="pagination-button"
            :disabled="currentPage === getTotalPages()"
            @click="changePage(currentPage + 1)"
            aria-label="Next page"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCounterStore } from "@/stores/index.js";
import AddCall from '../utils/AddCall.vue';

export default {
  props: ['idPatient'],
  components: {
    AddCall
  },
  computed: {
    ...mapState(useCounterStore, ["calls"]),
    filteredPatients() {
      const searchTermLower = this.searchTerm.toLowerCase().trim()
      return this.allCalls.filter(call =>
        call.patient.fullName.toLowerCase().includes(searchTermLower)
      )
    },
    paginatedCalls() {
      return this.getPaginatedCalls()
    }
  },
  data() {
    return {
      selectedCall: null,
      showAddCall: false,
      searchTerm: '',
      isLoading: true,
      allCalls: [],
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  async mounted() {
    if (this.idPatient) {
      this.allCalls = await this.loadCallsByPatient(this.idPatient)
    } else {
      if (this.calls.length === 0) {
        await this.loadCalls()
      }
      this.allCalls = this.calls
    }
    this.isLoading = false;
  },
  methods: {
    ...mapActions(useCounterStore, ["loadCalls", "getCallTypeLabel", "getCallTypeBadgeClass", "loadCallsByPatient"]),
    selectCall(call) {
      this.selectedCall = call;
      this.showAddCall = false;
    },
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString();
    },
    toggleAddCall() {
      this.showAddCall = !this.showAddCall;
      this.selectedCall = null;
    },
    async handleCallAdded() {
      this.isLoading = true
      this.showAddCall = false;
      await this.loadCalls();
      this.isLoading = false
    },
    getTotalPages() {
      return Math.ceil(this.filteredPatients.length / this.itemsPerPage)
    },
    changePage(page) {
      if (page >= 1 && page <= this.getTotalPages()) {
        this.currentPage = page
      }
    },
    getDisplayedPageNumbers() {
      const displayed = []
      const totalDisplayed = 5
      const totalPages = this.getTotalPages()

      if (totalPages <= totalDisplayed) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
      }

      displayed.push(1)

      let start = Math.max(2, this.currentPage - Math.floor(totalDisplayed / 2))
      let end = Math.min(totalPages - 1, start + totalDisplayed - 3)

      if (end === totalPages - 1) {
        start = Math.max(2, end - totalDisplayed + 3)
      }

      if (start > 2) {
        displayed.push('...')
      }

      for (let i = start; i <= end; i++) {
        displayed.push(i)
      }

      if (end < totalPages - 1) {
        displayed.push('...')
      }

      displayed.push(totalPages)

      return displayed
    },
    showEllipsisEnd() {
      return this.getTotalPages() > 5 && !this.getDisplayedPageNumbers().includes(this.getTotalPages() - 1)
    },
    getPaginatedCalls() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredPatients.slice(start, end)
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

.input-group-text {
  border-radius: 10px 0 0 10px !important;
  border: 1px solid #ced4da;
}

.input-group .form-control {
  border-radius: 0 10px 10px 0 !important;
  border: 1px solid #ced4da;
  font-size: 1rem;
}

.input-group .form-control:focus {
  box-shadow: none;
  border-color: #80bdff;
}

.input-group-text .fas {
  font-size: 1.2rem;
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

.row > div {
  animation: fadeIn 0.3s ease-out forwards;
}

.add-call-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: #fff;
  border: 1px solid #dee2e6;
}

.add-call-btn:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
}
.input-group {
  flex: 1;
  margin-right: 10px;
}

.description-value {
  width: 100%;
  margin-top: 0.5rem;
}

.description-item {
  flex-direction: column;
  align-items: flex-start !important;
}

.btn-link {
  font-size: 0.875rem;
  padding: 0;
  vertical-align: baseline;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.pagination {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 0.5rem;
}

.pagination-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 0.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #4b5563;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover {
  background-color: #f3f4f6;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button.is-current {
  background-color: #3b82f6;
  color: #ffffff;
}

.pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 0.25rem;
  font-weight: 500;
  color: #4b5563;
}
</style>
