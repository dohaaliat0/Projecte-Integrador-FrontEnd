<script>
import AppFooter from '@/components/views/AppFooter.vue'
import AppMenu from '@/components/utils/AppMenu.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    AppMenu,
    AppFooter,
  }
})
</script>

<template>
  <header>
    <h1>ConectaSalud</h1>
  </header>

  <AppMenu></AppMenu>
  <AppFooter></AppFooter>
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
</style>
