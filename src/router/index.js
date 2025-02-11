import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import AppAbout from '../components/views/AppAbout.vue'
import Login from "@/components/views/Login.vue";
import PatientsView from "@/components/views/lists/PatientsView.vue";
import CallsView from "@/components/views/lists/CallsView.vue";
import PatientView from "@/components/views/items/PatientView.vue";
import ReportsView from '@/components/views/lists/ReportsView.vue'
import AddPatient from '@/components/views/adds/AddPatient.vue'
import CalendarView from '@/components/views/items/CalendarView.vue'
import AlertsView from '@/components/views/lists/AlertsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppAbout,
    },
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
      component: PatientsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/patient/:id',
      name: 'patient',
      component: PatientView,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/patients/add',
      name: 'patientsAdd',
      component: AddPatient,
      meta: { requiresAuth: true }
    },
    {
      path: '/patients/edit/:id',
      name: 'patientsEdit',
      component: AddPatient,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/calls',
      name: 'calls',
      component: CallsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/calls/patient/:idPatient',
      name: 'callsPatient',
      component: CallsView,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/calls/patient/:idPatient/type/:typeCall',
      name: 'callsPatientAndType',
      component: CallsView,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: AlertsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/alerts/patient/:idPatient',
      name: 'alertsPatient',
      component: AlertsView,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresAuth: true }
    },
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;
  const publicRoutes = ['/', '/about', '/login'];

  if (!isAuthenticated && !publicRoutes.includes(to.path)) {
    next('/login');
  }
  else if (isAuthenticated && to.path === '/login') {
  }
  else {
    next();
  }
});

export default router;
