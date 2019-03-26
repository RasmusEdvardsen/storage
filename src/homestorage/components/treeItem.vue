<template>
  <li>
    <div :class="{bold: isFolder, 'fit': true}" @click="itemClick(item)">
      {{ item.name }}
      <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <tree-item
        class="item fit"
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
      ></tree-item>
      <li class="add fit">+</li>
    </ul>
  </li>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { BlobItem } from "@azure/storage-blob/typings/lib/generated/lib/models";

const namespace = "homeStorage";

@Component
export default class TreeItem extends Vue {
  @Prop({ type: Object as () => {}, default: Object as () => {} })
  public item!: any;

  @Action("setActiveBlob", { namespace })
  setActiveBlob: any;

  @Getter("activeBlob", { namespace })
  activeBlob!: BlobItem;

  public isOpen: boolean = false;

  get isFolder() {
    return this.item.children && this.item.children.length;
  }

  public itemClick(item: any) {
    if (this.isFolder) this.isOpen = !this.isOpen;
    else if (item.fullPath) this.setActiveBlob(item.fullPath);
  }
}
</script>

<style scoped>
</style>
