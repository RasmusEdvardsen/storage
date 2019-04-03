<template>
  <div id="home-storage">
    <ul id="trees-wrapper">
      <tree-item class="item" :item="tree"/>
    </ul>
    <div class="divider mt-10 mb-10"></div>
    <div id="preview">
      <preview-wrapper/>
    </div>
    <upload-files-progress ref="ufp"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

/* components */
import TreeItem from "./components/treeItem.vue";
import UploadFilesProgress from "./components/uploadFilesProgress.vue";
import PreviewWrapper from "./components/previewWrapper.vue";

/* azure storage */
import {
  ContainerItem,
  BlobItem,
} from "@azure/storage-blob/typings/lib/generated/lib/models";
import { IBlobsByContainer } from "@/homestorage/module/homeStorageState";

/* tree */
import { pathStringsToTreeStructure, findInTree } from "./utils/treeUtils";
import { name } from "./utils/arrUtils";

/* sas */
import getSasToken from "@/azure/getSasToken";
import downloadBlob from "@/azure/downloadBlob";

/* events */
import { EventBus, Event, IEventNewFiles } from "@/homestorage/eventBus.ts";

const namespace = "homeStorage";

@Component({
  components: {
    "tree-item": TreeItem,
    "upload-files-progress": UploadFilesProgress,
    "preview-wrapper": PreviewWrapper,
  },
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

  public $refs!: {
    ufp: UploadFilesProgress;
  };

  public async mounted() {
    await this.getContainers();
    await this.getBlobsByContainer("homestorage");
    EventBus.$on(Event.NEWFILES, this.openUploadFilesProgress);
  }

  public async openUploadFilesProgress(newFiles: IEventNewFiles) {
    const ufp: UploadFilesProgress = this.$refs.ufp;
    await ufp.openAndShowProgress(newFiles.fileList, newFiles.folderPath);
    await this.getBlobsByContainer("homestorage");
  }

  public name(str: string): string {
    return name(str);
  }
}
</script>

<style scoped>
#home-storage {
  display: flex;
  position: relative;
  width: 1200px;
  margin: -2px 0 0 -2px;
  overflow-x: auto;

  border-radius: 4px;
  border: 2px solid #5c768c;

  -webkit-box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
}
#trees-wrapper,
#preview {
  width: calc(49%);
}
#trees-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: 85px;
}
.divider {
  border-left: 1px solid #5c768c;
  border-right: 1px solid #5c768c;
}
/*** media queries ***/
@media screen and (max-device-width: 1080px) {
  #home-storage {
    width: inherit;
    display: block;
  }
  #trees-wrapper {
    width: initial !important;
  }
  #trees-wrapper * {
    width: max-content;
  }
  #preview {
    width: 100%;
  }
  .divider {
    display: none;
  }
}
</style>

<style>
ul,
li {
  list-style-type: none;
}
</style>
