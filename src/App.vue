<template>
  <div id="app">
    <home-storage />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

/* components */
import HomeStorage from './homestorage/homeStorage.vue';

@Component({
  components: {
    'home-storage': HomeStorage,
  },
})
export default class App extends Vue {}
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
