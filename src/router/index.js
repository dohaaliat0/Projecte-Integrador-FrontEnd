import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import AppAbout from '../components/views/AppAbout.vue'
import Login from "@/components/views/Login.vue";
import PatientsView from "@/components/views/PatientsView.vue";
import CallDashboard from "@/components/views/CallDashboard.vue";
import PatientView from "@/components/views/PatientView.vue";
import ReportView from '@/components/views/ReportView.vue'
import AddPatient from '@/components/utils/AddPatient.vue'
import CalendarView from '@/components/views/CalendarView.vue'

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
      path: '/call-management',
      name: 'call-management',
      component: CallDashboard,
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
      component: ReportView,
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
