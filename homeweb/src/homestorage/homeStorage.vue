<template>
  <div id="home-storage-wrapper">
    <div class="logout" @click="logout" v-if="isLoggedIn()">logout</div>
    <div id="home-storage">
      <modal class="login" :toggle="toggle" v-model="toggle" :blocking="true">
        <div slot="content">
          <button @click="login">Login with microsoft account</button>
        </div>
      </modal>
      <ul id="trees-wrapper">
        <tree-item class="item" :item="tree" />
      </ul>
      <div class="divider mt-10 mb-10"></div>
      <div id="preview">
        <preview-wrapper />
      </div>
      <upload-files-progress ref="ufp" />
    </div>
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
import Modal from "@/generic/modal.vue";

/* azure storage */
import {
  ContainerItem,
  BlobItem
} from "@azure/storage-blob/typings/src/generated/src/models";
import { IBlobsByContainer } from "@/homestorage/module/homeStorageState";

/* tree */
import { pathStringsToTreeStructure, findInTree } from "./utils/treeUtils";
import { name } from "./utils/arrUtils";

/* sas */
import getSasToken from "@/azure/getSasToken";
import downloadBlob from "@/azure/downloadBlob";

/* events */
import { EventBus, Event, IEventNewFiles } from "@/homestorage/eventBus.ts";

/* auth */
import { user } from "../auth/user";

const namespace = "homeStorage";

@Component({
  components: {
    "tree-item": TreeItem,
    "upload-files-progress": UploadFilesProgress,
    "preview-wrapper": PreviewWrapper,
    modal: Modal
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

  public toggle: boolean = false;

  public mounted() {
    if (user.isLoggedIn()) this.loginSuccess();
    else this.toggle = true;
  }

  public async login() {
    user.loginPopup(this.loginSuccess);
  }

  public async logout() {
    user.logout();
  }

  public isLoggedIn(): boolean {
    return user.isLoggedIn();
  }

  public async loginSuccess() {
    this.toggle = false;
    await this.getContainers();
    await this.getBlobsByContainer("homestorage");
    EventBus.$on(Event.NEWFILES, this.openUploadFilesProgress);
  }

  public async openUploadFilesProgress(newFiles: IEventNewFiles) {
    const ufp: UploadFilesProgress = this.$refs.ufp as UploadFilesProgress;
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
  min-height: 300px;
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
  border: 1px solid #5c768c;
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
    margin: unset;
  }
}
</style>

<style>
ul,
li {
  list-style-type: none;
}
</style>
