import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from '@/stores/auth';
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const authStore = useAuthStore();
authStore.initializeAuth();


window.Pusher = Pusher;

console.log('pusherKey', pusherKey);
console.log('pusherCluster', pusherCluster);

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: pusherKey,
    cluster: pusherCluster,
    forceTLS: true,
    // auth: {
    //     headers: {
    //         Authorization: `Bearer ${authStore.token}`
    //     }
    // }
});


app.mount('#app');
