<template>
  <q-page class="column full-width text-center">
    <div class="column text-primary q-my-lg q-gutter-y-sm items-center">
      <span class="text-h5">{{ device.name }}</span>
      <q-btn
        outline
        dense
        style="max-width: 150px"
        size="10px"
        color="primary"
        label="desconectar"
        @click="desconectar"
      />
    </div>
    <div
      class="q-my-lg full-width shadow-4 column q-py-sm"
      style="border-radius: 20px"
    >
      <div class="q-mb-md text-bold">
        <span>Temperatura</span> <br />
        <span style="font-size: 0.8rem">{{ data }}</span>
      </div>
      <span>{{ temperatura ? temperatura : 21 }}ºC</span>
      <div class="full-width text-center q-mt-sm">
        <q-btn
          flat
          dense
          class="full-width"
          color="primary"
          icon="refresh"
          @click="btService.sendData(this.device, 'get|')"
        />
      </div>
    </div>
    <div class="q-my-lg">
      <q-input
        v-model="dado.temperatura"
        type="number"
        label="Definir limite de temperatura:"
      />
      <!-- <q-input
        v-model="dado.tempo"
        type="number"
        label="Definir tempo de atuação:"
      /> -->
    </div>
    <div>
      <q-btn
        rounded
        class="full-width"
        :disable="!dado"
        color="positive"
        label="Enviar"
        @click="enviarComando"
      />
    </div>
    <div>
      <q-btn
        rounded
        class="full-width q-mt-md"
        color="primary"
        label="Pré Definição"
        @click="openDialog"
      />
    </div>
    <div>
      <q-btn
        rounded
        dense
        outline
        class="full-width q-mt-md"
        color="primary"
        label="Histórico"
        @click="openDialogHistorico"
      />
    </div>
    <q-dialog v-model="modal" persistent full-width>
      <q-card>
        <q-card-section
          class="row items-center"
          @click="utilizarReceita(40, 40)"
        >
          <div class="col-8">
            <div>Receita 1</div>
            <div>Temperatura: 40ºC</div>
            <div>Tempo: 40ºC</div>
          </div>
          <div class="col-4">
            <q-btn color="primary" label="Selecionar" />
          </div>
        </q-card-section>
        <q-separator color="primary" />
        <q-card-section
          class="row items-center"
          @click="utilizarReceita(20, 20)"
        >
          <div class="col-8">
            <div>Receita 2</div>
            <div>Temperatura: 20ºC</div>
            <div>Tempo: 20ºC</div>
          </div>
          <div class="col-4">
            <q-btn color="primary" label="Selecionar" />
          </div>
        </q-card-section>
        <q-separator color="primary" />
        <q-card-section
          class="row items-center"
          @click="utilizarReceita(30, 30)"
        >
          <div class="col-8">
            <div>Receita 3</div>
            <div>Temperatura: 30ºC</div>
            <div>Tempo: 30ºC</div>
          </div>
          <div class="col-4">
            <q-btn color="primary" label="Selecionar" />
          </div>
        </q-card-section>
        <q-separator color="primary" />
        <q-card-actions align="center">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { Loading, Notify } from "quasar";
import BluetoothService from "src/services/bluetooth";
import { defineComponent } from "vue";
import moment from "moment";
export default defineComponent({
  name: "Disciplina",
  data() {
    return {
      btService: new BluetoothService(this.$store),
      dado: {
        temperatura: 21,
        tempo: 0,
      },
      modal: false,
      interval: undefined,
      openDialogHistorico: false,
      data: "",
    };
  },
  created() {
    if (this.interval) clearInterval(this.interval);
    if (!this.device) {
      this.$router.push("/");
      return;
    }
    this.setupListener();
    this.interval = setInterval(() => {
      this.btService.sendData(this.device, "get|");
    }, 10000);
  },
  beforeUnmount() {
    if (this.interval) clearInterval(this.interval);
  },
  computed: {
    device() {
      return this.$store.getters.getDevice;
    },
    historico() {
      return this.$store.getters.getHistorico;
    },
    temperatura() {
      if (
        this.$store.getters.getLastMessage &&
        this.$store.getters.getLastMessage[0] == "T"
      ) {
        this.data = moment().format("DD/MM - HH:MM");
        return parseInt(this.$store.getters.getLastMessage.substring(1));
      }
    },
  },
  methods: {
    async enviarComando() {
      Loading.show({
        message: "Enviando comando...",
      });
      let cmd = `set&P${this.dado.temperatura}-${this.dado.tempo}`;
      if (cmd.indexOf("|") == -1 || cmd.indexOf("|") != cmd.length - 1)
        cmd += "|";
      const res = await this.btService.sendData(this.device, cmd);
      Notify.create({
        message:
          res == "OK"
            ? "Comando enviado com sucesso"
            : "Falha ao enviar o comando",
        type: res == "OK" ? "positive" : "warning",
      });
      Loading.hide();
    },
    setupListener() {
      this.btService.subscribe();
    },
    desconectar() {
      this.btService.disconnect();
      this.$router.push("/");
    },
    openDialog() {
      this.modal = true;
    },
    utilizarReceita(temperatura, tempo) {
      this.dado.temperatura = temperatura;
      this.dado.tempo = tempo;
      this.modal = false;
    },
  },
});
</script>

<style></style>
