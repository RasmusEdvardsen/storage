<template>
  <modal class="upload-files-progress" :toggle="toggle" v-model="toggle" :blocking="true">
    <div slot="content">
      <div class="num-file">Number of files to upload: {{numFiles}}</div>
      <div class="num-files-uploaded">Number of files uploaded: {{numFilesUploaded}}</div>
      <div class="current-file">Name of current file: {{currentFile.name}}</div>
      <div class="current-file-progress">Upload status: {{currentFileProgress}}%</div>
      <button class="btn" :disabled="isUploading" @click="toggle=!toggle">Close</button>
    </div>
  </modal>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import { Action } from "vuex-class";

import Modal from "@/generic/modal.vue";
import { TransferProgressEvent } from "@azure/ms-rest-js";

const namespace = "homeStorage";

@Component({
  components: {
    modal: Modal,
  },
})
export default class UploadFilesProgress extends Vue {
  @Action("uploadFile", { namespace })
  public uploadFile: any;

  public toggle: boolean = false;

  public isUploading = false;

  public numFiles: number = 0;
  public numFilesUploaded: number = 0;
  public currentFile: File = new File([], "");
  public currentFileProgress: number = 0;

  public clearAndClose() {
    this.toggle = false;
    this.numFiles = 0;
    this.numFilesUploaded = 0;
    this.currentFile = new File([], "");
  }

  public async openAndShowProgress(
    fileList: FileList,
    folderPath: string,
  ): Promise<void> {
    const numFiles = fileList.length;

    (this.toggle = true), (this.numFiles = numFiles), (this.isUploading = true);
    try {
      for (let idx = 0; idx < fileList.length; idx++) {
        const file = fileList.item(idx);
        if (!file) {
          return;
        }

        const fileName =
          folderPath.length > 0 ? folderPath + "/" + file.name : file.name;

        this.currentFile = file;

        const uploaded = await this.uploadFile({
          containerName: "homestorage",
          fileName,
          file,
          cb: (progress: TransferProgressEvent) => {
            this.currentFileProgress = Math.floor(
              (progress.loadedBytes / file.size) * 100,
            );
          },
        });
        if (uploaded === 200 || uploaded === 201) {
          this.numFilesUploaded++;
        }
      }
      this.isUploading = false;
      return;
    } catch (error) {
      return;
    }
  }
}
</script>

<style scoped>
</style>
