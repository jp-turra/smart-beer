<template>
  <q-page class="flex justify-center">
    <div class="text-primary text-center text-bold text-h3 full-width" style="padding-top: 60px">
      Smart Beer
    </div>
    <div class="column items-center" style="width: 75%">
      <q-btn class="full-width" color="primary" label="Conectar Dispositivo"/>
      <q-btn class="full-width q-my-sm" outline color="primary" label="Sobre o Projeto" @click="$router.push('/projeto')"/>
      <q-btn class="full-width" outline color="primary" label="Sobre a Disciplina" @click="$router.push('/disciplina')"/>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex'
})
</script>
