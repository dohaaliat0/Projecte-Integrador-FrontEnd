<script>
import AppFooter from '@/components/views/AppFooter.vue'
import AppMenu from '@/components/views/items/AppMenu.vue'
import { defineComponent } from 'vue'
import StickyMessages from './components/utils/StickyMessages.vue';
import { useMessagesStore } from './stores/messages';

export default defineComponent({
  components: {
    AppMenu,
    AppFooter,
    StickyMessages,
  },
  mounted(){
    window.Echo.channel('ConectaSalud')
    .listen('.LlamadaActualizada', (e) => {
      console.log('Llamada actualizada', e)
      let message = '';
      if(e.call){
        message = `Llamada ${e.call.id} actualizada. Realizada en ${e.call.dateTime}`
      } 

      if(e.patient){
        message = `Paciente ${e.patient.id} actualizado: ${e.patient.name}`
      }

      if(e.alert){
        message = `Alerta ${e.alert.id} actualizada: ${e.alert.status}`
      }

      useMessagesStore().pushMessageAction({type: 'info', message: message})
    });
    console.log('Escuchando mensajes')
  }
})
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">ConectaSalud</h1>
      <AppMenu />
    </header>
    <StickyMessages />
    <main class="app-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

header {
  background-color: #333;
  color: #fff;
  padding: 20px;
  text-align: center;
}

h1 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.app-header {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
}

.app-title {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
  text-align: center;
  margin-bottom: 1rem;
}

.app-content {
  flex-grow: 1;
  padding: 2rem;
}

@media screen and (max-width: 600px) {
  .app-content{
    padding-left: 0;
    padding-right: 0;
  }
  
}
</style>
