<template>
  <div v-if="show" class="modal-wrapper">
    <div class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title font-weight-bold">
              {{ title }}
            </h5>
            <button
                type="button"
                class="close"
                @click="handleCancel"
                aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body pt-2">
            <div class="d-flex align-items-center">
              <div
                  class="alert-icon mr-3 rounded-circle d-flex align-items-center justify-content-center"
                  :class="iconColorClass"
              >
                <i :class="['fas', iconClass, 'fa-lg', 'text-white']"></i>
              </div>
              <p class="mb-0">{{ message }}</p>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button
                type="button"
                class="btn btn-light"
                @click="handleCancel"
            >
              {{ cancelText }}
            </button>
            <button
                type="button"
                :class="['btn', confirmButtonClass]"
                @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDialog',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirmar acción'
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'danger',
      validator: (value) => ['danger', 'warning', 'info', 'success'].includes(value)
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    cancelText: {
      type: String,
      default: 'Cancelar'
    }
  },

  computed: {
    iconClass() {
      const icons = {
        danger: 'fa-exclamation-triangle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        success: 'fa-check-circle'
      }
      return icons[this.type]
    },

    iconColorClass() {
      const colors = {
        danger: 'bg-danger',
        warning: 'bg-warning',
        info: 'bg-info',
        success: 'bg-success'
      }
      return colors[this.type]
    },

    confirmButtonClass() {
      const buttons = {
        danger: 'btn-danger',
        warning: 'btn-warning',
        info: 'btn-info',
        success: 'btn-success'
      }
      return buttons[this.type]
    }
  },

  methods: {
    handleConfirm() {
      this.$emit('confirm')
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  overflow-x: hidden;
  overflow-y: auto;
}

.modal {
  z-index: 1055;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}

.alert-icon {
  width: 48px;
  height: 48px;
}

.modal-content {
  border-radius: 15px;
}

.btn {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border-radius: 8px;
}

.btn-light {
  background-color: #f8f9fa;
  border-color: #f8f9fa;
}

.btn-light:hover {
  background-color: #e2e6ea;
  border-color: #dae0e5;
}

/* Animaciones */
.modal.fade.show {
  animation: fadeIn 0.2s ease-in-out;
}

.modal-backdrop.fade.show {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>