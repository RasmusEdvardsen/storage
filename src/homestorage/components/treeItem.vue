<template>
  <li>
    <div class="item mb-5" @click="itemClick(item)" @contextmenu="contextMenuHandler($event)">
      <div :class="[icon, 'item-icon', 'mr-10', 'ml-10']"></div>
      <div class="item-name mr-10 ml-10">{{ item.name }}</div>
      <div v-if="isFolder" :class="toggle ? 'far fa-minus-square' : 'far fa-plus-square'" @click.stop="toggle=!toggle"></div>
      <dropdown :toggle="toggle" v-model="toggle">
        <div slot="content">
          <div class="option" @click.stop="newFolderOption">New folder</div>
          <div class="option" @click.stop>
            <div class="file-click">New file</div>
            <input type="file" id="new-file" @change="newFileSelected($event)" multiple>
          </div>
        </div>
      </dropdown>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <tree-item class="item" v-for="(child, index) in item.children" :key="index" :item="child"></tree-item>
      <input
        ref="input"
        v-if="showInput"
        v-model="folderName"
        type="text"
        @blur="showInput=false"
        @keyup.enter="newFolderEntered()"
        placeholder="Folder name"
      >
    </ul>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

import { Action, Getter } from 'vuex-class';

import { BlobItem } from '@azure/storage-blob/typings/lib/generated/lib/models';

import Dropdown from '@/generic/dropdown.vue';

import { info, error } from '@/log/log';

const namespace = 'homeStorage';

@Component({
  name: 'tree-item',
  components: {
    dropdown: Dropdown,
  },
})
export default class TreeItem extends Vue {
  @Prop({ type: Object as () => {}, default: Object as () => {} })
  public item!: any;

  @Action('setActiveBlob', { namespace })
  public setActiveBlob: any;

  @Action('getBlobsByContainer', { namespace })
  public getBlobsByContainer: any;

  @Action('createFolder', { namespace })
  public createFolder: any;

  @Action('uploadFile', { namespace })
  public uploadFile: any;

  @Getter('activeBlob', { namespace })
  public activeBlob!: BlobItem;

  public isOpen: boolean = false;
  public toggle: boolean = false;
  public showInput: boolean = false;

  public folderName: string = '';

  get isFolder(): boolean {
    return this.item.children && this.item.children.length;
  }

  get icon(): string {
    const str =
      'far ' +
      (this.isFolder
        ? this.isOpen
          ? 'fa-folder-open'
          : 'fa-folder'
        : ' fa-file');
    return str;
  }

  public contextMenuHandler(e: MouseEvent) {
    if (!this.isFolder) {
      return;
    }

    e.preventDefault();
    this.toggle = true;
  }

  public itemClick(item: any) {
    if (this.isFolder) {
      this.isOpen = !this.isOpen;
    } else if (item.fullPath) {
      this.setActiveBlob(item.fullPath);
    }
  }

  public async newFolderOption() {
    this.toggle = false;
    this.isOpen = true;
    this.showInput = true;
    await this.$nextTick();
    try {
      const input: HTMLInputElement = this.$refs.input as HTMLInputElement;
      input.focus();
    } catch (error) {
      error(error);
    }
  }

  public async newFolderEntered() {
    //  todo: look into generalized naming validator for both names/folders
    //  no slashes (/), no 'azure', no 'homestorage', no spaces, no '_'.
    const fullPath: string = this.item.fullPath;
    if (this.folderName.length < 1 && !this.item.fullPath) { return; }
    const folderName =
      fullPath.length > 0 ? fullPath + '/' + this.folderName : this.folderName;
    await this.createFolder({ containerName: 'homestorage', folderName });
    await this.getBlobsByContainer('homestorage');
    this.showInput = false;
  }

  public async newFileSelected(e: Event) {
    if (!e.target) { return; }

    const input = e.target as HTMLInputElement;
    const fileList = input.files;
    if (!fileList || fileList.length < 1) { return; }


    const numFiles = fileList.length;
    let numFilesUploaded = 0;
    for (let idx = 0; idx < fileList.length; idx++) {
      const file = fileList.item(idx);
      if (!file) { return; }

      const fullPath: string = this.item.fullPath;
      if (!this.item.fullPath) { return; }
      const fileName = fullPath.length > 0 ? fullPath + '/' + file.name : file.name;

      const uploaded = await this.uploadFile({ containerName: 'homestorage', fileName, file });
      if (uploaded === 200 || uploaded === 201) { numFilesUploaded++; }
    }

    this.toggle = false;
    this.isOpen = true;

    info(`Uploaded ${numFilesUploaded} of ${numFiles} files. \n${fileInfos}`);
    alert(`Uploaded ${numFilesUploaded} of ${numFiles} files succesfully!`);

    await this.getBlobsByContainer('homestorage');
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
}
</style>
