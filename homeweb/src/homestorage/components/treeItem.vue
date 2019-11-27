<template>
  <li>
    <div class="item mb-5" @click="itemClick(item)" @contextmenu.prevent="toggle=true">
      <div :class="[icon, 'item-icon', 'mr-10', 'ml-10']"></div>
      <input
        ref="fileNameInput"
        v-if="showNewFileInput"
        v-model="newFileName"
        type="text"
        @blur="showNewFileInput=false"
        @keyup.enter="newFileNameEntered()"
        placeholder="New file name"
      />
      <div :class="['item-name', 'mr-10', 'ml-10', isActive]" v-else>{{ item.name }}</div>
      <div
        :class="toggle ? 'far fa-minus-square' : 'far fa-plus-square'"
        @click.stop="toggle=!toggle"
      ></div>
      <dropdown :toggle="toggle" v-model="toggle">
        <div slot="content" v-if="!isFolder">
          <div class="option" @click.stop="rename(item)">Rename</div>
        </div>
        <div slot="content" v-else>
          <div class="option" @click.stop="newFolderOption">New folder</div>
          <div class="option" @click.stop>
            <div class="file-click">New file(s)</div>
            <!-- @change only fires when different file uploaded. -->
            <input type="file" id="new-file" @change="newFilesSelected($event)" multiple />
          </div>
        </div>
      </dropdown>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <tree-item class="item" v-for="(child, index) in item.children" :key="index" :item="child"></tree-item>
    </ul>
    <input
      ref="folderNameInput"
      v-if="showFolderInput"
      v-model="folderName"
      type="text"
      @blur="showFolderInput=false"
      @keyup.enter="newFolderEntered()"
      placeholder="Folder name"
    />
  </li>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

import { Action, Getter } from "vuex-class";

import { BlobItem } from "@azure/storage-blob/typings/src/generated/src/models";

import Dropdown from "@/generic/dropdown.vue";

import * as log from "@/log/log";

import {
  EventBus,
  Event as CustomEvents,
  IEventNewFiles,
} from "@/homestorage/eventBus.ts";

const namespace = "homeStorage";

@Component({
  name: "tree-item",
  components: {
    dropdown: Dropdown,
  },
})
export default class TreeItem extends Vue {
  @Prop() public item!: any;
  @Action("setActiveBlob", { namespace }) public setActiveBlob: any;
  @Action("getBlobsByContainer", { namespace }) public getBlobsByContainer: any;
  @Action("createFolder", { namespace }) public createFolder: any;
  @Action("renameFile", { namespace }) public renameFile: any;
  @Getter("activeBlob", { namespace }) public activeBlob!: BlobItem;

  public isOpen: boolean = false;
  public toggle: boolean = false;

  public showFolderInput: boolean = false;
  public showNewFileInput: boolean = false;

  public folderName: string = "";
  public newFileName: string = "";

  public $refs!: {
    folderNameInput: HTMLInputElement;
    fileNameInput: HTMLInputElement;
  };

  get isFolder(): boolean {
    return this.item.children && this.item.children.length;
  }

  get icon(): string {
    const str =
      "far " +
      (this.isFolder
        ? this.isOpen
          ? "fa-folder-open"
          : "fa-folder"
        : " fa-file");
    return str;
  }

  get isActive() {
    return this.activeBlob && this.activeBlob.name === this.item.fullPath
      ? "active"
      : "";
  }

  public itemClick(item: any) {
    if (this.isFolder) {
      this.isOpen = !this.isOpen;
    } else if (item.fullPath) {
      this.setActiveBlob(item.fullPath);
    }
  }

  public async rename(item: any) {
    this.toggle = false;
    this.showNewFileInput = true;
    this.focusOnInput("fileNameInput");
  }

  public async newFileNameEntered() {
    this.showNewFileInput = false;
    if (this.newFileName.length < 1 && !this.item.fullPath) {
      return;
    }
    const fullPath: string = this.item.fullPath;
    const path: string = fullPath
      .split("/")
      .slice(0, -1)
      .join("/");
    const extensionArr = (this.item.name as string).split(".");
    const extension = extensionArr[extensionArr.length - 1];
    const fileName =
      path.length > 0
        ? path + "/" + this.newFileName + "." + extension
        : this.newFileName + "." + extension;
    const oldName = this.item.fullPath || this.item.name;
    const newName = fileName;
    await this.renameFile({ containerName: "homestorage", oldName, newName });
    await this.getBlobsByContainer("homestorage");
    this.showNewFileInput = false;
    this.newFileName = "";
  }

  public async newFolderOption() {
    this.closeContextMenuAndOpenFolder();
    this.showFolderInput = true;
    this.focusOnInput("folderNameInput");
  }

  public async newFolderEntered() {
    const fullPath: string = this.item.fullPath;
    if (this.folderName.length < 1 && !this.item.fullPath) {
      return;
    }
    const folderName =
      fullPath.length > 0 ? fullPath + "/" + this.folderName : this.folderName;
    await this.createFolder({ containerName: "homestorage", folderName });
    await this.getBlobsByContainer("homestorage");
    this.showFolderInput = false;
    this.folderName = "";
  }

  public async newFilesSelected(e: Event): Promise<void> {
    this.closeContextMenuAndOpenFolder();

    const fileList = (e.target as HTMLInputElement).files;
    if (!fileList || fileList.length < 1) {
      return;
    }
    if (!this.item.fullPath) {
      return;
    }

    const newFiles: IEventNewFiles = {
      fileList,
      folderPath: this.item.fullPath,
    };
    EventBus.$emit(CustomEvents.NEWFILES, newFiles);

    return;
  }

  public async focusOnInput(ref: string) {
    await this.$nextTick();
    try {
      const keyVal = Object.entries(this.$refs).find((x) => x[0] === ref);
      if (!keyVal) {
        return;
      }
      const input: HTMLInputElement = keyVal[1];
      input.focus();
    } catch (error) {
      return;
    }
  }

  public closeContextMenuAndOpenFolder() {
    this.toggle = false;
    this.isOpen = true;
  }
}
</script>

<style scoped>
.item {
  display: table;
}
.item .item-icon,
.item .item-name {
  display: inline;
}
.item-name.active {
  background-color: #5c768c;
  color: white;
  border-radius: 20px;
  padding: 2px 20px;
}
.option {
  position: relative;
  overflow: hidden;
}

.option:not(:last-child) {
  padding-bottom: 10px;
  margin-bottom: 10px;

  border-bottom: 1px solid gainsboro;
}

.option input[type="file"] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
}
.option:hover {
  cursor: pointer;
}
</style>
