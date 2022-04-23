<template>
  <q-page class="column full-width text-center">
    <div
      v-if="procurandoDispositivo"
      class="full-width text-center fixed-center q-pa-lg q-gutter-y-md"
    >
      <span style="font-size: 1.2rem">
        Procurando por dispositivos, aguarde um instante...
      </span>
      <q-linear-progress
        :value="progress"
        indeterminate
        rounded
        color="primary"
        track-color="secondary"
      />
    </div>
    <div v-else class="full-width column">
      <span class="text-h5 text-primary q-my-lg">
        Dispositivos encontrados:
      </span>
      <q-list>
        <q-item class="full-width">
          <q-btn
            dense
            rounded
            class="full-width"
            color="primary"
            icon="refresh"
            label="Atualizar"
            @click="listarDispositivos"
          />
        </q-item>
        <q-item
          v-for="device in devices"
          :key="device.id"
          class="column shadow-1 q-my-sm text-center items-center"
          style="border-radius: 20px; min-height: 50px"
          @click="conectarDispositivo(device)"
          clickable
          v-ripple
        >
          <div class="text-bold">
            {{ device.name }} <span v-if="device.new"> - (Novo)</span>
          </div>
          <div>
            {{ device.id }}
          </div>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { Loading, Notify } from "quasar";
import BluetoothService from "src/services/bluetooth";
import { defineComponent } from "vue";
export default defineComponent({
  name: "Disciplina",
  data() {
    return {
      progress: 100,
      procurandoDispositivo: false,
      btService: new BluetoothService(this.$store),
      devices: [],
    };
  },
  methods: {
    openLink(link) {
      window.open(link, "_system");
    },
    async listarDispositivos() {
      this.procurandoDispositivo = true;
      const res = await this.btService.searchDevice();
      this.devices = res;
      this.procurandoDispositivo = false;
    },
    async conectarDispositivo(device) {
      Loading.show({
        message: "Estabelecendo conexão com o dispositivo",
      });
      if (await this.btService.isEneabled())
        if (await this.btService.isConnected()) {
          await this.btService.disconnect();
        }
      this.btService
        .connectDevice(device)
        .then(() => {
          Notify.create({
            message: "Dispositivo conectado com sucesso",
            color: "positive",
          });
          this.$store.commit("setDevice", device);
          this.$router.push("/projeto/principal");
        })
        .finally(() => {
          Loading.hide();
        });
    },
  },
  created() {
    this.listarDispositivos();
  },
});
</script>

<style></style>
