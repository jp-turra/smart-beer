import bluetoothSerial from "../../src-cordova/plugins/cordova-plugin-bluetooth-serial/www/bluetoothSerial.js";
import { Loading, Notify, Platform } from "quasar";

export default class BluetoothService {
  constructor(store, router) {
    this.store = store;
  }

  isEneabled() {
    return new Promise((resolve, reject) => {
      bluetoothSerial.isEnabled(
        () => {
          resolve(true);
        },
        async () => {
          resolve(await this.eneableBluetooth());
        }
      );
    });
  }
  isConnected() {
    return new Promise((resolve, reject) => {
      bluetoothSerial.isConnected(
        () => {
          resolve(true);
        },
        () => {
          resolve(false);
        }
      );
    });
  }
  eneableBluetooth() {
    return new Promise((resolve, reject) => {
      if (Platform.is.android) {
        bluetoothSerial.enable(
          () => {
            resolve(true);
          },
          () => {
            Notify.create({
              message: "Verifique se o seu bluetooth está ativo.",
              color: "warning",
            });
            resolve(false);
          }
        );
      } else {
        Notify.create({
          message: "Verifique se o seu bluetooth está ativo.",
          color: "warning",
        });
        resolve(false);
      }
    });
  }

  searchDevice() {
    return new Promise(async (resolve, reject) => {
      if (Platform.is.ios) bluetoothSerial.list(resolve, reject);
      else {
        bluetoothSerial.list((list) => {
          bluetoothSerial.discoverUnpaired((listNew) => {
            listNew = listNew.map((item) => {
              return {
                ...item,
                new: true,
              };
            });
            resolve(listNew.concat(list));
          }, reject);
          let devices = [];
          bluetoothSerial.setDeviceDiscoveredListener((device) => {
            console.log("new device ", device.name);
            device.new = true;
            devices.push(device);
          });
          setTimeout(() => {
            bluetoothSerial.clearDeviceDiscoveredListener();
            devices = devices.concat(list);
            devices.sort((a, b) => {
              return a.name < b.name ? -1 : 1;
            });
            resolve(devices);
          }, 10000);
        }, reject);
      }
    });
  }
  connectDevice(device) {
    return new Promise((resolve, reject) => {
      bluetoothSerial.connect(
        device.id,
        (item) => {
          this.device = device;
          resolve(item);
        },
        () => {
          this.unsubscribe();
          if (this.store) this.store.commit("setDevice", {});
          if (this.router) this.router.push("/setup");
          bluetoothSerial.clearDeviceDiscoveredListener();
          reject();
        }
      );
    });
  }
  sendData(device, data) {
    return new Promise(async (resolve, reject) => {
      if (!device) {
        Notify.create({
          message: "Nenhum dispositivo conectado",
          color: "warning",
        });
        if (this.store) this.store.commit("setDevice", {});
        if (this.router) this.router.push("/setup");
        reject(false);
      } else if (!(await this.isEneabled())) {
        if (this.store) this.store.commit("setDevice", {});
        if (this.router) this.router.push("/setup");
        Notify.create({
          message: "Bluetooth não habilitado.",
          color: "warning",
        });
        reject(false);
      } else if (!(await this.isConnected())) {
        if (this.store) this.store.commit("setDevice", {});
        if (this.router) this.router.push("/setup");
        Notify.create({
          message: "Nenhum dispositivo conectado",
          color: "warning",
        });
        reject(false);
      } else {
        console.log("enviando ", "send - " + JSON.stringify(data));
        this.store.commit("pushHistory", data);
        bluetoothSerial.write(data, resolve, reject);
      }
    });
  }
  readData() {
    return new Promise((resolve, reject) => {
      bluetoothSerial.readUntil("\n", resolve, reject);
    });
  }
  disconnect() {
    return new Promise((resolve, reject) => {
      bluetoothSerial.disconnect(() => {
        this.unsubscribe();
        bluetoothSerial.clearDeviceDiscoveredListener();
        resolve();
      }, reject);
    });
  }
  subscribe() {
    bluetoothSerial.subscribe(
      "\n",
      (data) => {
        console.log("Data Recived ", data);
        this.store.commit("setLastMessage", data);
      },
      () => {
        console.log("Erro ao subscribe");
      }
    );
  }
  unsubscribe() {
    return new Promise((resolve, reject) => {
      bluetoothSerial.unsubscribe(resolve, reject);
    });
  }
}
