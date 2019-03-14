<template>
  <v-card id="home-storage">
    <v-card-title class="indigo white--text headline">User Directory</v-card-title>
    <v-treeview :items="blobsByContainer.blobs"></v-treeview>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

/* azure storage */
import { ContainerItem } from '@azure/storage-blob/typings/lib/generated/lib/models';
import { IBlobsByContainer } from '@/homestorage/module/homeStorageState';

import { homestorage } from '../test';

const namespace = 'homeStorage';

@Component
export default class HomeStorage extends Vue {
  @Action('getContainers', { namespace })
  getContainers: any;

  @Action('getBlobsByContainer', { namespace })
  getBlobsByContainer: any;

  @Getter('containers', { namespace })
  containers!: ContainerItem[];

  @Getter('blobsByContainer', { namespace })
  blobsByContainer!: IBlobsByContainer;

  public async mounted() {
    await this.getContainers();
    this.getBlobsByContainer('homestorage');
    this.stringsToFolderStructureRec(this.blobsByContainer.blobs.map(b => b.name));
  }

  stringsToFolderStructureRec(strs: string[]) {
    let blobPathsArrs: string[][] = strs.map(str => str.split('/'))
    console.log(blobPathsArrs);
    
  }
}
</script>


<style scoped>
.v-treeview {
  text-align: start;
  max-height: 800px;
  overflow-y: auto;
}
.v-card {
  width: calc(60%);
}
</style>
