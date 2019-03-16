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

  public async mounted() {
    await this.getContainers();
    this.getBlobsByContainer('homestorage');
    const strs: string[] = this.blobsByContainer.blobs.map((b) => b.name);
    treeStructure(strs);
  }

  // public rec(strs: string[]): IFolderStructure[] {
  //   let folders = strs.reduce((acc, curr) => {
  //     if (typeof(curr) !== 'string') return curr;

  //     let split = curr.split('/');
  //     let folderStructure: IFolderStructure = {
  //         id: split[0],
  //         name: split[0],
  //         children: [split.slice(1).join('/')]
  //     }

  //     let existing = acc.find(c => c.name === folderStructure.name);
  //     if (!existing) acc.push(folderStructure);
  //     else (existing.children as string[]).push(split.slice(1).join('/'));

  //     return acc;
  //   }, Array<IFolderStructure>())

  //   return folders;
  // }
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
