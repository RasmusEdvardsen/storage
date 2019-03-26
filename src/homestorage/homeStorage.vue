<template>
  <div id="home-storage">
    <ul id="trees-wrapper">
      <tree-item class="item" :item="tree"/>
    </ul>
    <!-- make into preview component -->
    <div id="preview">
      <div id="to-be-preview-component" v-if="activeBlob && previewUrl.length > 0">
        <div class="">
          {{name(activeBlob.name)}}
        </div>
        <div class="file-info">
          <div class="content-type">
            {{activeBlob.properties.contentType}}
          </div>
          <div class="download" @click="download(activeBlob)">
            download
          </div>
        </div>
        <img id="viewurl" :src="previewUrl" alt>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

/* components */
import TreeItem from './components/treeItem.vue';

/* azure storage */
import {
  ContainerItem,
  BlobItem,
} from '@azure/storage-blob/typings/lib/generated/lib/models';
import { IBlobsByContainer } from '@/homestorage/module/homeStorageState';

/* tree */
import { pathStringsToTreeStructure, findInTree } from './utils/treeUtils';

/* sas */
import getSasToken from '@/azure/getSasToken';
import downloadBlob from '@/azure/downloadBlob';

const namespace = 'homeStorage';

@Component({
  components: {
    'tree-item': TreeItem,
  },
})
export default class HomeStorage extends Vue {
  @Action('getContainers', { namespace })
  public getContainers: any;

  @Action('getBlobsByContainer', { namespace })
  public getBlobsByContainer: any;

  @Getter('containers', { namespace })
  public containers!: ContainerItem[];

  @Getter('blobsByContainerTree', { namespace })
  public tree!: any;

  @Getter('blobByName', { namespace })
  public blobByName!: any;

  @Getter('activeBlob', { namespace })
  public activeBlob!: BlobItem;

  public previewUrl: string = '';

  public async mounted() {
    await this.getContainers();
    this.getBlobsByContainer('homestorage');
  }

  @Watch('activeBlob', { deep: true })
  public async onActiveBlobChanged(value: BlobItem | null) {
    if (value === null) {
      this.previewUrl = '';
      return;
    }
    const blobStorageUrl =
      'https://storageanarae.blob.core.windows.net/homestorage';
    const namePath = '/' + value.name;
    const token = await getSasToken();
    this.previewUrl = blobStorageUrl + namePath + token;
  }

  public async download(blob: BlobItem): Promise<void> {
    if (!blob) { return; }

    const token = await getSasToken();
    if (typeof token !== 'string') { return; }

    downloadBlob(token, 'homestorage', blob.name, this.name(blob.name));
  }

  public name(name: string) {
    const strArr: string [] = name.split('/');
    return strArr[strArr.length - 1];
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
#to-be-preview-component > img {
  max-width: 100%;
  max-height: 100%;
}
</style>
