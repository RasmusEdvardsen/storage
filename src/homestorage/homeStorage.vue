<template>
  <v-card id="home-storage">
    <v-card-title class="indigo white--text headline">User Directory</v-card-title>
    <v-treeview :items="tree"></v-treeview>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

/* azure storage */
import { ContainerItem } from '@azure/storage-blob/typings/lib/generated/lib/models';
import { IBlobsByContainer } from '@/homestorage/module/homeStorageState';

import IFolderStructure from './models/IFolderStructure';

import { treeStructure } from './utils/treeStructure';

const namespace = 'homeStorage';

@Component
export default class HomeStorage extends Vue {
  @Action('getContainers', { namespace })
  public getContainers: any;

  @Action('getBlobsByContainer', { namespace })
  public getBlobsByContainer: any;

  @Getter('containers', { namespace })
  public containers!: ContainerItem[];

  @Getter('blobsByContainer', { namespace })
  public blobsByContainer!: IBlobsByContainer;

  public tree = [
    {
      id: 'one',
      name: 'one',
      children: [
        {
          id: 'two',
          name: 'two',
          children: [],
        },
        {
          id: '77',
          name: '77',
          children: [],
        },
      ],
    },
    {
      id: '3',
      name: '3',
      children: [
        {
          id: '4',
          name: '4',
          children: [],
        },
        {
          id: '66',
          name: '66',
          children: [{}],
        },
      ],
    },
  ];

  public async mounted() {
    await this.getContainers();
    this.getBlobsByContainer('homestorage');
    const strs: string[] = this.blobsByContainer.blobs.map((b) => b.name);
    treeStructure(strs);
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
