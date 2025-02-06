<template>
  <div class="report-container">
    <div class="container py-5">
      <h1 class="add-patient-title text-center mb-5">Generación de Informes</h1>

      <div class="card report-form">
        <div class="card-body">
          <form @submit.prevent="generateReport">
            <div class="form-group">
              <label for="report-type">Tipo de Informe</label>
              <select id="report-type" v-model="selectedReport" class="form-control custom-select">
                <option value="emergencies">Actuaciones por emergencias</option>
                <option value="patients">Listado de pacientes</option>
                <option value="scheduled-calls">Llamadas previstas</option>
                <option value="completed-calls">Llamadas realizadas</option>
                <option value="call-history">Histórico de llamadas por beneficiario</option>
              </select>
            </div>

            <div class="form-group">
              <label for="date">Fecha</label>
              <input id="date" v-model="filters.date" type="date" class="form-control">
            </div>

            <div class="form-group">
              <label for="type">Tipo</label>
              <input id="type" v-model="filters.type" type="text" class="form-control">
            </div>

            <div class="form-group">
              <label for="zone">Zona</label>
              <input id="zone" v-model="filters.zone" type="text" class="form-control">
            </div>

            <button type="submit" class="btn btn-primary btn-block generate-btn" :disabled="isLoading">
              <span class="btn-text">{{ isLoading ? 'Generando...' : 'Generar Informe' }}</span>
              <span class="btn-icon">
                <i class="fas fa-file-alt"></i>
              </span>
            </button>
          </form>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger mt-4" role="alert">
        <strong>Error!</strong> {{ error }}
      </div>

      <div v-if="reportUrl" class="text-center mt-4">
        <a :href="reportUrl" target="_blank" class="btn btn-success download-btn">
          <span class="btn-text">Descargar Informe</span>
          <span class="btn-icon">
            <i class="fas fa-download"></i>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import ReportsRepository from '@/repositories/reports.repository.js'

export default {
  name: 'ReportView',
  data() {
    return {
      selectedReport: 'emergencies',
      filters: {
        date: '',
        type: '',
        zone: ''
      },
      isLoading: false,
      error: null,
      reportUrl: null
    }
  },
  methods: {
    async generateReport() {
      try {
        const reportsRepository = new ReportsRepository();
        const response = await reportsRepository.generateReport(this.selectedReport, this.filters);
        this.reportUrl = URL.createObjectURL(response);
      } catch (error) {
        this.error = error.toString();
      }
    }
  },
  mounted() {
    console.log('Componente de informes montado')
  }
}
</script>

<style scoped>
.report-container {
  min-height: 100vh;
  padding: 2rem 0;
}

.add-patient-title {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.report-form {
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.report-form:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.form-group label {
  font-weight: 600;
  color: #34495e;
}

.form-control {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
}

.generate-btn, .download-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  font-weight: 600;
}

.generate-btn {
  background-color: #3498db;
  border-color: #3498db;
}

.download-btn {
  background-color: #2ecc71;
  border-color: #2ecc71;
  animation: pulse 2s infinite;
}

.generate-btn:hover, .download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-icon {
  margin-left: 8px;
}

.generate-btn::after, .download-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: all 0.5s ease;
}

.generate-btn:hover::after, .download-btn:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(46, 204, 113, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
  }
}

.alert {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.alert, .download-btn {
  animation: fadeIn 0.5s ease-out;
}
</style>