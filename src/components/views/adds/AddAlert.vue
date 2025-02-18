<template>
  <div class="card h-100">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="card-title mb-0">{{ editingAlert ? 'Editar Alerta' : 'Nueva Alerta' }}</h5>
      <button
        @click="$emit('close')"
        class="btn btn-sm btn-link"
        style="color: red; font-size: 1.2rem"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
        <div class="mb-3">
          <label for="title" class="form-label">Título *</label>
          <input v-model="form.title" type="text" class="form-control" id="title" required />
        </div>

        <div class="mb-3">
          <label for="type" class="form-label">Tipo de Alerta *</label>
          <select v-model="form.type" class="form-select" id="type" style="width: 100%" required>
            <option value="">Seleccionar tipo</option>
            <option v-for="(label, value) in alertTypes" :key="value" :value="value">
              {{ label }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label for="operatorId" class="form-label">Operador *</label>
          <SearchableSelect
            v-model="form.operatorId"
            :options="operators"
            placeholder="Seleccionar operador"
            required
          />
        </div>

        <div class="mb-3">
          <label for="patientId" class="form-label">Paciente</label>
          <SearchableSelect
            v-model="form.patientId"
            :options="patients"
            placeholder="Seleccionar paciente"
          />
        </div>

        <div class="mb-3">
          <label for="zoneId" class="form-label">Zona</label>
          <SearchableSelect
            v-model="form.zoneId"
            :options="zones"
            placeholder="Seleccionar zona"
          />
        </div>

        <div class="row mb-3">
          <div class="col">
            <label for="date" class="form-label">Fecha *</label>
            <input v-model="form.date" type="date" class="form-control" id="date" required />
          </div>
          <div class="col">
            <label for="time" class="form-label">Hora *</label>
            <input v-model="form.time" type="time" class="form-control" id="time" required />
          </div>
        </div>

        <div class="mb-3">
          <div class="form-check form-switch">
            <input
              v-model="form.isRecurring"
              class="form-check-input"
              type="checkbox"
              id="isRecurring"
            />
            <label class="form-check-label" for="isRecurring">Alerta recurrente</label>
          </div>
        </div>

        <div v-if="form.isRecurring" class="mb-3">
          <label for="endDate" class="form-label">Fecha de finalización *</label>
          <input
            v-model="form.endDate"
            type="date"
            class="form-control"
            id="endDate"
            :required="form.isRecurring"
          />
        </div>

        <div v-if="form.isRecurring" class="mb-3">
          <label for="dayOfWeek" class="form-label">Días de la semana *</label>
          <div class="d-flex flex-wrap gap-2">
            <div v-for="day in weekDays" :key="day.value" class="form-check">
              <input
                type="checkbox"
                class="form-check-input"
                :id="day.value"
                v-model="selectedDays"
                :value="day.value"
                :required="form.isRecurring && selectedDays.length === 0"
              />
              <label class="form-check-label" :for="day.value">{{ day.label }}</label>
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label for="description" class="form-label">Descripción *</label>
          <textarea
            v-model="form.description"
            class="form-control"
            id="description"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-outline-secondary" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">
            {{ editingAlert ? 'Actualizar Alerta' : 'Crear Alerta' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AlertsRepository from '@/repositories/alerts.repository.js'
import { mapActions, mapState } from 'pinia'
import { useCounterStore } from '@/stores/index.js'
import { useAuthStore } from '@/stores/auth.js'
import { useMessagesStore } from '@/stores/messages.js'
import SearchableSelect from '@/components/utils/SearchableSelect.vue'

export default {
  components: {
    SearchableSelect
  },
  props: {
    editingAlert: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapState(useCounterStore, ['patients', 'operators', 'zones']),
    ...mapState(useAuthStore, ['user']),
    dayOfWeek() {
      return this.selectedDays.join(', ')
    }
  },

  data() {
    return {
      form: {
        title: '',
        type: '',
        operatorId: null,
        patientId: null,
        zoneId: null,
        isActive: 1,
        date: '',
        time: '',
        isRecurring: false,
        endDate: null,
        dayOfWeek: null,
        description: ''
      },
      selectedDays: [],
      weekDays: [
        { value: 'Monday', label: 'Lunes' },
        { value: 'Tuesday', label: 'Martes' },
        { value: 'Wednesday', label: 'Miércoles' },
        { value: 'Thursday', label: 'Jueves' },
        { value: 'Friday', label: 'Viernes' },
        { value: 'Saturday', label: 'Sábado' },
        { value: 'Sunday', label: 'Domingo' }
      ],
      alertTypes: {
        medication: 'Alerta de medicación',
        special: 'Alerta especial',
        emergency_followup: 'Seguimiento de emergencia',
        grief_process: 'Seguimiento proceso de duelo',
        hospital_discharge: 'Seguimiento alta hospitalaria',
        temporary_suspension: 'Suspensión temporal del servicio',
        return_home: 'Retorno a domicilio',
        heat_wave: 'Alerta ola de calor',
        vaccinations: 'Vacunaciones preventivas'
      }
    }
  },

  watch: {
    selectedDays: {
      handler(newDays) {
        this.form.dayOfWeek = newDays.join(', ')
      },
      deep: true
    },
    editingAlert: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = { ...newVal };
          this.form.isRecurring = newVal.isRecurring === 1;
          this.selectedDays = newVal.dayOfWeek ? newVal.dayOfWeek.split(', ') : [];
          this.form.date = this.formatDate(newVal.date);
          this.form.time = this.formatTime(newVal.time);
        } else {
          this.resetForm();
        }
      }
    }
  },

  methods: {
    ...mapActions(useCounterStore, ['loadPatients', 'loadOperators', 'loadZones']),

    async handleSubmit() {
      try {
        const repositoryAlerts = new AlertsRepository()
        const alertData = {
          ...this.form,
          isActive: 1,
          dayOfWeek: this.form.isRecurring ? this.dayOfWeek : null,
          endDate: this.form.isRecurring ? this.form.endDate : null
        }

        let response;
        if (this.editingAlert) {
          console.log(alertData)
          response = await repositoryAlerts.changeCall(alertData);
          this.$emit('alert-updated', response.data);
        } else {
          response = await repositoryAlerts.addAlert(alertData);
          this.$emit('alert-added', response.data);
        }

        this.$emit('close');
      } catch (error) {
        useMessagesStore().pushMessageAction({ type: 'error', message: 'Error al guardar la alerta. Por favor, inténtelo de nuevo.' });
      }
    },

    resetForm() {
      this.form = {
        title: '',
        type: '',
        operatorId: null,
        patientId: null,
        zoneId: null,
        isActive: 1,
        date: '',
        time: '',
        isRecurring: false,
        endDate: null,
        dayOfWeek: null,
        description: ''
      };
      this.selectedDays = [];
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },

    formatTime(timeString) {
      if (!timeString) return '';
      return timeString.substring(0, 5);
    }
  },

  async mounted() {
    if (this.patients.length === 0) {
      await this.loadPatients()
    }
    if (this.operators.length === 0) {
      await this.loadOperators()
    }
    if (this.zones.length === 0) {
      await this.loadZones()
    }

    this.form.operatorId = this.user.id
  }
}
</script>

<style scoped>
.form-label {
  font-weight: 500;
  color: #344767;
}

.form-control,
.form-select {
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
  padding: 0.5rem 1rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn {
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
}

.form-check {
  margin-right: 1rem;
}

.form-check-input:checked {
  background-color: #007bff;
  border-color: #007bff;
}

.card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  background-color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.btn-link {
  color: inherit;
  text-decoration: none;
}

.btn-link:hover {
  color: inherit;
  text-decoration: none;
}
</style>