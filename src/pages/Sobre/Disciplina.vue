<template>
  <q-page class="column full-width text-center">
    <div class="text-h6 q-my-md">Sobre a Disciplina</div>
    <div
      class="q-my-lg q-pa-sm shadow-2 text-justify"
      style="border-radius: 20px"
    >
      Conceitos gerais da instrumentação eletrônica, grandezas físicas e
      elétricas, sensores e transdutores, circuitos de condicionamento do sinal,
      amplificadores e filtros, conversores digital/analógico, conversores
      analógico/digital, tratamento e análise de dados.
      <br /><br />
      Noções de exatidão, precisão e resolução, noções de padrão, aferição e
      calibração, tratamento de erros em medidas, técnicas de redução de ruídos,
      instrumentos de bancada, interfaceamento digital, interfaces seriais,
      interfaces sem fio.
    </div>
    <div class="column full-width items-center q-gutter-y-sm">
      <q-btn
        outline
        rounded
        style="width: 100%"
        color="primary"
        label="Engenharia Elétrica"
        @click="openLink('https://www.eletrica.ufpr.br/')"
      />
      <q-btn
        outline
        rounded
        style="width: 100%"
        color="primary"
        label="Orientador"
        @click="
          openLink('https://www.eletrica.ufpr.br/p/professores:cunha:inicial')
        "
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "Disciplina",
  methods: {
    openLink(link) {
      window.open(link, "_system");
    },
  },
});
</script>

<style></style>
