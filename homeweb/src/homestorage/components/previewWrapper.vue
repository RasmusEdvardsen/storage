<template>
  <div id="preview-wrapper" v-if="activeBlob && previewUrl.length > 0">
    <div class>{{name(activeBlob.name)}}</div>
    <div class="file-info">
      <div class="content-type">{{activeBlob.properties.contentType}}</div>
      <div class="download" @click="download(activeBlob)">download</div>
    </div>
    <div class="preview" v-if="showPreview">
      <video v-if="activeBlobFileType === 'video'" width="100%" height="100%" controls>
        <source :src="previewUrl" />
      </video>
      <img v-else-if="activeBlobFileType === 'image'" id="viewurl" :src="previewUrl" alt />
      <div v-else class="empty"></div>
    </div>
  </div>
  <div class="no-file-selected" v-else>
    <div class="text">no file selected</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

import { BlobItem } from "@azure/storage-blob/typings/src/generated/src/models"; // src/generated/src/models";
import downloadBlob from "@/azure/downloadBlob";

import { name } from "../utils/arrUtils";
import { post } from "../../web/web";

import { user } from "../../auth/user";

const namespace = "homeStorage";
@Component
export default class PreviewWrapper extends Vue {
  @Getter("activeBlob", { namespace })
  public activeBlob!: BlobItem;

  public previewUrl: string = "";
  public showPreview: boolean = true;

  @Watch("activeBlob", { deep: true })
  public async onActiveBlobChanged(value: BlobItem | null) {
    this.previewUrl = "";

    if (value === null) {
      return;
    }

    this.showPreview = false;
    await this.$nextTick();
    this.showPreview = true;

    const blobStorageUrl =
      "https://storageanarae.blob.core.windows.net/homestorage";
    const namePath = "/" + value.name;

    const src = blobStorageUrl + namePath;
    const options = {
      headers: {
        "authorization": "Bearer " + (await user.accessToken()),
        "x-ms-version": "2019-02-02",
      },
    };

    fetch(src, options)
      .then((res) => res.blob())
      .then((blob) => {
        this.previewUrl = URL.createObjectURL(blob);
      });
  }

  // put into util file
  get activeBlobFileType(): string {
    if (this.activeBlob === null || !this.activeBlob.properties.contentType) {
      return "";
    }
    const type: string = this.activeBlob.properties.contentType;
    if (type.includes("image")) {
      return "image";
    }
    if (type.includes("video")) {
      return "video";
    } else {
      return "";
    }
  }

  public async download(blob: BlobItem): Promise<void> {
    if (!blob) {
      return;
    }

    downloadBlob("homestorage", blob.name, this.name(blob.name), true);
  }

  public name(str: string): string {
    return name(str);
  }
}
</script>

<style scoped>
#preview-wrapper {
  margin: 20px;
}
#preview-wrapper > .preview > * {
  max-width: 100%;
  max-height: 100%;
}
.no-file-selected {
  height: calc(100% - 40px);

  margin: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: lightgrey;
}
</style>
