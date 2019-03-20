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
        ></v-treeview>
      </v-flex>
      <v-flex d-flex text-xs-center>
        <v-scroll-y-transition mode="out-in">
          {{selected}}
          <!-- <div
            v-if="!selected"
            class="title grey--text text--lighten-1 font-weight-light"
            style="align-self: center;"
          >Select a User</div>
          <v-card v-else :key="selected.id" class="pt-4 mx-auto" flat max-width="400">
            <v-card-text>
              <v-avatar v-if="avatar" size="88">
                <v-img :src="`https://avataaars.io/${avatar}`" class="mb-4"></v-img>
              </v-avatar>
              <h3 class="headline mb-2">{{ selected.name }}</h3>
              <div class="blue--text mb-2">{{ selected.email }}</div>
              <div class="blue--text subheading font-weight-bold">{{ selected.username }}</div>
            </v-card-text>
            <v-divider></v-divider>
            <v-layout tag="v-card-text" text-xs-left wrap>
              <v-flex tag="strong" xs5 text-xs-right mr-3 mb-2>Company:</v-flex>
              <v-flex>{{ selected.company.name }}</v-flex>
              <v-flex tag="strong" xs5 text-xs-right mr-3 mb-2>Website:</v-flex>
              <v-flex>
                <a :href="`//${selected.website}`" target="_blank">{{ selected.website }}</a>
              </v-flex>
              <v-flex tag="strong" xs5 text-xs-right mr-3 mb-2>Phone:</v-flex>
              <v-flex>{{ selected.phone }}</v-flex>
            </v-layout>
          </v-card>-->
        </v-scroll-y-transition>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

/* azure storage */
import { ContainerItem } from "@azure/storage-blob/typings/lib/generated/lib/models";
import { IBlobsByContainer } from "@/homestorage/module/homeStorageState";

import IFolderStructure from "./models/IFolderStructure";

/* tree */
import { pathStringsToTreeStructure, findInTree } from './utils/treeUtils';

const namespace = "homeStorage";

@Component
export default class HomeStorage extends Vue {
  @Action("getContainers", { namespace })
  public getContainers: any;

  @Action("getBlobsByContainer", { namespace })
  public getBlobsByContainer: any;

  @Getter("containers", { namespace })
  public containers!: ContainerItem[];

  @Getter("blobsByContainer", { namespace })
  public blobsByContainer!: IBlobsByContainer;

  public active: string[] = [];
  public open: string[] = [];

  public async mounted() {
    await this.getContainers();
    this.getBlobsByContainer("homestorage");
  }

  get tree(): any[] {
    if (this.blobsByContainer.blobs.length < 1) {
      return [];
    }
    let strs: string[] = this.blobsByContainer.blobs.map(b => b.name);
    let tree = pathStringsToTreeStructure(strs);
    return tree;
  }

  get selected() {
    if (this.active.length < 1) return undefined;
    const id = this.active[0];
    let node = findInTree(this.tree, id);
    console.log(node);
    return node;
  }
}
</script>


<style scoped>
.v-treeview {
  text-align: start;
  max-height: 800px;
  overflow-y: auto;
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
