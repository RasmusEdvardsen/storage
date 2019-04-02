<template>
  <div id="app">
    <home-storage />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

/* components */
import HomeStorage from "./homestorage/homeStorage.vue";

@Component({
  components: {
    "home-storage": HomeStorage,
  },
})
export default class App extends Vue {}
</script>


<style>
#app {
  width: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.mt-10 { margin-top: 10px; }
.mr-10 { margin-right: 10px; }
.mb-10 { margin-bottom: 10px; }
.ml-10 { margin-left: 10px; }

.mt-5 { margin-top: 5px; }
.mr-5 { margin-right: 5px; }
.mb-5 { margin-bottom: 5px; }
.ml-5 { margin-left: 5px; }

/* spinner */
.lds-dual-ring {
  display: inline-block;
  width: 64px;
  height: 64px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 46px;
  height: 46px;
  margin: 1px;
  border-radius: 50%;
  border: 5px solid #2196f3;
  border-color: #2196f3 transparent #2196f3 transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
