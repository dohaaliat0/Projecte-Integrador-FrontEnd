<template>
  <div class="searchable-select">
    <div class="select-container" @click="toggleDropdown" ref="selectEl">
      <div class="selected-value form-control" :class="{ 'is-invalid': invalid }">
        {{ selectedText }}
      </div>
    </div>

    <div v-if="isOpen" class="select-dropdown" ref="dropdownEl">
      <div class="search-container">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Buscar..."
          @click.stop
          ref="searchInput"
        >
      </div>
      <div class="options-container">
        <div
          v-for="option in filteredOptions"
          :key="option.id"
          class="option"
          :class="{ 'selected': option.id === modelValue }"
          @click="selectOption(option)"
        >
          {{ getOptionText(option) }}
        </div>
        <div v-if="filteredOptions.length === 0" class="no-results">
          No se encontraron resultados
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchableSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Seleccionar'
    },
    invalid: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
      searchQuery: '',
    }
  },
  computed: {
    filteredOptions() {
      return this.options.filter(option =>
        this.getOptionText(option).toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    selectedText() {
      if (!this.modelValue) return this.placeholder
      const selected = this.options.find(option => option.id === this.modelValue)
      return selected ? this.getOptionText(selected) : this.placeholder
    }
  },
  methods: {
    getOptionText(option) {
      return option.title || option.fullName || option.name || ''
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.$nextTick(() => {
          this.$refs.searchInput?.focus()
        })
      } else {
        this.searchQuery = ''
      }
    },
    selectOption(option) {
      this.$emit('update:modelValue', option.id)
      this.isOpen = false
      this.searchQuery = ''
    },
    handleClickOutside(event) {
      if (this.$refs.dropdownEl && !this.$refs.dropdownEl.contains(event.target) &&
        this.$refs.selectEl && !this.$refs.selectEl.contains(event.target)) {
        this.isOpen = false
        this.searchQuery = ''
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.searchable-select {
  position: relative;
  width: 100%;
}

.select-container {
  cursor: pointer;
}

.selected-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 30px;
  position: relative;
  background-color: #fff;
  cursor: pointer;
  user-select: none;
}

.selected-value::after {
  content: '';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #6c757d;
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  z-index: 9999;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-height: 300px;
  display: flex;
  flex-direction: column;
}

.search-container {
  padding: 8px;
  border-bottom: 1px solid #dee2e6;
  background: white;
  position: sticky;
  top: 0;
  z-index: inherit;
}

.search-container .form-control {
  padding: 4px 8px;
  font-size: 0.9em;
}

.options-container {
  overflow-y: auto;
  flex-grow: 1;
  max-height: 200px;
  z-index: inherit;
}

.option {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  z-index: inherit;
}

.option:hover {
  background-color: #f8f9fa;
}

.option.selected {
  background-color: #e9ecef;
  font-weight: 500;
}

.no-results {
  padding: 12px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

.options-container::-webkit-scrollbar {
  width: 8px;
}

.options-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.options-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.options-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
