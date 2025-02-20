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
              <h5 class="card-title mb-0">Calendario de Alertas</h5>
            </div>
            <div class="card-body calendar-full-width">
              <VCalendar
                v-model:date="selectedDate"
                :attributes="calendarAttributes"
                @dayclick="onDateSelect"
                :initial-date="selectedDate"
              />
              <div class="mt-4">
                <h6>Alertas para {{ formatDate(selectedDate) }}</h6>
                <div class="table-responsive">
                  <table class="table table-hover align-middle">
                    <thead class="table-light">
                    <tr>
                      <th class="ps-4 sortable" @click="sortBy('id')">#</th>
                      <th class="sortable" @click="sortBy('title')">Título</th>
                      <th class="sortable" @click="sortBy('patient.fullName')">Paciente</th>
                      <th class="sortable" @click="sortBy('time')">Hora</th>
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
                      <td>{{ formatTime(alert.time) }}</td>
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
                      <!-- <td class="text-center">
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
                      </td> -->
                      <td>
                        <div class="d-flex align-items-center" v-if="alert.patient">
                          {{ alert.patient.fullName }}
                            <a :href="`/calls/new-with-alert/${alert.id}`" @click.stop><i v-if="!getCallByAlertId(alert.id)" class="fas fa-phone-alt ml-2" title="Ver llamada"></i></a>
                          <a :href="`/calls/edit/${getCallByAlertId(alert.id)}`"><i v-if="getCallByAlertId(alert.id)" class="fas fa-pencil-alt ml-2" title="Editar llamada"></i></a>
                        </div>
                        <span v-else class="text-muted">Sin paciente asignado</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
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
        </div>

        <!-- <div class="col-xl-4" v-if="selectedAlert || showAddAlert">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">{{ showAddAlert ? 'Añadir Alerta' : 'Detalles de Alerta' }}</h5>
              <button @click="closeAddAlert" class="btn btn-sm btn-link" style="color: red; font-size: 1.2rem">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="card-body">
              <AddAlert
                v-if="showAddAlert"
                @alert-added="handleAlertAdded"
                @close="closeAddAlert"
              />
              <AddAlert
                v-else-if="selectedAlert"
                :editingAlert="selectedAlert"
                @alert-updated="handleAlertUpdated"
                @close="closeAddAlert"
              />
            </div>
          </div>
        </div> -->
        <div v-if="showAddAlert || selectedAlert != null" class="col-xl-4 mt-3 pb-5">
          <AddAlert v-if="showAddAlert" @alert-added="handleAlertAdded" @close="closeAddAlert" />
          <AddAlert v-else :editingAlert="selectedAlert" @alert-updated="handleAlertUpdated" @close="closeAddAlert" />

          <div v-if="!showAddAlert" class="d-flex flex-column flex-md-row justify-content-end mt-3 gap-2 mr-2 text-md-right">
            <div :class="idRelatedCall ? 'mr-md-2' : ''">
              <router-link :to="{ name: 'callsNewWithAlert', params: { alertId: selectedAlert.id } }"
                class="btn btn-primary d-flex align-items-center mb-2 mb-md-0">
                Hacer llamada
                <i class="fas fa-phone-alt ml-2"></i>
              </router-link>
            </div>

            <div>
              <router-link v-if="idRelatedCall" :to="{ name: 'edit call', params: { callId: idRelatedCall ?? 1} }"
                class="btn btn-secondary d-flex align-items-center">
                Editar llamada existente
                <i class="fas fa-edit ml-2"></i>
              </router-link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useCounterStore } from '@/stores/index.js';
import { Calendar } from 'v-calendar';
import 'v-calendar/dist/style.css';
import AddAlert from '@/components/views/adds/AddAlert.vue';
import AlertsRepository from '@/repositories/alerts.repository.js';
import { useMessagesStore } from '@/stores/messages.js';
import CallsRepository from '@/repositories/calls.repository.js';

export default {
  name: 'CalendarView',
  components: {
    VCalendar: Calendar,
    AddAlert,
  },
  data() {
    return {
      dateNow: new Date(),
      selectedDate: new Date(),
      selectedAlert: null,
      showAddAlert: false,
      searchTerm: '',
      isLoading: true,
      allAlerts: [],
      currentPage: 1,
      itemsPerPage: 5,
      sortKey: '',
      sortOrder: 1,
      alertsRepository: new AlertsRepository(),
      callRepository: new CallsRepository(),

      idRelatedCall: null,

    };
  },
  computed: {
    ...mapState(useCounterStore, ['alerts', 'getCallByAlertId']),
    filteredAlerts() {
      if (!this.selectedDate) return [];
      return this.allAlerts.filter(alert => {
        const alertDate = new Date(alert.date);
        return (
          alertDate.getDate() === this.selectedDate.getDate() &&
          alertDate.getMonth() === this.selectedDate.getMonth() &&
          alertDate.getFullYear() === this.selectedDate.getFullYear()
        );
      });
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
    calendarAttributes() {
      const groupedAlerts = this.groupAlertsByDate();
      return Object.entries(groupedAlerts).map(([dateString, alerts]) => ({
        dates: new Date(dateString),
        dot: this.getAlertTypeDotClass(alerts[0]),
      }));
    },
  },
  methods: {
    ...mapActions(useCounterStore, ['loadAlerts']),
    formatDate(date) {
      if (!date) return '';
      return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    formatTime(time) {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    },
    onDateSelect(date) {
      this.selectedDate = date.date;
      this.showAddAlert = false;
      this.currentPage = 1;
    },
    async selectAlert(alert) {
      if (this.selectedAlert === alert) {
        this.selectedAlert = null;
        this.idRelatedCall = null;
      } else {
        this.selectedAlert = alert;
        await this.firstRelatedCall();
      }
      this.showAddAlert = false;
    },
    toggleAddAlert() {
      this.showAddAlert = !this.showAddAlert;
      this.selectedAlert = null;
    },
    closeAddAlert() {
      this.showAddAlert = false;
      this.selectedAlert = null;
    },
    async handleAlertAdded(newAlert) {
      this.showAddAlert = false;
      await this.loadAlerts();
      this.allAlerts = this.alerts;
      this.allAlerts = this.processRecurringAlerts(this.allAlerts);
      useMessagesStore().pushMessageAction({ type: 'success', message: 'Alerta añadida correctamente' });
    },
    async handleAlertUpdated(updatedAlert) {
      this.showAddAlert = false;
      this.selectedAlert = null;
      await this.loadAlerts();
      this.allAlerts = this.alerts;
      this.allAlerts = this.processRecurringAlerts(this.allAlerts);
      useMessagesStore().pushMessageAction({ type: 'success', message: 'Alerta actualizada correctamente' });
    },
    groupAlertsByDate() {
      const grouped = {};
      this.allAlerts.forEach(alert => {
        const dateString = new Date(alert.date).toDateString();
        if (!grouped[dateString]) {
          grouped[dateString] = [alert];
        } else {
          grouped[dateString].push(alert);
        }
      });
      return grouped;
    },
    getPaginatedAlerts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedAlerts.slice(start, end);
    },
    getTotalPages() {
      return Math.ceil(this.filteredAlerts.length / this.itemsPerPage);
    },
    changePage(page) {
      if (page >= 1 && page <= this.getTotalPages()) {
        this.currentPage = page;
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
    getAlertTypeDotClass(alert) {
      const classes = {
        medication: 'bg-primary',
        special: 'bg-dark',
        emergency_followup: 'bg-danger',
        grief_process: 'bg-purple',
        hospital_discharge: 'bg-success',
        temporary_suspension: 'bg-info',
        return_home: 'bg-secondary',
        heat_wave: 'bg-warning',
        vaccinations: 'bg-teal'
      };
      return classes[alert.type] || 'bg-secondary';
    },
    processRecurringAlerts(alerts) {
      return alerts.flatMap(alert => {
        if (!alert.isRecurring || !alert.endDate || !alert.dayOfWeek) {
          return alert;
        }

        const startDate = new Date(alert.date);
        const endDate = new Date(alert.endDate);
        const dayNameToNumber = {
          'Sunday': 0,
          'Monday': 1,
          'Tuesday': 2,
          'Wednesday': 3,
          'Thursday': 4,
          'Friday': 5,
          'Saturday': 6
        };
        const daysOfWeek = alert.dayOfWeek ? alert.dayOfWeek.split(', ').map(day => dayNameToNumber[day]) : [];

        const recurringAlerts = [];
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
          if (daysOfWeek.length === 0 || daysOfWeek.includes(date.getDay())) {
            recurringAlerts.push({
              ...alert,
              date: date.toISOString().split('T')[0]
            });
          }
        }

        return recurringAlerts;
      });
    },
    async deleteAlert(alert) {
      if (confirm(`¿Estás seguro de que quieres eliminar esta alerta?`)) {
        try {
          await this.alertsRepository.deleteAlert(alert.id);
          this.allAlerts = this.allAlerts.filter(a => a.id !== alert.id);
          if (this.selectedAlert && this.selectedAlert.id === alert.id) {
            this.selectedAlert = null;
          }
          await this.loadAlerts();
          useMessagesStore().pushMessageAction({ type: 'success', message: 'Alerta eliminada correctamente' });
        } catch (error) {
          useMessagesStore().pushMessageAction({ type: 'error', message: 'Error al eliminar la alerta. Por favor, inténtelo de nuevo.' });
        }
      }
    },
    getAlertTypeBadgeClass(type) {
      return useCounterStore().getAlertTypeBadgeClass(type);
    },
    getAlertTypeLabel(type) {
      return useCounterStore().getAlertTypeLabel(type);
    },
    async firstRelatedCall() {
      const response = await this.callRepository.getCallByAlertId(this.selectedAlert.id);


      if (response.data === undefined || response.data.length === 0) {
        // console.log('No hay llamadas relacionadas' + response.data);
        return
      }
      // console.log(response.data.length)
      this.idRelatedCall = response.data[0].callId;
    },
  },
  async mounted() {
    if (this.alerts.length === 0) {
      await this.loadAlerts();
    }
    this.allAlerts = this.alerts;
    this.allAlerts = this.processRecurringAlerts(this.allAlerts);
    this.isLoading = false;
  },
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
</style>