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
                    :class="{ 'selected': modelValue.some(id => id === option.id) }"
                    @click="toggleSelection(option)"
                >
                    <input
                        type="checkbox"
                        :checked="modelValue.some(id => id === option.id)"
                        class="mr-2"
                    />
                    {{ option.name }}
                </div>
                <div v-if="filteredOptions.length === 0" class="no-results">
                    No se encontraron resultados
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useCounterStore } from '@/stores/index.js';

export default {
    name: 'LanguagesSelect',
    props: {
        modelValue: {
            type: Array,
            default: () => []
        },
        placeholder: {
            type: String,
            default: 'Seleccionar idiomas'
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
        };
    },
    computed: {
        ...mapState(useCounterStore, ['languages']),
        selectedText() {
            if (this.modelValue.length === 0) return this.placeholder;
            return this.modelValue.map(id => {
                const option = this.languages.find(opt => opt.id === id);
                return option ? option.name : '';
            }).join(', ');
        },
        filteredOptions() {
            return this.languages.filter(option =>
                option.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.$nextTick(() => {
                    this.$refs.searchInput?.focus();
                });
            } else {
                this.searchQuery = '';
            }
        },
        toggleSelection(option) {
            if (this.modelValue.includes(option.id)) {
                this.$emit('update:modelValue', this.modelValue.filter(id => id !== option.id));
            } else {
                this.$emit('update:modelValue', [...this.modelValue, option.id]);
            }
        },
        handleClickOutside(event) {
            if (this.$refs.dropdownEl && !this.$refs.dropdownEl.contains(event.target) &&
                this.$refs.selectEl && !this.$refs.selectEl.contains(event.target)) {
                this.isOpen = false;
                this.searchQuery = '';
            }
        },
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }
};
</script>

<style scoped>

    .searchable-select {
        position: relative;
        width: 100%;
    }

    .select-container {
        cursor: pointer;
        position: relative;
    }

    .selected-value {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        display: flex;
        align-items: center;
    }

    .select-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .search-container {
        padding: 8px;
        border-bottom: 1px solid #ccc;
    }

    .options-container {
        padding: 8px;
    }

    .option {
        padding: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .option.selected {
        background-color: #007bff;
        color: white;
    }

    .option input[type="checkbox"] {
        display: none;
    }

    .no-results {
        padding: 8px;
        color: #999;
    }

</style>
