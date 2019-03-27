<template>
  <div id="home-storage">
    <ul id="trees-wrapper">
      <tree-item class="item" :item="tree"/>
    </ul>
    <div class="divider mt-10 mb-10"></div>
    <!-- make into preview component -->
    <div id="preview">
      <div id="to-be-preview-component" v-if="activeBlob && previewUrl.length > 0">
        <div class>{{name(activeBlob.name)}}</div>
        <div class="file-info">
          <div class="content-type">{{activeBlob.properties.contentType}}</div>
          <div class="download" @click="download(activeBlob)">download</div>
        </div>
        <div class="preview" v-if="showPreview">
          <video v-if="activeBlobFileType === 'video'" width="100%" height="100%" controls>
            <source :src="previewUrl">
          </video>
          <img v-else-if="activeBlobFileType === 'image'" id="viewurl" :src="previewUrl" alt>
          <div v-else class="empty"></div>
        </div>
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
  public activeBlob!: BlobItem;

  public previewUrl: string = "";
  public showPreview: boolean = true;

  public async mounted() {
    await this.getContainers();
    await this.getBlobsByContainer("homestorage");
  }

  @Watch("activeBlob", { deep: true })
  public async onActiveBlobChanged(value: BlobItem | null) {
    if (value === null) {
      this.previewUrl = "";
      return;
    }
    
    this.showPreview = false;
    await this.$nextTick()
    this.showPreview = true;
    
    const blobStorageUrl =
      "https://storageanarae.blob.core.windows.net/homestorage";
    const namePath = "/" + value.name;
    const token = await getSasToken();
    this.previewUrl = blobStorageUrl + namePath + token;
  }
  // put into util file
  get activeBlobFileType(): string {
    if (this.activeBlob === null || !this.activeBlob.properties.contentType)
      return "";
    switch (this.activeBlob.properties.contentType) {
      case "image/jpeg":
        return "image";
      case "video/quicktime":
        return "video";
      default:
        return "";
    }
  }

  public async download(blob: BlobItem): Promise<void> {
    if (!blob) {
      return;
    }

    const token = await getSasToken();
    if (typeof token !== "string") {
      return;
    }

    downloadBlob(token, "homestorage", blob.name, this.name(blob.name));
  }

  public name(name: string) {
    const strArr: string[] = name.split("/");
    return strArr[strArr.length - 1];
  }
}
</script>

<style scoped>
#home-storage {
  display: flex;
  width: 1200px;
  border-radius: 20px;
  border: 2px solid rgb(0, 0, 100);

  -webkit-box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.5);
}
#home-storage > *:not(.divider) {
  width: calc(49%);
}
#to-be-preview-component {
  margin: 20px;
}
#to-be-preview-component > .preview > * {
  max-width: 100%;
  max-height: 100%;
}
.divider {
  border-left: 1px solid gainsboro;
  border-right: 1px solid gainsboro;
}
</style>

<style>
ul,
li {
  list-style-type: none;
}
</style>
