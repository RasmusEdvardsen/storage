<template>
  <div id="home-storage">
    <ul id="trees-wrapper">
      <tree-item class="item" :item="tree" @item-click="itemClick"/>
    </ul>
    <!-- make into preview component -->
    <div id="preview">
      <div id="to-be-preview-component" v-if="activeBlob">
        {{previewUrl}}
        <img id="viewurl" :src="previewUrl" alt>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

/* components */
import TreeItem from "./components/treeItem.vue";

/* azure storage */
import {
  ContainerItem,
  BlobItem
} from "@azure/storage-blob/typings/lib/generated/lib/models";
import { IBlobsByContainer } from "@/homestorage/module/homeStorageState";

/* tree */
import { pathStringsToTreeStructure, findInTree } from "./utils/treeUtils";

/* sas */
import getSasToken from "@/azure/getSasToken";
import downloadBlob from "@/azure/downloadBlob";

const namespace = "homeStorage";

@Component({
  components: {
    "tree-item": TreeItem
  }
})
export default class HomeStorage extends Vue {
  @Action("getContainers", { namespace })
  public getContainers: any;

  @Action("getBlobsByContainer", { namespace })
  public getBlobsByContainer: any;

  @Getter("containers", { namespace })
  public containers!: ContainerItem[];

  @Getter("blobsByContainerTree", { namespace })
  public tree!: any;

  @Getter("blobByName", { namespace })
  public blobByName!: any;

  @Getter("activeBlob", { namespace })
  activeBlob!: BlobItem;

  public open: string[] = [];

  public async mounted() {
    await this.getContainers();
    this.getBlobsByContainer("homestorage");
  }

  get previewUrl(): string {
    return 'previewUrl';
  }
  itemClick(item: any) {
    console.log(item);
  }

  public async download(blob: BlobItem, node: any): Promise<void> {
    if (!blob) return;

    const token = await getSasToken();
    if (typeof token !== "string") return;

    downloadBlob(token, "homestorage", blob.name, node.name);
  }
}
</script>


<style scoped>
#home-storage {
  display: flex;
  width: 1200px;
  border-radius: 20px;
  border: 2px solid cornflowerblue;

  -webkit-box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.5);
}
#home-storage * {
  width: fit-content;
}
#trees-wrapper >>> .fit {
  width: fit-content;
}
#to-be-preview-component {
  margin: 20px;
}
</style>
