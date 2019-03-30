<template>
  <modal class="upload-files-progress" :toggle="toggle" v-model="toggle">qwf</modal>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import { Action } from 'vuex-class';

import Modal from "@/generic/modal.vue";
import { TransferProgressEvent } from '@azure/ms-rest-js';

const namespace = 'homeStorage';

@Component({
  components: {
    modal: Modal
  }
})
export default class UploadFilesProgress extends Vue {
  @Action('uploadFile', { namespace })
  uploadFile: any;

  toggle: boolean = false;

  @Watch('toggle')
  onChange(n: boolean, o: boolean) {
      console.log(this.toggle, n, o);
  }

  public async openAndShowProgress(fileList: FileList, folderPath: string) {
    this.toggle = true;
    return;
    // const numFiles = fileList.length;
    // let numFilesUploaded = 0;
    // for (let idx = 0; idx < fileList.length; idx++) {
    //   const file = fileList.item(idx);
    //   if (!file) {
    //     return;
    //   }

    //   const fileName =
    //     folderPath.length > 0 ? folderPath + "/" + file.name : file.name;

    //   const uploaded = await this.uploadFile({
    //     containerName: "homestorage",
    //     fileName,
    //     file,
    //     cb: (progress: TransferProgressEvent) => {
    //       console.log(
    //         `Upload status: ${Math.floor(
    //           (progress.loadedBytes / file.size) * 100
    //         )}%\n${fileName}`
    //       );
    //     }
    //   });
    //   if (uploaded === 200 || uploaded === 201) {
    //     numFilesUploaded++;
    //   }
    // }

    // alert(`Uploaded ${numFilesUploaded} of ${numFiles} files succesfully!`);
  }
}
</script>

<style scoped>
</style>
