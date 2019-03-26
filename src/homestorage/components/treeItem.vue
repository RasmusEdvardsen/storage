<template>
  <li>
    <div class="item" @click="itemClick(item)" @contextmenu="contextMenuHandler($event)">
      <div :class="[icon, 'item-icon', 'mr-10', 'ml-10']"></div>
      <div class="item-name mr-10 ml-10">{{ item.name }}</div>
      <div v-if="showContextMenu" class="context-menu">this will be a dropdown</div>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <tree-item class="item" v-for="(child, index) in item.children" :key="index" :item="child"></tree-item>
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
  public setActiveBlob: any;

  @Getter("activeBlob", { namespace })
  public activeBlob!: BlobItem;

  public isOpen: boolean = false;

  showContextMenu: boolean = false;

  get isFolder(): boolean {
    return this.item.children && this.item.children.length;
  }

  get icon(): string {
    let str =
      "far " +
      (this.isFolder
        ? this.isOpen
          ? "fa-folder-open"
          : "fa-folder"
        : " fa-file");
    console.log(str);
    return str;
  }

  contextMenuHandler(e: MouseEvent) {
    if (!this.isFolder) return;
    
    e.preventDefault();
    this.showContextMenu = !this.showContextMenu;
  }

  itemClick(item: any) {
    if (this.isFolder) {
      this.isOpen = !this.isOpen;
    } else if (item.fullPath) {
      this.setActiveBlob(item.fullPath);
    }
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
</style>
