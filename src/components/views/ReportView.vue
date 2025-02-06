<template>
  <div class="reports-page">
    <div class="container-fluid">
      <div class="row">
        <div :class="{'col-md-5': showPreview, 'col-md-12': !showPreview}">
          <div class="content-wrapper">
            <div class="header-section mb-4">
              <h1 class="report-title">Generación de Informes</h1>
              <p class="text-muted">Seleccione el tipo de informe y el rango de fechas</p>
            </div>

            <div class="card report-form">
              <div class="card-body">
                <form @submit.prevent="generateReport">
                  <div class="form-group mb-4">
                    <label class="form-label">
                      <i class="fas fa-file-alt me-2" style="margin-right: 5px"></i>
                      Tipo de Informe
                    </label>
                    <select
                      v-model="selectedReport"
                      class="form-select select-custom"
                    >
                      <option value="emergencies">Informe de Emergencias</option>
                      <option value="socials">Informe Social</option>
                      <option value="monitorings">Informe de Seguimientos</option>
                    </select>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group mb-4">
                        <label class="form-label">
                          <i class="fas fa-calendar me-2" style="margin-right: 5px"></i>
                          Fecha Inicio
                        </label>
                        <input
                          type="date"
                          v-model="dateRange.startDate"
                          class="form-control"
                        >
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group mb-4">
                        <label class="form-label">
                          <i class="fas fa-calendar-alt me-2" style="margin-right: 5px"></i>
                          Fecha Fin
                        </label>
                        <input
                          type="date"
                          v-model="dateRange.endDate"
                          class="form-control"
                        >
                      </div>
                    </div>
                  </div>

                  <div class="action-buttons">
                    <button
                      type="submit"
                      class="btn btn-primary btn-lg w-100"
                      :disabled="isLoading"
                    >
                      <div class="d-flex align-items-center justify-content-center">
                        <i class="fas fa-sync fa-spin me-2" v-if="isLoading" style="margin-right: 5px"></i>
                        <i class="fas fa-file-pdf me-2" v-else style="margin-right: 5px"></i>
                        {{ isLoading ? 'Generando...' : 'Generar Informe' }}
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div
              v-if="error"
              class="alert alert-danger mt-4 d-flex align-items-center"
              role="alert"
            >
              <i class="fas fa-exclamation-circle me-2"></i>
              <div>{{ error }}</div>
            </div>
          </div>
        </div>

        <div v-if="showPreview" class="col-md-7">
          <div class="preview-wrapper">
            <div class="preview-header">
              <h3 class="preview-title">Vista Previa del Informe</h3>
              <div class="preview-actions">
                <button
                  @click="handleDownload"
                  class="btn btn-success"
                  v-if="reportUrl"
                >
                  <i class="fas fa-download me-2"></i>
                  Descargar PDF
                </button>
              </div>
            </div>

            <div class="preview-container">
              <div v-if="isLoading" class="preview-loading">
                <div class="spinner-border text-primary" role="status"></div>
                <span class="visually-hidden" style="margin-left: 10px">Generando vista previa...</span>
              </div>

              <VuePdfEmbed
                v-if="reportUrl"
                :source="reportUrl"
                :page="1"
                :style="{ width: '100%', height: '100%' }"
                class="pdf-viewer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReportsRepository from '@/repositories/reports.repository'
import VuePdfEmbed from 'vue-pdf-embed'

export default {
  components: {
    VuePdfEmbed
  },
  data() {
    return {
      selectedReport: 'emergencies',
      dateRange: {
        startDate: '',
        endDate: ''
      },
      isLoading: false,
      error: null,
      reportUrl: null,
      errors: {}
    }
  },
  computed: {
    showPreview() {
      return this.isLoading || this.reportUrl
    }
  },
  methods: {
    async generateReport() {
      this.isLoading = true

      if (this.reportUrl) {
        URL.revokeObjectURL(this.reportUrl)
        this.reportUrl = null
      }

      try {
        const reportsRepository = new ReportsRepository()
        const response = await reportsRepository.getReport(
          this.selectedReport,
          this.dateRange.startDate,
          this.dateRange.endDate
        )
        console.log(response)
        this.reportUrl = URL.createObjectURL(response)
      } catch (e) {
        this.error = 'Error al generar el informe'
      } finally {
        this.isLoading = false
      }
    },
    handleDownload() {
      if (this.reportUrl) {
        const link = document.createElement('a')
        link.href = this.reportUrl
        link.download = `informe_${this.selectedReport}_${this.dateRange.startDate}_${this.dateRange.endDate}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }
}
</script>

<style scoped>
.reports-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.header-section {
  text-align: center;
}

.report-title {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.report-form {
  background: white;
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.report-form:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.form-control, .form-select {
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #fff;
}

.form-control:focus, .form-select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.select-custom {
  width: 100%;
  height: auto;
  padding-right: 2.5rem;
}

.action-buttons {
  margin-top: 2rem;
}

.btn {
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #3498db;
  border-color: #3498db;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
  border-color: #2980b9;
  transform: translateY(-2px);
}

.btn-success {
  background-color: #2ecc71;
  border-color: #2ecc71;
}

.preview-wrapper {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 4rem);
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.preview-container {
  flex: 1;
  position: relative;
  overflow: auto;
  border-radius: 0 0 16px 16px;
  background-color: #f8f9fa;
  padding: 2rem;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.pdf-viewer :deep(embed) {
  width: 100%;
  height: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.alert {
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .reports-page {
    padding: 1rem;
  }

  .preview-wrapper {
    margin-left: 0;
    margin-top: 1rem;
    height: 500px;
  }

  .report-title {
    font-size: 2rem;
  }

  .preview-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
