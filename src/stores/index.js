import { defineStore } from 'pinia'
import PatientsRepository from "@/repositories/patients.repository.js";
import CallsRepository from "@/repositories/calls.repository.js";
import OperatorsRepository from '@/repositories/operators.repository.js'
import ZonesRepository from '@/repositories/zones.repository.js'
import LanguagesRepository from '@/repositories/languages.repository.js'
import AlertsRepository from '@/repositories/alerts.repository.js'
import RelationshipsRepository from '@/repositories/relationships.repository.js'

export const useCounterStore = defineStore("counter", {
  state(){
    return{
      patients: [],
      calls: [],
      operators: [],
      zones: [],
      languages: [],
      alerts: [],
      relationships: [],
    }
  },

  getters: {
    getPatientById: (state) => (id) => state.patients.find((item) => item.id == id),
    getZoneName: (state) => (id) => state.zones.find((item) => item.id == id)?.name,
    getCallByAlertId: (state) => (alertId) => state.calls.find((call) => call.outgoingCall?.alert?.id === Number(alertId))?.outgoingCall?.callId,
  },

  actions: {
    async loadCalls() {
      const repositoryModules = new CallsRepository();
      const response = await repositoryModules.getAllCalls();
      this.calls = response.data
    },
    async loadCallsByPatient(idPatient) {
      const repositoryModules = new CallsRepository();
      const response = await repositoryModules.getAllCallsByPatient(idPatient);
      return response.data
    },
    async loadPatients(filter = '') {
      const repositoryModules = new PatientsRepository();
      const response = await repositoryModules.getAllPatients(filter);
      this.patients = response.data
    },
    async loadOperators() {
      const repositoryOperators = new OperatorsRepository();
      const response = await repositoryOperators.getAllOperators();
      this.operators = response.data
    },
    async loadZones() {
      const repositoryZones = new ZonesRepository();
      const response = await repositoryZones.getAllZones();
      this.zones = response.data
    },
    async loadLanguages() {
      const repositoryLanguages = new LanguagesRepository();
      const response = await repositoryLanguages.getAllLanguages();
      this.languages = response.data
    },
    async loadAlerts() {
      const repositoryAlerts = new AlertsRepository();
      const response = await repositoryAlerts.getAllAlerts();
      this.alerts = response.data
    },
    async loadRelationships() {
      const repositoryModules = new RelationshipsRepository();
      const response = await repositoryModules.getAllRelationships();
      this.relationships = response.data
    },
    getCallTypeLabel(call) {
      if (call.incomingCall !== null) {
        switch (call.incomingCall.type) {
          case 'Social Emergencies': return 'Emergencias Sociales';
          case 'Health Emergencies': return 'Emergencias de Salud';
          case 'Loneliness or Distress Crisis': return 'Crisis de Soledad o Angustia';
          case 'Unanswered Alarm': return 'Alarma No Respondida';
          case 'Notify Absences or Returns': return 'Notificar Ausencias o Regresos';
          case 'Modify Personal Data': return 'Modificar Datos Personales';
          case 'Accidental Calls': return 'Llamadas Accidentales';
          case 'Request Information': return 'Solicitar Información';
          case 'Suggestions, Complaints or Claims': return 'Sugerencias, Quejas o Reclamos';
          case 'Social Calls (to greet or talk with staff)': return 'Llamadas Sociales (para saludar o hablar con el personal)';
          case 'Register Medical Appointments from a Call': return 'Registrar Citas Médicas desde una Llamada';
          case 'Other Types of Calls': return 'Otros Tipos de Llamadas';
        }
      } else if (call.outgoingCall !== null) {
        switch (call.outgoingCall.type) {
          case 'Follow-up after notice or hospitalization': return 'Seguimiento después de aviso u hospitalización';
          case 'Check if person is okay': return 'Verificar si la persona está bien';
          case 'Follow-up on activated alarm': return 'Seguimiento de alarma activada';
          case 'General unexpected emergencies': return 'Emergencias generales inesperadas';
        }
      }
      return 'Desconocido';
    },
    getCallTypeBadgeClass(call) {
      if (call.incomingCall !== null) {
        return {
          'bg-danger': ['Social Emergencies', 'Health Emergencies', 'Loneliness or Distress Crisis', 'Unanswered Alarm'].includes(call.incomingCall.type),
          'bg-warning': ['Notify Absences or Returns', 'Modify Personal Data', 'Accidental Calls', 'Request Information'].includes(call.incomingCall.type),
          'bg-info': ['Suggestions, Complaints or Claims', 'Social Calls (to greet or talk with staff)', 'Register Medical Appointments from a Call', 'Other Types of Calls'].includes(call.incomingCall.type)
        };
      } else if (call.outgoingCall !== null) {
        return {
          'bg-primary': call.outgoingCall.type === 'Follow-up after notice or hospitalization',
          'bg-success': call.outgoingCall.type === 'Check if person is okay',
          'bg-danger': call.outgoingCall.type === 'Follow-up on activated alarm',
          'bg-warning': call.outgoingCall.type === 'General unexpected emergencies'
        };
      }
    },
    getAlertTypeBadgeClass(type) {
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
      }
      return classes[type] || 'bg-secondary'
    },

    getAlertTypeLabel(type) {
      const labels = {
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
      return labels[type] || type
    },
    formatRecurringDays(dayOfWeek) {
      if (!dayOfWeek) return '';
      const daysMap = {
        'Monday': 'Lunes',
        'Tuesday': 'Martes',
        'Wednesday': 'Miércoles',
        'Thursday': 'Jueves',
        'Friday': 'Viernes',
        'Saturday': 'Sábado',
        'Sunday': 'Domingo'
      };
      return dayOfWeek.split(', ')
        .map(day => daysMap[day] || day)
        .join(', ');
    },
  }
});