import { createRouter, createWebHistory } from 'vue-router'
import AppAbout from '../components/views/AppAbout.vue'
import Login from "@/components/views/Login.vue";
import PatientsView from "@/components/views/PatientsView.vue";
import CallDashboard from "@/components/views/CallDashboard.vue";
import PatientView from "@/components/views/PatientView.vue";
import ReportView from '@/components/views/ReportView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/about',
      name: 'about',
      component: AppAbout
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/patients',
      name: 'patients',
      component: PatientsView
    },
    {
      path: '/patient/:id',
      name: 'patient',
      component: PatientView,
      props: true,
    },
    {
      path: '/patients/edit/:id',
      name: 'patientsEdit',
      component: PatientsView,
      props: true
    },
    {
      path: '/call-management',
      name: 'call-management',
      component: CallDashboard
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportView
    },
  ]
});

export default router