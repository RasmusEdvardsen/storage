<template>
  <div id="home-storage">
    <ul id="trees-wrapper">
      <tree-item class="item" :item="tree" @make-folder="makeFolder" @add-item="addItem"/>
    </ul>
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

  @Getter('blobsByContainer', { namespace })
  public blobsByContainer!: IBlobsByContainer;

  @Getter('blobByName', { namespace })
  public blobByName!: any;

  public active: string[] = [];
  public open: string[] = [];

  public loading: boolean = false;
  public viewUrl: string = '';

  public tree: any = {};

  public async mounted() {
    await this.getContainers();
    this.getBlobsByContainer('homestorage');
  }

  // get tree(): any {}

  get selected() {
    if (this.active.length < 1) {
      return undefined;
    }
    const id = this.active[0];
    const node = findInTree(this.tree, id);
    const blob = this.blobByName(node.fullPath);
    this.handlePreview(blob, node);

    return { node, blob };
  }

  @Watch('blobsByContainer', { deep: true })
  public onBlobsByContainerChanged(value: any, oldValue: any) {
    if (value.blobs.length < 1) {
      this.tree = {};
    }
    const strs: string[] = value.blobs.map((b: any) => b.name);
    const tree = pathStringsToTreeStructure(strs);
    this.tree = {
      name: 'homestorage',
      children: tree,
    };
  }

  public makeFolder(item: any) {
    Vue.set(item, 'children', []);
    this.addItem(item);
  }

  public addItem(item: any) {
    item.children.push({
      name: 'new stuff',
    });
  }

  public async download(blob: BlobItem, node: any): Promise<void> {
    if (!blob) {
      return;
    }

    const token = await getSasToken();
    if (typeof token !== 'string') {
      return;
    }

    downloadBlob(token, 'homestorage', blob.name, node.name);
  }

  public async handlePreview(blob: any, node: any) {
    this.loading = true;
    const blobStorageUrl =
      'https://storageanarae.blob.core.windows.net/homestorage';
    const namePath = '/' + blob.name;
    const token = await getSasToken();
    this.viewUrl = blobStorageUrl + namePath + token;
    // if (typeof(token) === 'string') { downloadBlob(token, 'homestorage', blob.name, node.name); }
    this.loading = false;
  }
}
</script>


<style scoped>
#home-storage {
  width: 1200px;
  border-radius: 20px;
  background-color: lavender;
  border: 2px solid cornflowerblue;
}
#home-storage * {
  width: fit-content;
}
#trees-wrapper >>> .fit {
  width: fit-content;
}
</style>
