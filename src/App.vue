<template>
  <div id="app">
    hello
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { get, post } from './web/web';

import { homestorage } from './test';

@Component
export default class App extends Vue {
  public async mounted() {
    homestorage();
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
