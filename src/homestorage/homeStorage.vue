<template>
  <v-card id="home-storage">
    <v-card-title class="indigo white--text headline">User Directory</v-card-title>
    <v-layout justify-space-between pa-3>
      <v-flex xs5>
        <v-treeview
          :active.sync="active"
          :items="tree"
          :open.sync="open"
          activatable
          active-class="primary--text"
          class="grey lighten-5"
          open-on-click
          transition
        />
      </v-flex>
      <v-flex d-flex text-xs-center>
        <v-scroll-y-transition mode="out-in">
          <div
            v-if="!selected"
            class="title grey--text text--lighten-1 font-weight-light"
            style="align-self: center;"
          >Select a file</div>
          <v-card v-else :key="selected.node.id" class="pt-4 mx-auto" flat max-width="400">
            <v-card-text>
              <h3 class="headline mb-2 blue--text">{{ selected.node.name }}</h3>
              <div class="subheading">{{ selected.blob.properties.contentType }}</div>
            </v-card-text>
            <v-layout tag="v-card-text">
              <v-flex>
                <div v-if="loading" class="loading"></div>
                <v-container fluid v-else-if="!loading && viewUrl.length > 0">
                  <v-layout justify-space-around>
                      <v-layout column>
                        <v-img
                          :src="viewUrl" 
                        ></v-img>
                      </v-layout>
                  </v-layout>
                </v-container>
              </v-flex>
            </v-layout>
          </v-card>
        </v-scroll-y-transition>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

/* azure storage */
import {
  ContainerItem,
  BlobItem,
} from '@azure/storage-blob/typings/lib/generated/lib/models';
import { IBlobsByContainer } from '@/homestorage/module/homeStorageState';

/* tree */
import { pathStringsToTreeStructure, findInTree } from './utils/treeUtils';

/* sas */
import getSasToken from '@/sas/getSasToken';
import downloadBlob from '@/sas/downloadBlob';

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

  @Getter('blobByName', { namespace })
  public blobByName!: any;

  public active: string[] = [];
  public open: string[] = [];

  public loading: boolean = false;
  public viewUrl: string = '';

  public async mounted() {
    await this.getContainers();
    this.getBlobsByContainer('homestorage');
  }

  get tree(): any[] {
    if (this.blobsByContainer.blobs.length < 1) {
      return [];
    }
    const strs: string[] = this.blobsByContainer.blobs.map((b) => b.name);
    const tree = pathStringsToTreeStructure(strs);
    return tree;
  }

  get selected() {
    if (this.active.length < 1) { return undefined; }
    const id = this.active[0];
    const node = findInTree(this.tree, id);
    const blob = this.blobByName(node.fullPath);
    this.handlePreview(blob);

    return { node, blob };
  }

  public async handlePreview(blob: any) {
    this.loading = true;
    const blobStorageUrl =
      'https://storageanarae.blob.core.windows.net/homestorage';
    const namePath = '/' + blob.name;
    const token = await getSasToken();
    const viewUrl = blobStorageUrl + namePath + token;
    this.viewUrl = viewUrl;
    if (typeof(token) === 'string') { downloadBlob(token, 'homestorage', blob.name); }
    this.loading = false;
  }
}
</script>


<style scoped>
.v-treeview {
  text-align: start;
  overflow-y: auto;
  padding-bottom: 10px;
}
.v-treeview >>> .primary--text {
  color: white;
  background-color: #3f51b5;

  border-radius: 20px;
  padding-right: 10px;

  width: intrinsic; /* Safari/WebKit uses a non-standard name */
  width: -moz-max-content; /* Firefox/Gecko */
  width: -webkit-max-content; /* Chrome */
}
.v-treeview >>> .v-treeview-node__label {
  margin-left: 10px;
}
.v-card {
  width: calc(60%);
}
</style>
