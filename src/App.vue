<template>
  <div id="app">
    hello
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { get, post } from './web/web';

@Component
export default class App extends Vue {
  public async mounted() {
    const payload = {
      container: 'homestorage',
      permissions: 'List',
    };

    const sasTokenUri = 'https://homestoragefunc.azurewebsites.net/api/SasTokenGenerator';
    const sasCall = await post(sasTokenUri, payload);
    if (sasCall.statusCode !== 200 || !sasCall.body) { return; }
    const sasToken = JSON.parse(sasCall.body).token;

    const blobstorageUri = 'https://storageanarae.blob.core.windows.net';
    const containerPropsCall = await get(`${blobstorageUri}/homestorage${sasToken}&restype=container&comp=list`);
  }
}
</script>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
