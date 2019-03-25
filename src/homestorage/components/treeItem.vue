<template>
  <li>
    <div :class="{bold: isFolder, 'fit': true}" @click="toggle" @dblclick="makeFolder">
      {{ item.name }}
      <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <tree-item
        class="item fit"
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        @make-folder="$emit('make-folder', $event)"
        @add-item="$emit('add-item', $event)"
      ></tree-item>
      <li class="add fit" @click="$emit('add-item', item)">+</li>
    </ul>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class TreeItem extends Vue {
  @Prop({ type: Object as () => {}, default: Object as () => {} })
  public item!: any;

  public isOpen: boolean = false;

  get isFolder() {
    return this.item.children && this.item.children.length;
  }

  public toggle() {
    if (this.isFolder) {
      this.isOpen = !this.isOpen;
    }
  }

  public makeFolder() {
    if (!this.isFolder) {
      this.$emit('make-folder', this.item);
      this.isOpen = true;
    }
  }
}
</script>

<style scoped>
</style>
