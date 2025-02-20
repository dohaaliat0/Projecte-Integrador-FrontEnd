<template>
  <div class="dashboard-container">
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Cargando...</span>
      </div>
      <p>Cargando alertas...</p>
    </div>

    <div v-else>
      <div class="row justify-content-center mb-5">
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
                placeholder="Buscar alertas por nombre de pacientes"
                style="border-left: none; box-shadow: none;"
              >
              <button
                @click="toggleAddAlert"
                class="btn btn-light ml-3 add-alert-btn"
                title="Añadir Alerta"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div :class="selectedAlert || showAddAlert ? 'col-xl-8' : 'col-xl-12'">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Alertas</h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle">
                  <thead class="table-light">
                  <tr>
                    <th class="ps-4 sortable" @click="sortBy('id')">#</th>
                    <th class="sortable" @click="sortBy('title')">Título</th>
                    <th class="sortable" @click="sortBy('patient.fullName')">Paciente</th>
                    <th class="sortable" @click="sortBy('date')">Fecha y Hora</th>
                    <th class="sortable" @click="sortBy('operator.name')">Operador</th>
                    <th class="sortable" @click="sortBy('zoneId')">Zona</th>
                    <th class="text-center sortable" @click="sortBy('type')">Tipo</th>
                    <th class="text-center sortable" @click="sortBy('isActive')">Estado</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                    v-for="alert in getPaginatedAlerts()"
                    :key="alert.id"
                    class="alert-row"
                    @click="selectAlert(alert)"
                  >
                    <td class="ps-4">{{ alert.id }}</td>
                    <td class="text-wrap" style="max-width: 200px;">
                      <div class="text-truncate" :title="alert.title">{{ alert.title }}</div>
                    </td>
                    <td>
                      <div class="d-flex align-items-center" v-if="alert.patient">
                        <div class="rounded-circle me-2"
                             style="width: 32px; height: 32px; background-color: #007bff; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; margin-right: 5px;">
                          {{ alert.patient.fullName.charAt(0).toUpperCase() }}
                        </div>
                        <a :href="`/patient/${alert.patient.id}`">{{ alert.patient.fullName }}</a>
                      </div>
                      <span v-else class="text-muted">Sin paciente asignado</span>
                    </td>
                    <td>{{ formatDateTime(alert.date, alert.time) }}</td>
                    <td>
                      <div class="d-flex align-items-center" v-if="alert.operator">
                        <div class="rounded-circle me-2"
                             style="width: 32px; height: 32px; background-color: #007bff; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; margin-right: 5px;">
                          {{ alert.operator.name.charAt(0).toUpperCase() }}
                        </div>
                        {{ alert.operator.name }}
                      </div>
                    </td>
                    <td>
                      <div class="d-flex align-items-center" v-if="alert.zone">

                      {{ alert.zone.name }}
                      </div>
                      <span v-else class="text-muted">Sin zona asignada</span>
                    </td>
                    <td class="text-center">
                        <span
                          class="badge rounded-pill"
                          :class="getAlertTypeBadgeClass(alert.type)"
                        >
                          {{ getAlertTypeLabel(alert.type) }}
                        </span>
                    </td>
                    <td class="text-center">
                        <span
                          class="badge rounded-pill"
                          :class="alert.isActive ? 'bg-success' : 'bg-secondary'"
                        >
                          {{ alert.isActive ? 'Activa' : 'Inactiva' }}
                        </span>
                    </td>
                    <td class="text-center">
                      <button
                        @click.stop="editAlert(alert)"
                        class="btn btn-sm btn-link p-0 me-2"
                        title="Editar"
                        style="margin-right: 5px"
                      >
                        <i class="fas fa-pencil text-primary"></i>
                      </button>
                      <button
                        @click.stop="deleteAlert(alert)"
                        class="btn btn-sm btn-link p-0"
                        title="Eliminar"
                      >
                        <i class="fas fa-trash-alt text-danger"></i>
                      </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-4" v-if="selectedAlert">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Detalles de Alerta</h5>
              <button @click="selectedAlert = null" class="btn btn-sm btn-link" style="color: red; font-size: 1.2rem">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="card-body">
              <div class="text-center mb-4" v-if="selectedAlert.operator">
                <div
                  class="rounded-circle mx-auto mb-3 shadow-sm d-flex align-items-center justify-content-center"
                  style="width: 80px; height: 80px; background-color: #007bff; color: white; font-size: 2rem;"
                >
                  {{ selectedAlert.operator.name.charAt(0).toUpperCase() }}
                </div>
                <h6 class="mb-0">{{ selectedAlert.operator.name }}</h6>
                <small class="text-muted">Operador</small>
              </div>

              <div class="details-section">
                <h6 class="details-title">Información de la Alerta</h6>
                <div class="details-grid">
                  <div class="detail-item">
                    <span class="detail-label">ID de Alerta</span>
                    <span class="detail-value">#{{ selectedAlert.id }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Título</span>
                    <span class="detail-value">{{ selectedAlert.title }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Paciente</span>
                    <span class="detail-value" v-if="selectedAlert.patient">
                      {{ selectedAlert.patient.fullName }}
                    </span>
                    <span class="detail-value text-muted" v-else>Sin paciente asignado</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Fecha y Hora</span>
                    <span class="detail-value">{{ formatDateTime(selectedAlert.date, selectedAlert.time) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Tipo</span>
                    <span
                      class="badge rounded-pill"
                      :class="getAlertTypeBadgeClass(selectedAlert.type)"
                    >
                      {{ getAlertTypeLabel(selectedAlert.type) }}
                    </span>
                  </div>
                  <div class="detail-item" v-if="selectedAlert.zone">
                    <span class="detail-label">Zona</span>
                    <span class="detail-value">{{ selectedAlert.zone.name }}</span>
                  </div>
                  <div class="detail-item" v-if="selectedAlert.isRecurring">
                    <span class="detail-label">Fecha de finalización</span>
                    <span class="detail-value">{{ formatDateTime(selectedAlert.endDate, '00:00:00') }}</span>
                  </div>
                  <div class="detail-item" v-if="selectedAlert.isRecurring && selectedAlert.dayOfWeek">
                    <span class="detail-label">Días de recurrencia</span>
                    <span class="detail-value">{{ formatRecurringDays(selectedAlert.dayOfWeek) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Recurrente</span>
                    <span class="badge rounded-pill bg-info">
                      {{ selectedAlert.isRecurring ? 'Sí' : 'No' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="details-section mt-4">
                <h6 class="details-title">Descripción</h6>
                <p class="text-muted mb-0">{{ selectedAlert.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-4" v-if="showAddAlert">
          <AddAlert
            :editingAlert="editingAlert"
            @alert-added="handleAlertAdded"
            @alert-updated="handleAlertUpdated"
            @close="closeAddAlert"
          />
        </div>
      </div>

      <div v-if="!isLoading" class="pagination-container mt-4">
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
import AddAlert from '@/components/views/adds/AddAlert.vue'
import { useCounterStore } from '@/stores/index.js'
import AlertsRepository from '@/repositories/alerts.repository.js'
import { useMessagesStore } from '@/stores/messages.js'

export default {
  props: ['idPatient'],
  components: {
    AddAlert
  },

  data() {
    return {
      selectedAlert: null,
      showAddAlert: false,
      editingAlert: null,
      searchTerm: '',
      isLoading: true,
      allAlerts: [],
      currentPage: 1,
      itemsPerPage: 10,
      sortKey: '',
      sortOrder: 1,
    }
  },
  computed: {
    ...mapState(useCounterStore, ["alerts"]),
    filteredAlerts() {
      const searchTermLower = this.searchTerm.toLowerCase().trim()
      return this.allAlerts.filter(alert => {
        if (!searchTermLower) return true
        return alert.patient && alert.patient.fullName.toLowerCase().includes(searchTermLower)
      })
    },
    sortedAlerts() {
      return [...this.filteredAlerts].sort((a, b) => {
        let aValue = this.getSortValue(a, this.sortKey);
        let bValue = this.getSortValue(b, this.sortKey);

        if (aValue < bValue) return -1 * this.sortOrder;
        if (aValue > bValue) return 1 * this.sortOrder;
        return 0;
      });
    },
  },
  methods: {
    ...mapActions(useCounterStore, ["loadAlerts" , "getAlertTypeBadgeClass", "getAlertTypeLabel", "formatRecurringDays"]),
    selectAlert(alert) {
      this.selectedAlert = alert;
      this.showAddAlert = false;
      this.editingAlert = null;
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder *= -1;
      } else {
        this.sortKey = key;
        this.sortOrder = 1;
      }
    },

    getSortValue(obj, key) {
      return key.split('.').reduce((o, k) => (o || {})[k], obj);
    },

    getPaginatedAlerts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedAlerts.slice(start, end);
    },
    formatDateTime(date, time) {
      const datetime = new Date(`${date}T${time}`)
      return datetime.toLocaleString()
    },

    toggleAddAlert() {
      this.showAddAlert = !this.showAddAlert
      this.selectedAlert = null
      this.editingAlert = null
    },

    closeAddAlert() {
      this.showAddAlert = false
      this.editingAlert = null
    },

    editAlert(alert) {
      this.editingAlert = { ...alert };
      this.showAddAlert = true;
      this.selectedAlert = null;
    },

    async deleteAlert(alert) {
      if (confirm(`¿Estás seguro de que quieres eliminar esta alerta?`)) {
        try {
          const alertsRepository = new AlertsRepository();
          await alertsRepository.deleteAlert(alert.id);
          this.allAlerts = this.allAlerts.filter(a => a.id !== alert.id);
          if (this.selectedAlert && this.selectedAlert.id === alert.id) {
            this.selectedAlert = null;
          }
          await this.loadAlerts();
        } catch (error) {
          useMessagesStore().pushMessageAction({ type: 'error', message: 'Error al eliminar la alerta. Por favor, inténtelo de nuevo.' });
        }
      }
    },

    async handleAlertAdded(newAlert) {
      this.showAddAlert = false
      this.editingAlert = null
      if(this.idPatient && newAlert.patient.id === this.idPatient) {
        this.allAlerts = this.alerts.push(newAlert)
      } else {
        this.alerts.push(newAlert)
        this.allAlerts = this.alerts
      }
      useMessagesStore().pushMessageAction({ type: 'success', message: 'Alerta actualizada correctamente' });
    },

    async handleAlertUpdated(updatedAlert) {
      this.showAddAlert = false
      this.editingAlert = null
      if(this.idPatient) {
        const index = this.allAlerts.findIndex(a => a.id === updatedAlert.id)
        if (index !== -1) {
          this.allAlerts[index] = updatedAlert
        }
      } else {
        const index = this.alerts.findIndex(a => a.id === updatedAlert.id)
        if (index !== -1) {
          this.allAlerts[index] = updatedAlert
        }
        this.allAlerts = this.alerts
      }
      useMessagesStore().pushMessageAction({ type: 'success', message: 'Alerta actualizada correctamente' });
    },

    getTotalPages() {
      return Math.ceil(this.filteredAlerts.length / this.itemsPerPage);
    },
    changePage(page) {
      if (page >= 1 && page <= this.getTotalPages()) {
        this.currentPage = page;
        this.selectedAlert = null;
      }
    },
    getDisplayedPageNumbers() {
      const displayed = [];
      const totalDisplayed = 5;
      const totalPages = this.getTotalPages();

      if (totalPages <= totalDisplayed) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      displayed.push(1);

      let start = Math.max(2, this.currentPage - Math.floor(totalDisplayed / 2));
      let end = Math.min(totalPages - 1, start + totalDisplayed - 3);

      if (end === totalPages - 1) {
        start = Math.max(2, end - totalDisplayed + 3);
      }

      if (start > 2) {
        displayed.push('...');
      }

      for (let i = start; i <= end; i++) {
        displayed.push(i);
      }

      if (end < totalPages - 1) {
        displayed.push('...');
      }

      displayed.push(totalPages);

      return displayed;
    },
    showEllipsisEnd() {
      return this.getTotalPages() > 5 && !this.getDisplayedPageNumbers().includes(this.getTotalPages() - 1);
    }
  },

  async mounted() {
    if (this.alerts.length === 0) {
      await this.loadAlerts()
    }

    if (this.idPatient) {
      this.allAlerts = this.alerts.filter(item => item?.patient?.id == this.idPatient);
    } else {
      this.allAlerts = this.alerts
    }

    this.isLoading = false
  }
}
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
  white-space: normal;
}

.alert-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.alert-row:hover {
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
  margin-bottom: 1rem;
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
  min-width: 40%;
}

.detail-value {
  font-weight: 500;
  color: #344767;
  word-break: break-word;
  text-align: right;
  max-width: 60%;
}

.add-alert-btn {
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

.add-alert-btn:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
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

.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.sortable::after {
  position: absolute;
  right: 8px;
  opacity: 0.5;
}

.sortable:active {
  transform: translateY(1px);
}

.sortable {
  transition: background-color 0.2s, transform 0.1s;
}
</style>