<template>
  <div class="container-fluid py-4">
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
              placeholder="Buscar pacientes por nombre, email o teléfono"
              style="border-left: none; box-shadow: none;"
            >
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="patient in filteredPatients" :key="patient.id">
        <div
          class="card h-100 shadow-sm cursor-pointer patient-card"
          @click="$router.push('/patient/' + patient.id)"
        >
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div
                class="rounded-circle d-flex align-items-center justify-content-center mr-3 bg-primary"
                style="width: 50px; height: 50px;"
              >
                <span class="text-white font-weight-bold">{{ patient.fullName.charAt(0) }}</span>
              </div>
              <div class="flex-grow-1">
                <h5 class="card-title mb-0">{{ patient.fullName }}</h5>
                <p class="card-text text-muted small mb-0">{{ calculateAge(patient.birthDate) }} años</p>
              </div>
            </div>

            <div class="border-top pt-3">
              <p class="card-text mb-2 d-flex align-items-center">
                <i class="fas fa-phone-alt text-primary mr-2"></i>
                <span class="text-muted">{{ patient.phone }}</span>
              </p>
              <p class="card-text d-flex align-items-center mb-0">
                <i class="fas fa-envelope text-primary mr-2"></i>
                <span class="text-muted">{{ patient.email }}</span>
              </p>
            </div>

            <div class="position-absolute" style="right: 10px; bottom: 10px">
              <button
                @click.stop="$router.push('/patients/edit/' + patient.id)"
                class="btn btn-light btn-sm mr-2"
                title="Editar"
              >
                <i class="fas fa-edit text-primary"></i>
              </button>
              <button
                @click.stop="deletePatient(patient)"
                class="btn btn-light btn-sm"
                title="Eliminar"
              >
                <i class="fas fa-trash-alt text-danger"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredPatients.length === 0" class="text-center mt-5">
      <div class="text-muted">
        <i class="fas fa-search fa-3x mb-3"></i>
        <h4>No se encontraron pacientes</h4>
        <p>Intenta con otros términos de búsqueda</p>
      </div>
    </div>

    <ConfirmDialog
      :show="showDeleteDialog"
      title="Eliminar Paciente"
      :message="deleteMessage"
      type="danger"
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useCounterStore } from '@/stores/index.js'
import PatientsRepository from '@/repositories/patients.repository.js'
import ConfirmDialog from "/src/components/utils/ConfirmDialog.vue";

export default {
  components: {
    ConfirmDialog
  },
  data() {
    return {
      searchTerm: '',
      showDeleteDialog: false,
      patientToDelete: null,
      isLoading: false
    }
  },
  computed: {
    ...mapState(useCounterStore, ['patients']),
    filteredPatients() {
      const searchTermLower = this.searchTerm.toLowerCase().trim()
      return this.patients.filter(patient =>
        patient.fullName.toLowerCase().includes(searchTermLower) ||
        patient.email.toLowerCase().includes(searchTermLower) ||
        patient.phone.includes(searchTermLower)
      )
    },
    deleteMessage() {
      if (!this.patientToDelete) return ''
      return `¿Está seguro que desea eliminar al paciente ${this.patientToDelete.fullName}?`
    }
  },
  async mounted() {
    try {
      this.isLoading = true
      if (this.patients.length === 0) {
        await this.loadPatients()
      }
    } catch (error) {
      console.error('Error al cargar los pacientes:', error)
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    ...mapActions(useCounterStore, ['loadPatients']),

    deletePatient(patient) {
      this.patientToDelete = patient
      this.showDeleteDialog = true
    },

    async confirmDelete() {
      try {
        this.isLoading = true
        const repositoryPatients = new PatientsRepository()
        await repositoryPatients.removePatient(this.patientToDelete.id)
        await this.loadPatients()
        this.$emit('patient-deleted', this.patientToDelete.id)
      } catch (error) {
        console.error('Error al eliminar el paciente:', error)
      } finally {
        this.isLoading = false
        this.showDeleteDialog = false
        this.patientToDelete = null
      }
    },

    cancelDelete() {
      this.showDeleteDialog = false
      this.patientToDelete = null
    },

    handleSearchInput() {
      this.searchTerm = this.searchTerm.trim()
    },

    calculateAge(birthDate) {
      const today = new Date()
      const birthDateObj = new Date(birthDate)
      let age = today.getFullYear() - birthDateObj.getFullYear()
      const monthDiff = today.getMonth() - birthDateObj.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--
      }

      return age
    }
  },

  beforeDestroy() {
    this.showDeleteDialog = false
    this.patientToDelete = null
  }
}
</script>

<style scoped>
.patient-card {
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.patient-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.patient-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #007bff, #6610f2);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.patient-card:hover::after {
  transform: scaleX(1);
}

/* Estilos para el buscador */
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

/* Estilos para los botones */
.btn-light {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  backdrop-filter: blur(5px);
}

.btn-light:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Estilos para los badges */
.badge {
  font-weight: 500;
  font-size: 0.85em;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.row > div {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }

  .badge {
    font-size: 0.75em;
  }
}

/* Loading states */
.patient-card.loading {
  pointer-events: none;
  opacity: 0.7;
}

/* Empty state */
.text-muted i {
  opacity: 0.5;
}
</style>