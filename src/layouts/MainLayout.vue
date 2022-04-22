<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="flex justify-between">
        <q-btn flat color="white" icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title class="text-center">
          Smart Beer
        </q-toolbar-title>
        <div>{{appVersion}}</div>
      </q-toolbar>
    </q-header>

    <q-page-container class="q-pa-md">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import {version} from '../../package.json'
export default defineComponent({
  name: 'MainLayout',
  computed: {
    appVersion() {
      return version
    }
  }
})
</script>
