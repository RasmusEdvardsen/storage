<template>
  <v-card id="home-storage">
    <v-card-title class="indigo white--text headline">User Directory</v-card-title>
    <v-treeview :items="containers"></v-treeview>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

/* azure storage */
import { ContainerItem } from '@azure/storage-blob/typings/lib/generated/lib/models';

import { homestorage } from '../test';

@Component
export default class HomeStorage extends Vue {
  public containers: ContainerItem[] = [];

  public async mounted() {
    const containers = await homestorage();
    if (Array.isArray(containers)) {
      this.containers = containers;
    }
  }
}
</script>


<style scoped>
.v-treeview {
  max-height: 800px;
  overflow-y: auto;
}
.v-card {
  width: calc(60%);
}
</style>
