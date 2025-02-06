<template>
  <div class="dashboard-container">
    <div class="row g-3">
      <div class="col-xl-4">
        <VCalendar
          style="width: 100%"
          :attributes="calendarAttributes"
          @dayclick="onDateSelect"
        />
        <div class="card mt-3" v-if="selectedCall.id">
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted">Añadir evento para {{ formatDate(selectedDate) }}</h6>
            <form @submit.prevent="addEvent">
              <div class="mb-3">
                <input v-model="newEvent.title" type="datetime-local" class="form-control" placeholder="Título del evento" required>
              </div>
              <div class="mb-3">
                <textarea v-model="newEvent.description" class="form-control" rows="3" placeholder="Descripción"></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Añadir Evento</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-xl-8">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Llamadas del {{ formatDate(selectedDate) }}</h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                <tr>
                  <th class="ps-4">#</th>
                  <th>Tipo</th>
                  <th>Paciente</th>
                  <th>Hora</th>
                  <th>Operador</th>
                  <th class="text-center">Estado</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="call in filteredCalls" :key="call.id" @click="selectCall(call)" class="call-row">
                  <td class="ps-4">{{ call.id }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <i :class="['fas', 'fa-phone-alt', call.incoming ? 'text-primary' : 'text-danger', 'me-2']" style="margin-right: 5px"></i>
                      {{ call.incoming ? 'Entrante' : 'Saliente' }}
                    </div>
                  </td>
                  <td>{{ call.patient.fullName }}</td>
                  <td>{{ formatTime(call.dateTime) }}</td>
                  <td>
                    <div class="d-flex align-items-center" v-if="call.operator">
                      {{ call.operator.name }}
                    </div>
                    <span v-else>-</span>
                  </td>
                  <td class="text-center">
                    <span class="badge rounded-pill" :class="getCallTypeBadgeClass(call)">
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
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useCounterStore } from '@/stores/index.js';
import { Calendar } from 'v-calendar';
import 'v-calendar/dist/style.css';

export default {
  components: {
    VCalendar: Calendar
  },
  data() {
    return {
      selectedDate: null,
      newEvent: {
        title: '',
        description: ''
      },
      selectedCall: {}
    };
  },
  computed: {
    ...mapState(useCounterStore, ['calls']),
    filteredCalls() {
      if (!this.selectedDate) return [];
      return this.calls.filter(call => {
        const callDate = new Date(call.dateTime);
        return (
          callDate.getDate() === this.selectedDate.getDate() &&
          callDate.getMonth() === this.selectedDate.getMonth() &&
          callDate.getFullYear() === this.selectedDate.getFullYear()
        );
      });
    },
    calendarAttributes() {
      const groupedCalls = this.groupCallsByDate();
      return Object.entries(groupedCalls).map(([dateString, calls]) => ({
        dates: new Date(dateString),
        dot: this.getCallTypeDotClass(calls[0])
      }));
    }
  },
  methods: {
    ...mapActions(useCounterStore, ['loadCalls', "getCallTypeLabel", "getCallTypeBadgeClass", "getCallTypeDotClass"]),
    formatDate(date) {
      if (!date) return '';
      return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    formatTime(dateTime) {
      return new Date(dateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    },
    onDateSelect(date) {
      this.selectedDate = date.date;
      this.newEvent = { title: '', description: '' };
    },
    selectCall(call) {
      this.selectedCall = call;
      console.log('Llamada seleccionada:', call);
    },
    addEvent() {
      console.log('Nuevo evento:', this.newEvent);
      this.newEvent = { title: '', description: '' };
    },
    groupCallsByDate() {
      const grouped = {};
      this.calls.forEach(call => {
        const dateString = new Date(call.dateTime).toDateString();
        if (!grouped[dateString]) {
          grouped[dateString] = [call];
        }
      });
      return grouped;
    }
  },
  async mounted() {
    if (this.calls.length === 0) {
      await this.loadCalls();
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

.col-xl-7, .col-xl-5 {
  animation: fadeIn 0.3s ease-out;
}

.row > div {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
